<template>
  <div class="game-container p-6 max-w-xl mx-auto text-center text-stone-700 text-3xl">
    <!-- Join Screen -->
    <div v-if="!nameSubmitted" class="join-screen space-y-8">
      <div class="space-y-4">
        <h1 class="text-5xl">
          <span :class="`text-${previewColor}-700 block text-8xl font-display uppercase tracking-widest transition-colors duration-150 ease-out`">Who</span>
          wants to play?
        </h1>

        <p class="text-2xl text-stone-500 leading-6 text-balance">A game of questionable accusations for 3-10 suspects.</p>
      </div>

      <p v-if="lobbyFull">The game is currently full. Stick around and join when a spot opens up!</p>

      <form v-if="!lobbyFull" @submit.prevent="submitName" class="space-y-8">
        <div class="space-y-1">
          <div :class="`relative text-${previewColor}-700`">
            <input v-model="playerName" type="text" placeholder="Enter your name" :maxlength="maxNameLength" required autofocus
               :class="[
                `bg-white text-center rounded-full px-6 py-4 w-full placeholder-stone-400 border-4 focus:outline-none`,
                nameTaken ? 'border-red-300 focus:border-red-600' : 'border-stone-200 focus:border-stone-300'
              ]" />
          </div>

          <p v-if="nameTaken" class="text-red-700 text-xl">That name is already taken!</p>
        </div>

        <ul role="radiogroup" aria-label="Choose a color" class="flex flex-wrap justify-center gap-3">
          <li v-for="color in colors" :key="color">
            <button type="button" role="radio" @click="pickColor(color)"
              :disabled="!colorAvailable(color)"
              :aria-checked="previewColor === color ? 'true' : 'false'"
              :aria-label="`${color}${!colorAvailable(color) ? ' (unavailable)' : ''}`"
              :class="[
                'flex items-center justify-center w-10 h-10 rounded-full transition-opacity transition-shadow',
                `bg-${color}-600 enabled:hover:ring-4 hover:ring-${color}-800`,
                previewColor === color ? `ring-4 ring-${color}-800` : '',
                !colorAvailable(color)
                  ? 'opacity-10 cursor-not-allowed'
                  : 'cursor-pointer'
              ]">
              <svg v-if="previewColor === color" class="w-5 h-5 fill-white" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path
                  d="M510.537 105.794C510.219 104.105 509.291 102.592 507.929 101.543C493.428 90.063 459.145 43.77 436.629 51.4449C405.22 62.1621 232.546 289.334 194.267 339.4C180.9 320.298 69.5613 167.575 63.9748 170.999C44.8407 182.691 25.0917 192.688 6.8162 205.886C5.91679 206.504 5.15173 207.298 4.56697 208.22C3.98221 209.142 3.58983 210.172 3.4134 211.249C2.03808 212.285 1.00494 213.709 0.447475 215.338C-0.109989 216.967 -0.166164 218.726 0.286209 220.387C15.9751 284.097 69.3175 334.27 107.416 384.453C129.54 413.594 160.388 486.951 201.974 452.318C202.684 451.725 203.108 451.046 203.575 450.357C211.737 447.029 218.723 440.552 226.037 432.665C257.733 398.531 285.634 361.026 315.04 324.856C346.471 286.185 381.337 249.984 415.863 214.281C446.011 183.105 472.788 141.826 508.322 117.444C512.753 114.381 512.763 109.324 510.537 105.794ZM100.112 218.214C90.0619 209.309 79.6986 200.763 69.0419 192.592C80.4731 199.74 90.9188 208.353 100.112 218.214ZM52.3353 225.528C51.4809 224.658 50.4162 224.023 49.2443 223.685C48.0724 223.347 46.833 223.317 45.6463 223.599C44.2605 219.882 43.2173 216.047 42.5297 212.14C42.217 209.968 41.0777 208.001 39.3495 206.649C39.9856 206.172 40.5792 205.695 41.2365 205.228C41.362 207.127 42.0983 208.934 43.3354 210.38C67.4094 238.864 94.5364 264.284 119.013 292.387C121.822 295.62 124.568 298.885 127.324 302.129C101.321 277.493 78.3917 250.027 52.3353 225.528ZM149.882 415.704C152.31 418.502 154.727 421.312 157.207 424.057C160.08 427.979 162.985 431.902 165.985 435.771L166.017 435.898C160.133 430.598 154.727 423.114 149.882 415.704ZM157.674 353.595C164.808 359.891 172.271 365.891 180.115 370.704C179.935 371.921 180.007 373.163 180.327 374.351C180.423 374.87 180.635 375.39 180.836 375.898C173.28 368.295 165.557 360.859 157.674 353.595ZM192.37 435.442C192.348 435.368 192.359 435.294 192.327 435.241C192.073 434.658 191.776 434.138 191.522 433.566C198.794 433.481 208.313 428.085 218.765 419.679C209.532 428.393 200.405 434.531 192.37 435.442ZM440.053 71.7981C433.269 74.7557 427.619 79.3139 422.562 84.6673C427.566 77.5224 432.866 72.0313 440.053 71.7981ZM272.192 291.634C268.143 295.885 260.892 302.319 252.147 310.206C259.875 302.478 267.889 295.132 275.086 287.797C298.567 263.924 316.747 234.645 335.701 206.659C357.199 185.564 379.471 165.486 400.015 143.31C413.531 128.702 421.852 105.285 437.658 92.8085C427.121 103.918 418.799 119.967 411.697 135.391C400.428 147.264 390.464 160.684 380.011 173.681C346.821 215.002 308.648 253.376 272.192 291.634ZM411.029 192.836C394.312 213.094 375.549 231.539 357.708 250.79C371.171 233.914 384.538 216.953 396.813 199.08C397.778 197.67 398.944 195.688 400.227 193.26C404.541 188.946 408.856 184.642 413.085 180.253C425.34 167.49 439.905 153.465 448.841 137.14C455.976 127.547 463.788 118.027 472.619 112.303C459.824 141.338 428.796 171.327 411.029 192.836Z" />
              </svg>
            </button>
          </li>
        </ul>

        <button type="submit" :disabled="joinDisabled" :class="[
          'flex justify-center items-center gap-3 text-3xl px-8 py-4 rounded-full w-full transition-colors transition-border transition-text duration-150 ease-out',
          joinDisabled
            ? 'bg-stone-300 text-stone-400 border-b-4 border-stone-400 cursor-not-allowed'
            : `bg-${previewColor}-600 text-white border-b-4 border-${previewColor}-800 cursor-pointer`
        ]">
          Join
        </button>
      </form>

      <div v-if="playerList.length" class="space-y-2">
        <h2>Connected players…</h2>
        <ul class="divide-y divide-stone-200 bg-white border border-stone-200 rounded-md px-8">
          <li v-for="player in playerList" :key="player.socketId"
            :class="`flex items-center gap-3 justify-center py-4 text-${player.color}-700`">
            {{ player.name }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Game Screen -->
    <div v-else class="game-screen space-y-6">
      <!-- Current Question -->
      <div v-if="currentQuestion" class="space-y-12">
        <h1 :class="`text-8xl uppercase font-display tracking-widest text-${playerColor}-700`">Who</h1>

        <div class="space-y-6">
          <h2 class="text-5xl text-balance" v-html="currentQuestion"></h2>

          <p v-if="countdown" :class="['text-2xl flex items-center justify-center gap-2', countdown <= 5 ? 'text-red-700' : 'text-stone-500']">
            {{ countdown }}s to answer!
          </p>

          <div v-if="votingAllowed" class="space-y-6">
            <!-- Voting buttons -->
            <ul v-if="votingAllowed" class="space-y-2">
              <li v-for="player in playerList" :key="player.socketId">
                <button @click="vote(player.socketId)" :class="[
                  'flex items-center gap-3 justify-center px-8 py-4 rounded-full w-full border-b-4 cursor-pointer',
                  'transition-colors duration-150 ease-out',
                  player.socketId === myCurrentVoteId
                    ? `bg-${player.color}-600 text-white border-${player.color}-800`
                    : `bg-white text-${player.color}-700 border-stone-200`
                ]">
                  <svg v-if="player.socketId === myCurrentVoteId" class="w-6 h-6" viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M510.537 105.794C510.219 104.105 509.291 102.592 507.929 101.543C493.428 90.063 459.145 43.77 436.629 51.4449C405.22 62.1621 232.546 289.334 194.267 339.4C180.9 320.298 69.5613 167.575 63.9748 170.999C44.8407 182.691 25.0917 192.688 6.8162 205.886C5.91679 206.504 5.15173 207.298 4.56697 208.22C3.98221 209.142 3.58983 210.172 3.4134 211.249C2.03808 212.285 1.00494 213.709 0.447475 215.338C-0.109989 216.967 -0.166164 218.726 0.286209 220.387C15.9751 284.097 69.3175 334.27 107.416 384.453C129.54 413.594 160.388 486.951 201.974 452.318C202.684 451.725 203.108 451.046 203.575 450.357C211.737 447.029 218.723 440.552 226.037 432.665C257.733 398.531 285.634 361.026 315.04 324.856C346.471 286.185 381.337 249.984 415.863 214.281C446.011 183.105 472.788 141.826 508.322 117.444C512.753 114.381 512.763 109.324 510.537 105.794ZM100.112 218.214C90.0619 209.309 79.6986 200.763 69.0419 192.592C80.4731 199.74 90.9188 208.353 100.112 218.214ZM52.3353 225.528C51.4809 224.658 50.4162 224.023 49.2443 223.685C48.0724 223.347 46.833 223.317 45.6463 223.599C44.2605 219.882 43.2173 216.047 42.5297 212.14C42.217 209.968 41.0777 208.001 39.3495 206.649C39.9856 206.172 40.5792 205.695 41.2365 205.228C41.362 207.127 42.0983 208.934 43.3354 210.38C67.4094 238.864 94.5364 264.284 119.013 292.387C121.822 295.62 124.568 298.885 127.324 302.129C101.321 277.493 78.3917 250.027 52.3353 225.528ZM149.882 415.704C152.31 418.502 154.727 421.312 157.207 424.057C160.08 427.979 162.985 431.902 165.985 435.771L166.017 435.898C160.133 430.598 154.727 423.114 149.882 415.704ZM157.674 353.595C164.808 359.891 172.271 365.891 180.115 370.704C179.935 371.921 180.007 373.163 180.327 374.351C180.423 374.87 180.635 375.39 180.836 375.898C173.28 368.295 165.557 360.859 157.674 353.595ZM192.37 435.442C192.348 435.368 192.359 435.294 192.327 435.241C192.073 434.658 191.776 434.138 191.522 433.566C198.794 433.481 208.313 428.085 218.765 419.679C209.532 428.393 200.405 434.531 192.37 435.442ZM440.053 71.7981C433.269 74.7557 427.619 79.3139 422.562 84.6673C427.566 77.5224 432.866 72.0313 440.053 71.7981ZM272.192 291.634C268.143 295.885 260.892 302.319 252.147 310.206C259.875 302.478 267.889 295.132 275.086 287.797C298.567 263.924 316.747 234.645 335.701 206.659C357.199 185.564 379.471 165.486 400.015 143.31C413.531 128.702 421.852 105.285 437.658 92.8085C427.121 103.918 418.799 119.967 411.697 135.391C400.428 147.264 390.464 160.684 380.011 173.681C346.821 215.002 308.648 253.376 272.192 291.634ZM411.029 192.836C394.312 213.094 375.549 231.539 357.708 250.79C371.171 233.914 384.538 216.953 396.813 199.08C397.778 197.67 398.944 195.688 400.227 193.26C404.541 188.946 408.856 184.642 413.085 180.253C425.34 167.49 439.905 153.465 448.841 137.14C455.976 127.547 463.788 118.027 472.619 112.303C459.824 141.338 428.796 171.327 411.029 192.836Z" />
                  </svg>
                  {{ player.name }}
                </button>
              </li>
            </ul>

            <div class="flex flex-wrap justify-center gap-3 text-xl">
              We're waiting…
              <ul class="flex flex-wrap gap-3">
                <li v-for="player in playerList" :key="player.socketId"
                  :class="player.currentVote ? `text-${player.color}-700` : 'text-stone-400'"
                  class="flex items-center gap-1">
                  <svg v-if="player.currentVote" class="w-2 h-2" viewBox="0 0 512 512" fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M510.537 105.794C510.219 104.105 509.291 102.592 507.929 101.543C493.428 90.063 459.145 43.77 436.629 51.4449C405.22 62.1621 232.546 289.334 194.267 339.4C180.9 320.298 69.5613 167.575 63.9748 170.999C44.8407 182.691 25.0917 192.688 6.8162 205.886C5.91679 206.504 5.15173 207.298 4.56697 208.22C3.98221 209.142 3.58983 210.172 3.4134 211.249C2.03808 212.285 1.00494 213.709 0.447475 215.338C-0.109989 216.967 -0.166164 218.726 0.286209 220.387C15.9751 284.097 69.3175 334.27 107.416 384.453C129.54 413.594 160.388 486.951 201.974 452.318C202.684 451.725 203.108 451.046 203.575 450.357C211.737 447.029 218.723 440.552 226.037 432.665C257.733 398.531 285.634 361.026 315.04 324.856C346.471 286.185 381.337 249.984 415.863 214.281C446.011 183.105 472.788 141.826 508.322 117.444C512.753 114.381 512.763 109.324 510.537 105.794ZM100.112 218.214C90.0619 209.309 79.6986 200.763 69.0419 192.592C80.4731 199.74 90.9188 208.353 100.112 218.214ZM52.3353 225.528C51.4809 224.658 50.4162 224.023 49.2443 223.685C48.0724 223.347 46.833 223.317 45.6463 223.599C44.2605 219.882 43.2173 216.047 42.5297 212.14C42.217 209.968 41.0777 208.001 39.3495 206.649C39.9856 206.172 40.5792 205.695 41.2365 205.228C41.362 207.127 42.0983 208.934 43.3354 210.38C67.4094 238.864 94.5364 264.284 119.013 292.387C121.822 295.62 124.568 298.885 127.324 302.129C101.321 277.493 78.3917 250.027 52.3353 225.528ZM149.882 415.704C152.31 418.502 154.727 421.312 157.207 424.057C160.08 427.979 162.985 431.902 165.985 435.771L166.017 435.898C160.133 430.598 154.727 423.114 149.882 415.704ZM157.674 353.595C164.808 359.891 172.271 365.891 180.115 370.704C179.935 371.921 180.007 373.163 180.327 374.351C180.423 374.87 180.635 375.39 180.836 375.898C173.28 368.295 165.557 360.859 157.674 353.595ZM192.37 435.442C192.348 435.368 192.359 435.294 192.327 435.241C192.073 434.658 191.776 434.138 191.522 433.566C198.794 433.481 208.313 428.085 218.765 419.679C209.532 428.393 200.405 434.531 192.37 435.442ZM440.053 71.7981C433.269 74.7557 427.619 79.3139 422.562 84.6673C427.566 77.5224 432.866 72.0313 440.053 71.7981ZM272.192 291.634C268.143 295.885 260.892 302.319 252.147 310.206C259.875 302.478 267.889 295.132 275.086 287.797C298.567 263.924 316.747 234.645 335.701 206.659C357.199 185.564 379.471 165.486 400.015 143.31C413.531 128.702 421.852 105.285 437.658 92.8085C427.121 103.918 418.799 119.967 411.697 135.391C400.428 147.264 390.464 160.684 380.011 173.681C346.821 215.002 308.648 253.376 272.192 291.634ZM411.029 192.836C394.312 213.094 375.549 231.539 357.708 250.79C371.171 233.914 384.538 216.953 396.813 199.08C397.778 197.67 398.944 195.688 400.227 193.26C404.541 188.946 408.856 184.642 413.085 180.253C425.34 167.49 439.905 153.465 448.841 137.14C455.976 127.547 463.788 118.027 472.619 112.303C459.824 141.338 428.796 171.327 411.029 192.836Z" />
                  </svg>

                  {{ player.name }}
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>

      <div v-if="result?.status === 'results'" class="space-y-2">
        <div v-for="entry in leaderboard" :key="entry.player.socketId"
          class="bg-white border border-stone-200 rounded-md p-4 space-y-4">

          <h2 :class="`text-${entry.player.color}-700`">
            {{ entry.player.name }}
          </h2>

          <div :class="`bg-stone-100 rounded-full`">
            <div :class="`bg-${entry.player.color}-600 rounded-full text-white text-base text-left px-2 min-w-min`"
              :style="{ maxWidth: entry.percent + '%' }">{{ entry.percent }}%</div>
          </div>

          <div class="mt-2 text-xl flex flex-wrap justify-center gap-3">
            <!-- {{ entry.count }} vote{{ entry.count === 1 ? '' : 's' }} -->
            Who thinks so?
            <ul v-if="entry.voters.length" class="flex flex-wrap gap-3">
              <li v-for="voter in entry.voters" :key="voter.socketId" :class="`text-${voter.color}-700`">
                {{ voter.name }}
              </li>
            </ul>
            <p class="text-xl" v-else>Nobody!</p>
          </div>

        </div>
      </div>

      <!-- Player list & waiting/start game -->
      <div v-if="!gameActive" class="space-y-8">
        <h1 class="text-5xl">
          <span :class="`block text-8xl font-display uppercase tracking-widest text-${playerColor}-700`">Who</span>
          is playing?
        </h1>

        <ul class="divide-y divide-stone-200 bg-white border border-stone-200 rounded-md px-8">
          <li v-for="player in playerList" :key="player.socketId"
            :class="`flex items-center gap-3 justify-center py-4 text-${player.color}-700`">
            {{ player.name }}
          </li>
        </ul>

        <!-- Waiting message -->
        <p v-if="neededPlayers > 0">
          Waiting for at least {{ neededPlayers }} more player{{ neededPlayers === 1 ? '' : 's' }}…
        </p>

        <!-- Start Game button -->
        <button v-if="canStart" @click="startGame"
          :class="`bg-${playerColor}-600 border-b-4 border-${playerColor}-800 text-white px-8 py-4 rounded-full w-full cursor-pointer`">
          Start Game
        </button>
      </div>
    </div>
  </div>

  <div v-if="disconnectNotification"
    :class="`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-${disconnectNotification.color}-600 text-white px-6 py-2 rounded-full shadow-lg text-xl`">
    {{ disconnectNotification.name }} disconnected…
  </div>
