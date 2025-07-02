import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

/* ───────── static build ───────── */
app.use(express.static(path.join(__dirname, '../client/dist')));
app.get(/.*/, (_req, res) =>
    res.sendFile(path.join(__dirname, '../client/dist/index.html'))
);

/* ───────── config ───────── */
const minPlayers = 3;
const maxPlayers = 10;
const questionTimer = 20_000;
const resultTimer = 10_000;

/* ───────── runtime state ───────── */
let players = {}; // socketId → { name, color, currentVote }
let pendingPlayers = {}; // socketId → previewColor

let questionPool = [];
let currentQuestion = null;
let roundTimeout = null;

/* phase tracking for late‑join sync */
let phase = 'lobby'; // 'lobby' | 'question' | 'results'
let phaseDeadlineMs = 0;
let lastVotes = {}; // filled at finishRound()

/* ───────── constants ───────── */
const questions = JSON.parse(await readFile(path.join(__dirname, 'questions.json'), 'utf8'));

// full list of tailwind colors
// const playerColors = [
//     'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal',
//     'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'
// ];

// limited version of colors for 10 players
const playerColors = [ 'orange', 'yellow', 'lime', 'emerald', 'sky', 'blue', 'indigo', 'violet', 'fuchsia', 'pink' ];

/* ───────── helpers ───────── */
const timeRemaining = () =>
    Math.max(0, Math.ceil((phaseDeadlineMs - Date.now()) / 1000));

function broadcastLobbyState() {
    io.emit('lobby-full', Object.keys(players).length >= maxPlayers);
}

function updatePlayerList() {
    io.emit('players-updated',
        Object.entries(players).map(([id, p]) => ({
            socketId: id,
            name: p.name,
            color: p.color
        }))
    );
}

function replacePlayerNamePlaceholder(question, players) {
  if (!question.includes('{{PLAYER_NAME}}')) return question;

  if (players.length === 0) return question.replace(/{{PLAYER_NAME}}/g, 'someone');

  const randomPlayer = players[Math.floor(Math.random() * players.length)];
  const colorClass = `text-${randomPlayer.color}-700`;

  // Return with the span and class attribute (no inline style)
  const coloredName = `<span class="${colorClass}">${randomPlayer.name}</span>`;
  return question.replace(/{{PLAYER_NAME}}/g, coloredName);
}

function getScaledResultTimer(playerCount) {
    const minTime = 9_000;
    const maxTime = 25_000;

    if (playerCount <= minPlayers) return minTime;
    if (playerCount >= maxPlayers) return maxTime;

    const scale = (playerCount - minPlayers) / (maxPlayers - minPlayers);
    return Math.round(minTime + scale * (maxTime - minTime));
}

/* ───────── round flow ───────── */
function startNextRound() {
  if (questionPool.length === 0) { endGame(); return; }

  phase = 'question';

  // Pick a random index
  const randomIndex = Math.floor(Math.random() * questionPool.length);
  currentQuestion = questionPool.splice(randomIndex, 1)[0]; // Remove question from pool

  const playersList = Object.values(players);
  const questionWithName = replacePlayerNamePlaceholder(currentQuestion, playersList);

  phaseDeadlineMs = Date.now() + questionTimer;
  playersList.forEach(p => (p.currentVote = null));

  io.emit('new-question', {
    question: questionWithName,
    players: playersList.map(p => ({ name: p.name, color: p.color })),
    votesCount: 0,
    remaining: timeRemaining()
  });

  roundTimeout = setTimeout(finishRound, questionTimer);
}

function finishRound() {
    const votes = {};
    for (const [id, p] of Object.entries(players))
        if (p.currentVote != null) votes[id] = p.currentVote;

    phase = 'results';

    const playerCount = Object.keys(players).length;
    const scaledResultTimer = getScaledResultTimer(playerCount);

    phaseDeadlineMs = Date.now() + resultTimer;
    lastVotes = votes;

    io.emit('round-result', { status: 'results', votes });

    setTimeout(() => {
        Object.values(players).forEach(p => (p.currentVote = null));
        startNextRound();
    }, scaledResultTimer);
}

function endGame() {
    phase = 'lobby';
    clearTimeout(roundTimeout);
    currentQuestion = null;
    questionPool = [];
    Object.values(players).forEach(p => (p.currentVote = null));
    io.emit('game-ended');
}

