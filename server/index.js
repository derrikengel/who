import express from 'express'; // A web application framework for Node.js.
import { createServer } from 'http'; // Node's built-in HTTP module.
import { Server } from 'socket.io'; // Library for real-time, bidirectional event-based communication.
import path from 'path'; // Node's built-in module for working with file and directory paths.
import { fileURLToPath } from 'url'; // Node's built-in module to convert file URLs to path strings.
import { readFile } from 'fs/promises'; // Node's built-in module for file system operations, using Promises.

// Get the directory name of the current module. This is a workaround for the absence of __dirname in ES modules.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Initialize an Express application.
const app = express();
// Create an HTTP server using the Express app.
const httpServer = createServer(app);
// Initialize a new instance of socket.io by passing the HTTP server object.
const io = new Server(httpServer);

/* ───────── STATIC BUILD ───────── */
// Serve static files (like HTML, CSS, JS) from the client's 'dist' directory.
app.use(express.static(path.join(__dirname, '../client/dist')));
// A catch-all route that sends the main index.html file for any request that doesn't match a static file.
app.get(/.*/, (_req, res) =>
    res.sendFile(path.join(__dirname, '../client/dist/index.html'))
);

/* ───────── CONFIG ───────── */
// Game configuration constants.
const minPlayers = 3; // The minimum number of players required to start a game.
const maxPlayers = 10; // The maximum number of players allowed in a game.
const questionTimer = 20_000; // The time in milliseconds (20 seconds) players have to answer a question.
const resultTimer = 10_000; // The base time in milliseconds (10 seconds) to display the results of a round.

/* ───────── RUNTIME STATE ───────── */
// These variables hold the state of the game while the server is running.
let players = {}; // Stores active players in the game. Key: socketId, Value: { name, color, currentVote }
let pendingPlayers = {}; // Stores players who have connected but not yet joined. Key: socketId, Value: previewColor
let waitingPlayers = {}; // Stores players who joined mid-game and are waiting for the next round. Key: socketId, Value: { name, color }

let questionPool = []; // An array to hold the questions for the current game, loaded from the JSON file.
let currentQuestion = null; // The question object for the current round.
let roundTimeout = null; // A timeout handle for the end of the question phase.
let roundEnded = false; // A boolean flag to prevent finishRound from being called multiple times.
let resultsTimeout = null; // A timeout handle for the end of the results phase.

/* phase tracking for late‑join sync */
let phase = 'lobby'; // The current phase of the game: 'lobby', 'question', or 'results'.
let phaseDeadlineMs = 0; // The timestamp when the current phase (question/results) will end.
let lastVotes = {}; // Caches the votes of the last round to show to late-joining players.

/* ───────── CONSTANTS ───────── */
// Load questions from a JSON file asynchronously and parse them.
const questions = JSON.parse(await readFile(path.join(__dirname, 'questions.json'), 'utf8'));

// A curated list of Tailwind color name for players, limited to 10 for the maximum number of players.
const playerColors = ['orange', 'yellow', 'lime', 'emerald', 'sky', 'blue', 'indigo', 'violet', 'fuchsia', 'pink'];

/* ───────── HELPERS ───────── */
// Calculates the remaining time in seconds for the current phase.
const timeRemaining = () =>
    Math.max(0, Math.ceil((phaseDeadlineMs - Date.now()) / 1000));

// Broadcasts to all connected clients whether the lobby is full.
function broadcastLobbyState() {
    io.emit('lobby-full', Object.keys(players).length >= maxPlayers);
}

// Emits an updated list of all current players to every connected client.
function updatePlayerList() {
    io.emit('players-updated',
        Object.entries(players).map(([id, p]) => ({
            socketId: id,
            name: p.name,
            color: p.color
        }))
    );
}

// Replaces a placeholder in the question string with a randomly selected player's name, styled with their color.
function replacePlayerNamePlaceholder(question, players) {
    if (!question.includes('{{PLAYER_NAME}}')) return question;

    if (players.length === 0) return question.replace(/{{PLAYER_NAME}}/g, 'someone');

    // Select a random player from the list.
    const randomPlayer = players[Math.floor(Math.random() * players.length)];
    const colorClass = `text-${randomPlayer.color}-700 dark:text-${randomPlayer.color}-300`; // Tailwind CSS class for the player's color.

    // Create an HTML span with the color class to style the player's name.
    const coloredName = `<span class="${colorClass}">${randomPlayer.name}</span>`;
    return question.replace(/{{PLAYER_NAME}}/g, coloredName);
}