</template>

<script setup>
  import { ref, reactive, computed } from 'vue'
  import { io } from 'socket.io-client'

  /* ---------- socket ---------- */
  const socket = io('/')

  /* ---------- base state ---------- */
  const questionTimer = ref(20)
  const minPlayers = ref(3)
  const lobbyFull = ref(false)
  const maxNameLength = 20
  const nameSubmitted = ref(false)
  const disconnectNotification = ref(null)

  const playerName = ref('')
  const previewColor = ref('stone')
  const colors = ref([])

  /* players keyed by socketId */
  const players = reactive({})
  const playerList = computed(() => Object.values(players))

  /* round‑state */
  const currentQuestion = ref('')
  const countdown = ref(null)
  const gameActive = ref(false)
  const result = ref(null)

  const myCurrentVoteId = ref(null)
  let countdownTimer = null

  /* ---------- derived ---------- */
  const neededPlayers = computed(() =>
    Math.max(minPlayers.value - playerList.value.length, 0)
  )

  const canStart = computed(() => neededPlayers.value === 0 && !gameActive.value)

  const votingAllowed = computed(() =>
    countdown.value > 0 &&
    playerList.value.filter(p => p.currentVote !== null).length <
    playerList.value.length
  )

  const playerColor = computed(() =>
    playerList.value.find(p => p.name === playerName.value)?.color || previewColor.value
  )

  /* ---------- color‑picker helpers ---------- */
  const takenColors = computed(() => playerList.value.map(p => p.color))

  function colorAvailable(c) {
    return !takenColors.value.includes(c)
  }

  function pickColor(c) {
    if (!colorAvailable(c)) return
    previewColor.value = c
    socket.emit('pick-color', c)      // this now works
  }

  /* ---------- name validation ---------- */
  const trimmedName = computed(() => playerName.value.trim())

  const nameTaken = computed(() =>
    playerList.value.some(
      p => p.name.toLowerCase() === trimmedName.value.toLowerCase()
    )
  )

  const nameInvalid = computed(() =>
    trimmedName.value.length === 0 || trimmedName.value.length > maxNameLength
  )

  const joinDisabled = computed(() => nameTaken.value || nameInvalid.value)

  /* ---------- leaderboard (ranked) ---------- */
  const leaderboard = computed(() => {
    const buckets = {}                      // targetId -> [voterIds]
    playerList.value.forEach(p => {
      if (p.currentVote !== null) (buckets[p.currentVote] ||= []).push(p.socketId)
    })
    Object.keys(players).forEach(id => (buckets[id] ||= [])) // zero‑vote rows

    const total = playerList.value.length || 1

    return Object.entries(buckets)
      .sort((a, b) => b[1].length - a[1].length)
      .map(([targetId, voterIds]) => ({
        player: players[targetId],
        voters: voterIds.map(id => players[id]),
        count: voterIds.length,
        percent: Math.round(voterIds.length / total * 100)
      }))
  })

  /* ---------- helpers ---------- */
  function startCountdown(secs) {
    countdown.value = secs
    clearInterval(countdownTimer)
    countdownTimer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) clearInterval(countdownTimer)
    }, 1000)
  }
  function stopCountdown() { clearInterval(countdownTimer); countdown.value = null }

  /* ---------- UI actions ---------- */
  function submitName() {
    if (joinDisabled.value) return
    socket.emit('join', playerName.value.trim())
    nameSubmitted.value = true
  }
  function vote(targetId) {
    if (!votingAllowed.value) return
    socket.emit('answer', targetId)
    myCurrentVoteId.value = targetId
  }
  function startGame() { socket.emit('start-game') }

  /* ---------- socket events ---------- */
  socket.on('config', cfg => {
    if (cfg.questionTimer) questionTimer.value = cfg.questionTimer
    if (cfg.minPlayers) minPlayers.value = cfg.minPlayers
    if (cfg.color) previewColor.value = cfg.color
    if (cfg.colors) colors.value = cfg.colors
  })

  /* server confirms / adjusts preview color */
  socket.on('color-update', c => { previewColor.value = c })

  socket.on('lobby-full', full => { lobbyFull.value = full })

  socket.on('join-error', ({ reason }) => {
    if (reason === 'duplicate') nameSubmitted.value = false
  })

  socket.on('players-updated', list => {
    const currentIds = list.map(p => p.socketId)

    // Detect leavers
    Object.keys(players).forEach(id => {
      if (!currentIds.includes(id)) {
        // Show notification
        const name = players[id].name
        const color = players[id].color
        disconnectNotification.value = { name, color }

        setTimeout(() => {
          disconnectNotification.value = null
        }, 5000)

        delete players[id]
      }
    })

    // Update or add players
    list.forEach(p => {
      if (!players[p.socketId]) players[p.socketId] = { ...p, currentVote: null }
      else Object.assign(players[p.socketId], p)
    })
  })

  socket.on('new-question', ({ question, timeRemaining }) => {
    currentQuestion.value = question
    gameActive.value = true
    myCurrentVoteId.value = null
    result.value = null
    Object.values(players).forEach(p => (p.currentVote = null))
    startCountdown(timeRemaining ?? questionTimer.value)
  })

  socket.on('player-voted', ({ voterId }) => {
    if (players[voterId]) players[voterId].currentVote = '?'
  })

  socket.on('round-result', ({ votes }) => {
    // merge votes into players
    Object.entries(votes).forEach(([voterId, targetId]) => {
      if (players[voterId]) players[voterId].currentVote = targetId
    })
    result.value = { status: 'results' }
    stopCountdown()
  })

  socket.on('game-ended', () => {
    gameActive.value = false
    currentQuestion.value = ''
    stopCountdown()
    Object.values(players).forEach(p => (p.currentVote = null))
    myCurrentVoteId.value = null
    result.value = null
  })
</script>