/* ───────── connection handler ───────── */
io.on('connection', socket => {
    updatePlayerList();
    broadcastLobbyState();

    /* preview color (duplicates allowed until join) */
    const usedColors = Object.values(players).map(p => p.color); // JOINED only
    const pool = playerColors.filter(c => !usedColors.includes(c));
    const previewColor = pool.length
        ? pool[Math.floor(Math.random() * pool.length)]
        : playerColors[Math.floor(Math.random() * playerColors.length)];

    pendingPlayers[socket.id] = previewColor;

    socket.emit('config', {
        questionTimer: questionTimer / 1000,
        minPlayers,
        color: previewColor,
        colors: playerColors
    })

    if (Object.keys(players).length >= maxPlayers) return;

    /* allow the client to request / change its color */
    socket.on('pick-color', requested => {
        // 1) only accept colors in the palette
        if (!playerColors.includes(requested)) return

        // 2) make sure the color is not used by another joined player
        const taken = Object.entries(players).some(
            ([id, p]) => id !== socket.id && p.color === requested
        )
        if (taken) return

        if (players[socket.id]) {
            /* the player has already joined – switch live */
            players[socket.id].color = requested
            updatePlayerList() // broadcast the change
        } else {
            /* still on the join screen – just remember the preview */
            pendingPlayers[socket.id] = requested
        }

        /* in either case, confirm to that client */
        socket.emit('color-update', requested)
    })


    /* join */
    socket.on('join', rawName => {
        const name = rawName.trim();
        if (!name) return;

        const duplicate = Object.values(players)
            .some(p => p.name.toLowerCase() === name.toLowerCase());
        if (duplicate) {
            socket.emit('join-error', { reason: 'duplicate' });
            return;
        }
        if (Object.keys(players).length >= maxPlayers) return;

        /* pick the final color (your current code) */
        let color = pendingPlayers[socket.id];
        if (Object.values(players).some(p => p.color === color)) {
            const free = playerColors.filter(c =>
                !Object.values(players).some(p => p.color === c)
            );
            color = free[Math.floor(Math.random() * free.length)] || color;
            socket.emit('color-picked', color);
        }

        players[socket.id] = { name, color, currentVote: null };
        delete pendingPlayers[socket.id];

        /* refresh previews that collided */
        Object.entries(pendingPlayers).forEach(([id, preview]) => {
            if (preview === color) {
                // choose a new available preview color
                const used = [
                    ...Object.values(players).map(p => p.color),
                    ...Object.values(pendingPlayers) /* current previews */
                ];
                const freePreview = playerColors.filter(c => !used.includes(c));
                const newPreview =
                    freePreview[Math.floor(Math.random() * freePreview.length)] ||
                    playerColors[Math.floor(Math.random() * playerColors.length)];

                pendingPlayers[id] = newPreview;
                io.to(id).emit('color-update', newPreview); // live update
            }
        });

        updatePlayerList();
        broadcastLobbyState();

        /* late‑join sync */
        if (phase === 'question') {
            socket.emit('new-question', {
                question: currentQuestion,
                players: Object.values(players).map(p => ({ name: p.name, color: p.color })),
                votesCount: Object.values(players).filter(p => p.currentVote != null).length,
                timeRemaining: timeRemaining()
            });
            Object.entries(players).forEach(([id, p]) => {
                if (p.currentVote != null) socket.emit('player-voted', { voterId: id });
            });
        } else if (phase === 'results') {
            socket.emit('round-result', { status: 'results', votes: lastVotes });
        }
    });

    /* start game */
    socket.on('start-game', () => {
        const enough = Object.keys(players).length >= minPlayers && !currentQuestion;
        if (!enough) return;
        questionPool = [...questions];
        startNextRound();
    });

    /* answer */
    socket.on('answer', targetId => {
        const player = players[socket.id];
        if (!player) return;

        const firstVote = player.currentVote === null;
        const changed = player.currentVote !== targetId;
        player.currentVote = targetId;

        io.emit('player-voted', { voterId: socket.id });

        if (firstVote || changed) {
            io.emit('votes-updated', {
                votesCount: Object.values(players).filter(p => p.currentVote != null).length,
                playersCount: Object.keys(players).length
            });
        }

        const everyoneVoted = Object.values(players).every(p => p.currentVote != null);
        if (everyoneVoted) {
            clearTimeout(roundTimeout);
            finishRound();
        }
    });

    /* disconnect */
    socket.on('disconnect', () => {
        delete players[socket.id];
        delete pendingPlayers[socket.id];
        updatePlayerList();
        broadcastLobbyState();
        if (Object.keys(players).length < minPlayers && currentQuestion) endGame();
    });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => console.log(`Server listening on port ${PORT}`));