// Calculates a dynamic result timer based on the number of players. More players = more time to read results.
function getScaledResultTimer(playerCount) {
    const minTime = 9_000;  // Minimum time for results display.
    const maxTime = 25_000; // Maximum time for results display.

    // Return min/max if player count is at the boundaries.
    if (playerCount <= minPlayers) return minTime;
    if (playerCount >= maxPlayers) return maxTime;

    // Calculate a scaled time between min and max based on the player count.
    const scale = (playerCount - minPlayers) / (maxPlayers - minPlayers);
    return Math.round(minTime + scale * (maxTime - minTime));
}

/* ───────── ROUND FLOW ───────── */
// This function starts the next round of the game.
function startNextRound() {
    // First, move any players from the waiting list into the active players list.
    Object.entries(waitingPlayers).forEach(([id, info]) => {
        // Check if the waiting player's color is now taken by an active player.
        if (Object.values(players).some(p => p.color === info.color)) {
            // Find a color that is not currently in use.
            const free = playerColors.filter(c =>
                !Object.values(players).some(p => p.color === c)
            );
            // Assign a new random color from the available pool.
            info.color = free[Math.floor(Math.random() * free.length)] || info.color;
            // Notify the player of their new color.
            io.to(id).emit('color-picked', info.color);
        }
        // Add the player to the active players list.
        players[id] = { ...info, currentVote: null };
        const sock = io.sockets.sockets.get(id);
        if (sock) sock.join('game'); // Add the player's socket to the 'game' room.
    });

    waitingPlayers = {}; // Clear the waiting list.
    updatePlayerList(); // Send the updated player list to all clients.

    roundEnded = false; // Reset the round ended flag.

    // If the question pool is empty, the game is over.
    if (questionPool.length === 0) {
        endGame();
        return;
    }

    phase = 'question'; // Set the game phase to 'question'.

    // Select a random question from the pool and remove it.
    const randomIndex = Math.floor(Math.random() * questionPool.length);
    currentQuestion = questionPool.splice(randomIndex, 1)[0];

    const playersList = Object.values(players);
    // If the question contains a placeholder, replace it with a player's name.
    const questionWithName = replacePlayerNamePlaceholder(currentQuestion, playersList);

    phaseDeadlineMs = Date.now() + questionTimer; // Set the deadline for answering.
    playersList.forEach(p => (p.currentVote = null)); // Reset all player votes.

    // Send the new question and round information to all players in the 'game' room.
    io.to('game').emit('new-question', {
        question: questionWithName,
        players: playersList.map(p => ({ name: p.name, color: p.color })),
        votesCount: 0,
        timeRemaining: timeRemaining()
    });

    // Set a timeout to automatically end the round when the timer runs out.
    roundTimeout = setTimeout(finishRound, questionTimer);
}

// This function is called when the question timer expires or all players have voted.
function finishRound() {
    if (roundEnded) return; // Prevent this function from running more than once per round.
    roundEnded = true;

    // Collect all valid votes from the players.
    const votes = {};
    for (const [voterId, p] of Object.entries(players)) {
        // A vote is valid if the target player still exists.
        if (p.currentVote != null && players[p.currentVote]) votes[voterId] = p.currentVote;
    }

    phase = 'results'; // Set the game phase to 'results'.

    const playerCount = Object.keys(players).length;
    const scaledResultTimer = getScaledResultTimer(playerCount); // Calculate how long to show results.

    phaseDeadlineMs = Date.now() + resultTimer; // Set the deadline for the results phase.
    lastVotes = votes; // Cache the votes for late-joiners.

    // Send the round results to all players in the 'game' room.
    io.to('game').emit('round-result', { status: 'results', votes });

    // Clear any previous results timeout and set a new one to start the next round.
    clearTimeout(resultsTimeout);
    resultsTimeout = setTimeout(() => {
        Object.values(players).forEach(p => (p.currentVote = null)); // Reset votes.
        startNextRound(); // Start the next round.
    }, scaledResultTimer);
}

