<template>
  <div class="p-6 max-w-xl mx-auto text-center text-stone-700 dark:text-stone-100 text-3xl">

    <!-- Join Screen -->
    <div v-if="!nameSubmitted" class="space-y-8">
      <div class="space-y-4">
        <h1 class="text-5xl">
          <span
            :class="`text-${previewColor}-700 dark:text-${previewColor}-400 block text-8xl font-display uppercase tracking-widest transition-colors duration-150 ease-out`">Who</span>
          wants to play?
        </h1>

        <p class="text-2xl text-stone-500 dark:text-stone-400 leading-6 text-balance">A game of questionable accusations for 3-10 suspects.</p>
      </div>

      <!-- Lobby Full Message -->
      <p v-if="lobbyFull">The game is currently full. Stick around and join when a spot opens up!</p>

      <!-- Join Form -->
      <form v-if="!lobbyFull" @submit.prevent="submitName" class="space-y-8">
        <div class="space-y-1">
          <div :class="`relative text-${previewColor}-700 dark:text-${previewColor}-300`">
            <input v-model="playerName" type="text" placeholder="Enter your name" :maxlength="maxNameLength" required
              autofocus :class="[
                `bg-white dark:bg-stone-900 text-center rounded-full px-6 py-4 w-full placeholder-stone-400 dark:placeholder-stone-500 border-4 focus:outline-none`,
                nameTaken ? 'border-red-300 dark:border-red-900 focus:border-red-600' : 'border-stone-200 dark:border-stone-700 focus:border-stone-300 dark:focus:border-stone-600'
              ]" />
          </div>

          <p v-if="nameTaken" class="text-red-700 dark:text-red-500 text-xl">That name is already taken!</p>
        </div>

        <!-- Color Selector -->
        <ul role="radiogroup" aria-label="Choose a color" class="flex flex-wrap justify-center gap-3">
          <li v-for="color in colors" :key="color">
            <button type="button" role="radio" @click="pickColor(color)" :disabled="!colorAvailable(color)"
              :aria-checked="previewColor === color ? 'true' : 'false'"
              :aria-label="`${color}${!colorAvailable(color) ? ' (unavailable)' : ''}`" :class="[
                'flex items-center justify-center w-10 h-10 rounded-full transition-opacity transition-shadow',
                `bg-${color}-600 dark:bg-${color}-400 enabled:hover:ring-4 hover:ring-${color}-800 dark:hover:ring-${color}-300`,
                previewColor === color ? `ring-4 ring-${color}-800 dark:ring-${color}-300` : '',
                !colorAvailable(color)
                  ? 'opacity-10 dark:opacity-20 cursor-not-allowed'
                  : 'cursor-pointer'
              ]">
              <svg v-if="previewColor === color" class="w-5 h-5 fill-white dark:fill-stone-950" viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path
                  d="M510.537 105.794C510.219 104.105 509.291 102.592 507.929 101.543C493.428 90.063 459.145 43.77 436.629 51.4449C405.22 62.1621 232.546 289.334 194.267 339.4C180.9 320.298 69.5613 167.575 63.9748 170.999C44.8407 182.691 25.0917 192.688 6.8162 205.886C5.91679 206.504 5.15173 207.298 4.56697 208.22C3.98221 209.142 3.58983 210.172 3.4134 211.249C2.03808 212.285 1.00494 213.709 0.447475 215.338C-0.109989 216.967 -0.166164 218.726 0.286209 220.387C15.9751 284.097 69.3175 334.27 107.416 384.453C129.54 413.594 160.388 486.951 201.974 452.318C202.684 451.725 203.108 451.046 203.575 450.357C211.737 447.029 218.723 440.552 226.037 432.665C257.733 398.531 285.634 361.026 315.04 324.856C346.471 286.185 381.337 249.984 415.863 214.281C446.011 183.105 472.788 141.826 508.322 117.444C512.753 114.381 512.763 109.324 510.537 105.794ZM100.112 218.214C90.0619 209.309 79.6986 200.763 69.0419 192.592C80.4731 199.74 90.9188 208.353 100.112 218.214ZM52.3353 225.528C51.4809 224.658 50.4162 224.023 49.2443 223.685C48.0724 223.347 46.833 223.317 45.6463 223.599C44.2605 219.882 43.2173 216.047 42.5297 212.14C42.217 209.968 41.0777 208.001 39.3495 206.649C39.9856 206.172 40.5792 205.695 41.2365 205.228C41.362 207.127 42.0983 208.934 43.3354 210.38C67.4094 238.864 94.5364 264.284 119.013 292.387C121.822 295.62 124.568 298.885 127.324 302.129C101.321 277.493 78.3917 250.027 52.3353 225.528ZM149.882 415.704C152.31 418.502 154.727 421.312 157.207 424.057C160.08 427.979 162.985 431.902 165.985 435.771L166.017 435.898C160.133 430.598 154.727 423.114 149.882 415.704ZM157.674 353.595C164.808 359.891 172.271 365.891 180.115 370.704C179.935 371.921 180.007 373.163 180.327 374.351C180.423 374.87 180.635 375.39 180.836 375.898C173.28 368.295 165.557 360.859 157.674 353.595ZM192.37 435.442C192.348 435.368 192.359 435.294 192.327 435.241C192.073 434.658 191.776 434.138 191.522 433.566C198.794 433.481 208.313 428.085 218.765 419.679C209.532 428.393 200.405 434.531 192.37 435.442ZM440.053 71.7981C433.269 74.7557 427.619 79.3139 422.562 84.6673C427.566 77.5224 432.866 72.0313 440.053 71.7981ZM272.192 291.634C268.143 295.885 260.892 302.319 252.147 310.206C259.875 302.478 267.889 295.132 275.086 287.797C298.567 263.924 316.747 234.645 335.701 206.659C357.199 185.564 379.471 165.486 400.015 143.31C413.531 128.702 421.852 105.285 437.658 92.8085C427.121 103.918 418.799 119.967 411.697 135.391C400.428 147.264 390.464 160.684 380.011 173.681C346.821 215.002 308.648 253.376 272.192 291.634ZM411.029 192.836C394.312 213.094 375.549 231.539 357.708 250.79C371.171 233.914 384.538 216.953 396.813 199.08C397.778 197.67 398.944 195.688 400.227 193.26C404.541 188.946 408.856 184.642 413.085 180.253C425.34 167.49 439.905 153.465 448.841 137.14C455.976 127.547 463.788 118.027 472.619 112.303C459.824 141.338 428.796 171.327 411.029 192.836Z" />
              </svg>
            </button>
          </li>
        </ul>

        <button type="submit" :disabled="joinDisabled" :class="[
          'flex justify-center items-center gap-3 text-3xl px-8 py-4 rounded-full w-full transition-all duration-150 ease-out border-b-4',
          joinDisabled
            ? 'bg-stone-300 dark:bg-stone-700 text-stone-400 border-transparent cursor-not-allowed translate-y-0.75'
            : `bg-${previewColor}-600 dark:bg-${previewColor}-400 text-white dark:text-stone-950 border-${previewColor}-800 dark:border-${previewColor}-300 cursor-pointer hover:bg-${previewColor}-700 dark:hover:bg-${previewColor}-300 hover:border-transparent hover:translate-y-0.75`
        ]">
          Join
        </button>
      </form>

      <!-- List of Players in the Lobby -->
      <div v-if="playerList.length" class="space-y-2">
        <h2>Connected players…</h2>
        <ul class="divide-y divide-stone-200 dark:divide-stone-700 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-md px-8">
          <li v-for="player in playerList" :key="player.socketId"
            :class="`flex items-center gap-3 justify-center py-4 text-${player.color}-700 dark:text-${player.color}-300`">
            {{ player.name }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Game Screen -->
    <div v-else class="space-y-6">
      <!-- Lobby (Post-Game or Pre-Game Waiting) -->
      <div v-if="!gameActive" class="space-y-8">
        <h1 class="text-5xl">
          <span :class="`block text-8xl font-display uppercase tracking-widest text-${playerColor}-700 dark:text-${playerColor}-400`">Who</span>
          is playing?
        </h1>

        <!-- Lobby Player List -->
        <ul class="divide-y divide-stone-200 dark:divide-stone-700 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-md px-8">
          <li v-for="player in playerList" :key="player.socketId"
            :class="`flex items-center gap-3 justify-center py-4 text-${player.color}-700 dark:text-${player.color}-300`">
            {{ player.name }}
          </li>
        </ul>

        <!-- Waiting Message: more players needed -->
        <p v-if="neededPlayers > 0">
          Waiting for at least {{ neededPlayers }} more player{{ neededPlayers === 1 ? '' : 's' }}…
        </p>

        <!-- Waiting Message: joining mid-game, waiting for next round -->
        <p v-if="waiting">Waiting for the next round to start…</p>

        <!-- Start Game button -->
        <button v-if="canStart && !waiting" @click="startGame"
          :class="`bg-${playerColor}-600 dark:bg-${previewColor}-400 border-b-4 border-${playerColor}-800 dark:border-${previewColor}-300 text-white dark:text-stone-950 px-8 py-4 rounded-full w-full cursor-pointer transition-all duration-150 ease-out hover:bg-${playerColor}-700 dark:hover:bg-${previewColor}-300 hover:border-transparent hover:translate-y-0.75`">
          Start Game
        </button>
      </div>

      <!-- Question Screen -->
      <div v-if="currentQuestion" class="space-y-12">
        <h1 :class="`text-8xl uppercase font-display tracking-widest text-${playerColor}-700 dark:text-${playerColor}-400`">Who</h1>
        
        <!-- Current Question -->
        <div class="space-y-6">
          <h2 class="text-5xl text-balance" v-html="currentQuestion"></h2>

          <!-- Countdown Timer -->
          <p v-if="countdown"
            :class="['text-2xl flex items-center justify-center gap-2', countdown <= 5 ? 'text-red-700 dark:text-red-500' : 'text-stone-500 dark:text-stone-300']">
            {{ countdown }}s to answer!
          </p>

          <div v-if="votingAllowed" class="space-y-6">
            <!-- Voting buttons -->
            <ul v-if="votingAllowed" class="space-y-2">
              <li v-for="player in playerList" :key="player.socketId">
                <button @click="vote(player.socketId)" :class="[
                  'flex items-center gap-3 justify-center px-8 py-4 rounded-full w-full border-b-4 text-white dark:text-stone-950 cursor-pointer',
                  'transition-all duration-150 ease-out',
                  player.socketId === myCurrentVoteId
                    ? `bg-${player.color}-700 dark:bg-${player.color}-300 border-transparent`
                    : `bg-${player.color}-600 dark:bg-${player.color}-400 border-${player.color}-800 dark:border-${player.color}-300 hover:bg-${player.color}-700 dark:hover:bg-${player.color}-300 hover:border-transparent hover:translate-y-0.75`
                ]">
                  <svg v-if="player.socketId === myCurrentVoteId" class="w-6 h-6" viewBox="0 0 512 512"
                    fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path
                      d="M510.537 105.794C510.219 104.105 509.291 102.592 507.929 101.543C493.428 90.063 459.145 43.77 436.629 51.4449C405.22 62.1621 232.546 289.334 194.267 339.4C180.9 320.298 69.5613 167.575 63.9748 170.999C44.8407 182.691 25.0917 192.688 6.8162 205.886C5.91679 206.504 5.15173 207.298 4.56697 208.22C3.98221 209.142 3.58983 210.172 3.4134 211.249C2.03808 212.285 1.00494 213.709 0.447475 215.338C-0.109989 216.967 -0.166164 218.726 0.286209 220.387C15.9751 284.097 69.3175 334.27 107.416 384.453C129.54 413.594 160.388 486.951 201.974 452.318C202.684 451.725 203.108 451.046 203.575 450.357C211.737 447.029 218.723 440.552 226.037 432.665C257.733 398.531 285.634 361.026 315.04 324.856C346.471 286.185 381.337 249.984 415.863 214.281C446.011 183.105 472.788 141.826 508.322 117.444C512.753 114.381 512.763 109.324 510.537 105.794ZM100.112 218.214C90.0619 209.309 79.6986 200.763 69.0419 192.592C80.4731 199.74 90.9188 208.353 100.112 218.214ZM52.3353 225.528C51.4809 224.658 50.4162 224.023 49.2443 223.685C48.0724 223.347 46.833 223.317 45.6463 223.599C44.2605 219.882 43.2173 216.047 42.5297 212.14C42.217 209.968 41.0777 208.001 39.3495 206.649C39.9856 206.172 40.5792 205.695 41.2365 205.228C41.362 207.127 42.0983 208.934 43.3354 210.38C67.4094 238.864 94.5364 264.284 119.013 292.387C121.822 295.62 124.568 298.885 127.324 302.129C101.321 277.493 78.3917 250.027 52.3353 225.528ZM149.882 415.704C152.31 418.502 154.727 421.312 157.207 424.057C160.08 427.979 162.985 431.902 165.985 435.771L166.017 435.898C160.133 430.598 154.727 423.114 149.882 415.704ZM157.674 353.595C164.808 359.891 172.271 365.891 180.115 370.704C179.935 371.921 180.007 373.163 180.327 374.351C180.423 374.87 180.635 375.39 180.836 375.898C173.28 368.295 165.557 360.859 157.674 353.595ZM192.37 435.442C192.348 435.368 192.359 435.294 192.327 435.241C192.073 434.658 191.776 434.138 191.522 433.566C198.794 433.481 208.313 428.085 218.765 419.679C209.532 428.393 200.405 434.531 192.37 435.442ZM440.053 71.7981C433.269 74.7557 427.619 79.3139 422.562 84.6673C427.566 77.5224 432.866 72.0313 440.053 71.7981ZM272.192 291.634C268.143 295.885 260.892 302.319 252.147 310.206C259.875 302.478 267.889 295.132 275.086 287.797C298.567 263.924 316.747 234.645 335.701 206.659C357.199 185.564 379.471 165.486 400.015 143.31C413.531 128.702 421.852 105.285 437.658 92.8085C427.121 103.918 418.799 119.967 411.697 135.391C400.428 147.264 390.464 160.684 380.011 173.681C346.821 215.002 308.648 253.376 272.192 291.634ZM411.029 192.836C394.312 213.094 375.549 231.539 357.708 250.79C371.171 233.914 384.538 216.953 396.813 199.08C397.778 197.67 398.944 195.688 400.227 193.26C404.541 188.946 408.856 184.642 413.085 180.253C425.34 167.49 439.905 153.465 448.841 137.14C455.976 127.547 463.788 118.027 472.619 112.303C459.824 141.338 428.796 171.327 411.029 192.836Z" />
                  </svg>
                  {{ player.name }}
                </button>
              </li>
            </ul>

            <!-- Waiting for Votes -->
            <div class="flex flex-wrap justify-center gap-3 text-xl">
              We're waiting…
              <ul class="flex flex-wrap gap-3">
                <li v-for="player in playerList" :key="player.socketId"
                  :class="player.currentVote ? `text-${player.color}-700 dark:text-${player.color}-300` : 'text-stone-400'"
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

      <!-- Results Area -->
      <div v-if="result?.status === 'results' && gameActive && !waiting" class="space-y-2">
        <div v-for="entry in leaderboard" :key="entry.player.socketId"
          class="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-md p-4 space-y-4">
          <h2 :class="`text-${entry.player.color}-700 dark:text-${entry.player.color}-300`">
            {{ entry.player.name }}
          </h2>

          <!-- Vote Bar -->
          <div :class="`bg-stone-100 dark:bg-stone-700 rounded-full`">
            <div :class="`bg-${entry.player.color}-600 dark:bg-${entry.player.color}-300 rounded-full text-white dark:text-stone-950 text-base text-left px-2 min-w-min`"
              :style="{ maxWidth: entry.percent + '%' }">{{ entry.percent }}%</div>
          </div>

           <!-- Voters List -->
          <div class="mt-2 text-xl flex flex-wrap justify-center gap-3">
            Who thinks so?
            <ul v-if="entry.voters.length" class="flex flex-wrap gap-3">
              <li v-for="voter in entry.voters" :key="voter.socketId" :class="`text-${voter.color}-700 dark:text-${voter.color}-300`">
                {{ voter.name }}
              </li>
            </ul>
            <p class="text-xl" v-else>Nobody!</p>
          </div>

        </div>
      </div>
    </div>
  </div>

  <!-- Disconnect Notification -->
  <div v-if="disconnectNotification"
    :class="`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-${disconnectNotification.color}-600 dark:bg-${disconnectNotification.color}-300 text-white dark:text-stone-950 px-6 py-2 rounded-full shadow-lg text-xl`">
    {{ disconnectNotification.name }} disconnected…
  </div>
</template>

<script setup>
  // Import reactive utilities from Vue and the socket.io client library.
  import { ref, reactive, computed } from 'vue';
  import { io } from 'socket.io-client';

  /* ---------- SOCKET ---------- */
  // Establish a connection to the Socket.IO server.
  const socket = io('/');

  /* ---------- BASE STATE ---------- */
  // These are reactive variables that hold the client's state.
  // They are initialized with default values and updated by server events.

  // Configuration from the server
  const questionTimer = ref(20);
  const minPlayers = ref(3);
  const lobbyFull = ref(false);
  const maxNameLength = 20;

  // UI state for the join process
  const nameSubmitted = ref(false);
  const disconnectNotification = ref(null); // Holds data for the disconnect popup.
  const playerName = ref(''); // Bound to the name input field.
  const previewColor = ref('stone'); // The color selected in the lobby.
  const colors = ref([]); // The list of available colors from the server.

  // Game state
  const players = reactive({}); // An object of all players, keyed by their socketId for easy lookup.
  const playerList = computed(() => Object.values(players)); // A computed array of players, for easy rendering with v-for.

  // Round state
  const currentQuestion = ref('');
  const countdown = ref(null);
  const gameActive = ref(false); // True when a game (a series of rounds) is in progress.
  const result = ref(null); // Holds the result data at the end of a round.
  const myCurrentVoteId = ref(null); // Tracks the current client's vote to highlight their selection.
  let countdownTimer = null; // A handle for the setInterval timer.
  let waiting = ref(false); // True if the player joined mid-game and is waiting for the next round.

  /* ---------- DERIVED STATE (COMPUTED PROPERTIES) ---------- */
  // These are values that are automatically calculated based on the base state.

  // Calculates how many more players are needed to start the game.
  const neededPlayers = computed(() =>
    Math.max(minPlayers.value - playerList.value.length, 0)
  );

  // Determines if the "Start Game" button should be enabled.
  const canStart = computed(() => neededPlayers.value === 0 && !gameActive.value);

  // Determines if the voting interface should be shown.
  const votingAllowed = computed(() =>
    countdown.value > 0 &&
    playerList.value.filter(p => p.currentVote !== null).length <
    playerList.value.length
  );

  // Finds the current player's own color.
  const playerColor = computed(() =>
    playerList.value.find(p => p.name === playerName.value)?.color || previewColor.value
  );

  /* ---------- COLOR-PICKER HELPERS ---------- */
  // A computed property that lists all colors currently taken by joined players.
  const takenColors = computed(() => playerList.value.map(p => p.color));

  // Checks if a color is available (i.e., not in the takenColors list).
  function colorAvailable(c) {
    return !takenColors.value.includes(c);
  }

  // Emits an event to the server when the player picks a new color.
  function pickColor(c) {
    if (!colorAvailable(c)) return;
    previewColor.value = c;
    socket.emit('pick-color', c);
  }

  /* ---------- NAME VALIDATION (COMPUTED PROPERTIES) ---------- */
  // The player's name with whitespace trimmed.
  const trimmedName = computed(() => playerName.value.trim());

  // Checks if the entered name is already taken by another player (case-insensitive).
  const nameTaken = computed(() =>
    playerList.value.some(
      p => p.name.toLowerCase() === trimmedName.value.toLowerCase()
    )
  );

  // Checks if the name is empty or too long.
  const nameInvalid = computed(() =>
    trimmedName.value.length === 0 || trimmedName.value.length > maxNameLength
  );

  // Determines if the "Join" button should be disabled.
  const joinDisabled = computed(() => nameTaken.value || nameInvalid.value);

  /* ---------- LEADERBOARD (COMPUTED PROPERTY) ---------- */
  // This complex computed property processes the round's votes into a sorted leaderboard.
  const leaderboard = computed(() => {
    if (!result.value) return []; // Return empty array if there are no results yet.

    const buckets = {}; // An object to hold votes: { targetId: [voterId1, voterId2, ...] }

    // Create an entry for every player, ensuring even those with zero votes are included.
    Object.keys(players).forEach(id => (buckets[id] = []));

    // Populate the buckets with the votes from the result data.
    Object.entries(result.value.votes || {}).forEach(([voterId, targetId]) => {
      if (buckets[targetId]) {
        buckets[targetId].push(voterId);
      }
    });

    const totalVotes = Object.values(result.value.votes || {}).length || 1; // Total votes cast.

    // Map the buckets into a structured array for rendering.
    return Object.entries(buckets)
      .map(([targetId, voterIds]) => ({
        player: players[targetId], // The player who was voted for.
        voters: voterIds.map(id => players[id]), // An array of players who voted for them.
        count: voterIds.length,
        percent: Math.round((voterIds.length / totalVotes) * 100)
      }))
      // Sort the list so the player with the most votes is at the top.
      .sort((a, b) => b.count - a.count);
  });


  /* ---------- HELPER FUNCTIONS ---------- */
  // A utility to start a visual countdown timer.
  function startCountdown(secs) {
    countdown.value = secs;
    clearInterval(countdownTimer); // Clear any existing timer.
    countdownTimer = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) clearInterval(countdownTimer);
    }, 1000);
  }

  // A utility to stop the countdown timer.
  function stopCountdown() {
    clearInterval(countdownTimer);
    countdown.value = null;
  }

  /* ---------- UI ACTIONS ---------- */
  // These functions are called by user interactions (e.g., button clicks).

  // Called when the join form is submitted.
  function submitName() {
    if (joinDisabled.value) return;
    socket.emit('join', playerName.value.trim());
    nameSubmitted.value = true;
  }

  // Called when a player clicks a name to vote.
  function vote(targetId) {
    if (!votingAllowed.value) return;
    socket.emit('answer', targetId);
    myCurrentVoteId.value = targetId; // Immediately update the UI to show the selection.
  }

  // Called when the "Start Game" button is clicked.
  function startGame() {
    socket.emit('start-game');
  }

  /* ---------- SOCKET EVENT LISTENERS ---------- */
  // These functions handle events received from the server.

  // 'config': Receives initial game settings upon connecting.
  socket.on('config', cfg => {
    if (cfg.questionTimer) questionTimer.value = cfg.questionTimer;
    if (cfg.minPlayers) minPlayers.value = cfg.minPlayers;
    if (cfg.color) previewColor.value = cfg.color;
    if (cfg.colors) colors.value = cfg.colors;
  });

  // 'color-update': Server confirms or changes the player's preview color.
  socket.on('color-update', c => { previewColor.value = c; });

  // 'lobby-full': Receives a boolean indicating if the lobby is full.
  socket.on('lobby-full', full => { lobbyFull.value = full; });

  // 'join-error': Handles cases where the join attempt fails (e.g., duplicate name).
  socket.on('join-error', ({ reason }) => {
    if (reason === 'duplicate') nameSubmitted.value = false; // Send user back to the join screen.
  });

  // 'waiting': Server tells the client they have joined mid-game and must wait.
  socket.on('waiting', () => { waiting.value = true; });

  // 'players-updated': The most important event for syncing state. Receives the full list of players.
  socket.on('players-updated', list => {
    const currentIds = list.map(p => p.socketId);

    // Detect players who have left by comparing the new list with the old one.
    Object.keys(players).forEach(id => {
      if (!currentIds.includes(id)) {
        // Show a disconnect notification.
        const name = players[id].name;
        const color = players[id].color;
        disconnectNotification.value = { name, color };

        // Set a timeout to hide the notification after 5 seconds.
        setTimeout(() => {
          disconnectNotification.value = null;
        }, 5000);

        // Remove the player from the local state.
        delete players[id];
      }
    });

    // Update or add players from the received list.
    list.forEach(p => {
      if (!players[p.socketId]) {
        // If the player is new, add them to the reactive 'players' object.
        players[p.socketId] = { ...p, currentVote: null };
      } else {
        // If the player already exists, update their data (e.g., color might have changed).
        Object.assign(players[p.socketId], p);
      }
    });
  });

  // 'new-question': Server starts a new round.
  socket.on('new-question', ({ question, timeRemaining }) => {
    waiting.value = false;
    currentQuestion.value = question;
    gameActive.value = true;
    myCurrentVoteId.value = null; // Clear previous vote.
    result.value = null; // Clear previous results.
    Object.values(players).forEach(p => (p.currentVote = null)); // Reset vote status for all players.
    startCountdown(timeRemaining ?? questionTimer.value); // Start the visual timer.
  });

  // 'player-voted': Server indicates that a player has voted.
  socket.on('player-voted', ({ voterId }) => {
    // Update the player's state to show a visual indicator that they've voted.
    if (players[voterId]) players[voterId].currentVote = '?'; // '?' is a placeholder status.
  });

  // 'round-result': Server sends the final votes for the round.
  socket.on('round-result', ({ votes }) => {
    // Merge the final, detailed vote information into the local player state.
    Object.entries(votes).forEach(([voterId, targetId]) => {
      if (players[voterId]) players[voterId].currentVote = targetId;
    });
    result.value = { status: 'results', votes }; // Set the result object to trigger the results display.
    stopCountdown(); // Stop the question timer.
  });

  // 'game-ended': Server indicates the game is over and everyone is returning to the lobby.
  socket.on('game-ended', () => {
    gameActive.value = false;
    currentQuestion.value = '';
    stopCountdown();
    // Reset all vote-related state.
    Object.values(players).forEach(p => (p.currentVote = null));
    myCurrentVoteId.value = null;
    result.value = null;
  });

  // 'vote-cleared': Server tells a client their vote was nullified (e.g., the person they voted for left).
  socket.on('vote-cleared', ({ voterId }) => {
    if (players[voterId]) players[voterId].currentVote = null;
    // If it was my vote that was cleared, reset my selection UI.
    if (voterId === socket.id) myCurrentVoteId.value = null;
  });
</script>