// This function ends the game and resets the server state.
function endGame() {
    phase = 'lobby'; // Set the game phase back to 'lobby'.

    // Clear all game-related timeouts.
    clearTimeout(roundTimeout);
    roundTimeout = null;
    clearTimeout(resultsTimeout);
    resultsTimeout = null;

    // Reset all runtime state variables to their initial values.
    roundEnded = false;
    phaseDeadlineMs = 0;
    currentQuestion = null;
    questionPool = [];
    lastVotes = {};

    // Reset the votes for all players.
    Object.values(players).forEach(p => (p.currentVote = null));

    // Notify clients that the game has ended.
    io.to('game').emit('game-ended');
    // Force all sockets in the 'game' room to leave it.
    io.in('game').socketsLeave('game');
    // Update lobby status for any lingering or new connections.
    broadcastLobbyState();
}

/* ───────── CONNECTION HANDLER ───────── */
// This function is the main handler for all socket.io connections and events.
io.on('connection', socket => {
    // When a new client connects, send them the current player list and lobby status.
    updatePlayerList();
    broadcastLobbyState();

    /* assign a preview color (duplicates allowed until join) */
    const usedColors = Object.values(players).map(p => p.color); // Get colors of already joined players.
    const pool = playerColors.filter(c => !usedColors.includes(c)); // Find available colors.
    // Assign a random available color, or a random color from the full list if none are free.
    const previewColor = pool.length
        ? pool[Math.floor(Math.random() * pool.length)]
        : playerColors[Math.floor(Math.random() * playerColors.length)];

    pendingPlayers[socket.id] = previewColor; // Store the preview color for the connecting player.

    // Send initial configuration data to the newly connected client.
    socket.emit('config', {
        questionTimer: questionTimer / 1000, // Send timer in seconds.
        minPlayers,
        color: previewColor,
        colors: playerColors
    });

    // If the lobby is full, do not set up further event listeners for joining.
    if (Object.keys(players).length >= maxPlayers) return;

    /* allow the client to request / change its color */
    socket.on('pick-color', requested => {
        // 1) Validate that the requested color is in the allowed palette.
        if (!playerColors.includes(requested)) return;

        // 2) Check if the color is already taken by a player who has officially joined.
        const taken = Object.entries(players).some(
            ([id, p]) => id !== socket.id && p.color === requested
        );
        if (taken) return;

        // If the player has already joined, update their color live.
        if (players[socket.id]) {
            players[socket.id].color = requested;
            updatePlayerList(); // Broadcast the change to all clients.
        } else {
            // If the player is still on the join screen, just update their pending color.
            pendingPlayers[socket.id] = requested;
        }

        // Confirm the color update with the client that requested it.
        socket.emit('color-update', requested);
    });

    /* handle player joining the game */
    socket.on('join', rawName => {
        const name = rawName.trim(); // Trim whitespace from the name.
        if (!name) return; // Ignore empty names.

        // Check if the name is already taken by another player (case-insensitive).
        const duplicate = Object.values(players)
            .some(p => p.name.toLowerCase() === name.toLowerCase());

        if (duplicate) {
            socket.emit('join-error', { reason: 'duplicate' });
            return;
        }

        if (Object.keys(players).length >= maxPlayers) return; // Final check for lobby size.

        /* Finalize the player's color */
        let color = pendingPlayers[socket.id];
        // If the chosen color was taken by another player who joined first, assign a new one.
        if (Object.values(players).some(p => p.color === color)) {
            const free = playerColors.filter(c =>
                !Object.values(players).some(p => p.color === c)
            );
            color = free[Math.floor(Math.random() * free.length)] || color;
            socket.emit('color-picked', color); // Inform the client about the new color.
        }

        delete pendingPlayers[socket.id]; // Remove the player from the pending list.

        // If a game is already in progress, add the player to a waiting list.
        if (phase !== 'lobby') {
            waitingPlayers[socket.id] = { name, color };
            socket.emit('waiting');
        } else {
            // If in the lobby, add the player to the active game and the 'game' room.
            players[socket.id] = { name, color, currentVote: null };
            socket.join('game');
        }

        /* Refresh preview colors for other pending players if their color was just taken. */
        Object.entries(pendingPlayers).forEach(([id, preview]) => {
            if (preview === color) {
                // Find a new, unique preview color for the other pending player.
                const used = [
                    ...Object.values(players).map(p => p.color),
                    ...Object.values(pendingPlayers)
                ];
                const freePreview = playerColors.filter(c => !used.includes(c));
                const newPreview =
                    freePreview[Math.floor(Math.random() * freePreview.length)] ||
                    playerColors[Math.floor(Math.random() * playerColors.length)];

                pendingPlayers[id] = newPreview;
                io.to(id).emit('color-update', newPreview); // Send the updated preview color.
            }
        });

        // Update player lists and lobby status for all clients.
        updatePlayerList();
        broadcastLobbyState();

        /* Sync the new player with the current game state if they joined mid-game */
        if (!waitingPlayers[socket.id]) {
            if (phase === 'question') {
                // If in the question phase, send the current question details.
                socket.emit('new-question', {
                    question: currentQuestion,
                    players: Object.values(players).map(p => ({ name: p.name, color: p.color })),
                    votesCount: Object.values(players).filter(p => p.currentVote != null).length,
                    timeRemaining: timeRemaining()
                });
                // Also send the status of who has already voted.
                Object.entries(players).forEach(([id, p]) => {
                    if (p.currentVote != null) socket.emit('player-voted', { voterId: id });
                });
            } else if (phase === 'results') {
                // If in the results phase, send the last round's results.
                socket.emit('round-result', { status: 'results', votes: lastVotes });
            }
        }
    });

    /* handle the start of the game */
    socket.on('start-game', () => {
        // The game can only start if there are enough players and a game isn't already running.
        const enough = Object.keys(players).length >= minPlayers && !currentQuestion;
        if (!enough) return;
        questionPool = [...questions]; // Copy the master questions list into the active pool.
        startNextRound();
    });

    /* handle a player's answer/vote */
    socket.on('answer', targetId => {
        if (phase !== 'question') return; // Can only vote during the 'question' phase.

        const player = players[socket.id];
        if (!player) return; // The voter must be a valid player.

        const firstVote = player.currentVote === null;
        const changed = player.currentVote !== targetId;
        player.currentVote = targetId; // Record the vote.

        // Notify all clients that this player has voted.
        io.to('game').emit('player-voted', { voterId: socket.id });

        // If it's a new or changed vote, update the vote counts for all clients.
        if (firstVote || changed) {
            io.to('game').emit('votes-updated', {
                votesCount: Object.values(players)
                    .filter(p => p.currentVote != null && !waitingPlayers[p.socketId]).length,
                playersCount: Object.keys(players).length - Object.keys(waitingPlayers).length
            });
        }

        // Check if all active players have now voted.
        const everyoneVoted = Object.values(players)
            .filter(p => !waitingPlayers[p.socketId]) // Exclude players waiting for the next round.
            .every(p => p.currentVote != null);

        // If everyone has voted, end the round immediately.
        if (everyoneVoted) {
            clearTimeout(roundTimeout);
            finishRound();
        }
    });

    /* handle player disconnection */
    socket.on('disconnect', () => {
        /* Remove the player from all state objects. */
        delete players[socket.id];
        delete pendingPlayers[socket.id];
        delete waitingPlayers[socket.id];

        /* If other players had voted for the disconnected player, clear those votes. */
        Object.entries(players).forEach(([voterId, p]) => {
            if (p.currentVote === socket.id) {
                p.currentVote = null;
                // Notify the specific client that their vote was cleared.
                io.to('game').emit('vote-cleared', { voterId });
            }
        });

        // Update the player list and lobby status for all remaining clients.
        updatePlayerList();
        broadcastLobbyState();

        /* If there are now too few players to continue, end the game. */
        if (Object.keys(players).length < minPlayers && phase !== 'lobby') {
            endGame();
            return;
        }

        /* Check if the round can end early after the player's departure. */
        if (phase === 'question') {
            // Update the vote counts.
            io.to('game').emit('votes-updated', {
                votesCount: Object.values(players)
                    .filter(p => p.currentVote != null && !waitingPlayers[p.socketId]).length,
                playersCount: Object.keys(players).length - Object.keys(waitingPlayers).length
            });

            // Check if all remaining active players have voted.
            const everyoneVoted =
                Object.values(players).length > 0 &&
                Object.values(players).every(p => p.currentVote != null);

            // If so, end the round.
            if (everyoneVoted) {
                clearTimeout(roundTimeout);
                finishRound();
            }
        }
    });
});

// Define the port for the server to listen on, using an environment variable or defaulting to 3000.
const PORT = process.env.PORT || 3000;
// Start the HTTP server.
httpServer.listen(PORT, () => console.log(`Server listening on port ${PORT}`));