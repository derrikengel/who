<template>
  <div class="relative p-6 max-w-xl mx-auto text-center text-stone-700 dark:text-stone-100 text-3xl">

    <!-- Join Screen -->
    <div v-if="!nameSubmitted" class="space-y-8">
      <div class="space-y-4">
        <h1 class="text-5xl">
          <span
            :class="`text-${previewColor}-700 dark:text-${previewColor}-400 block text-8xl font-display uppercase tracking-widest transition-colors duration-150 ease-out`">Who</span>
          wants to play?
        </h1>

        <p class="text-2xl text-stone-500 dark:text-stone-400 leading-6 text-balance">A game of questionable accusations
          for 3-10 suspects.</p>
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
        <ul
          class="divide-y divide-stone-200 dark:divide-stone-700 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-md px-8">
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
          <span
            :class="`block text-8xl font-display uppercase tracking-widest text-${playerColor}-700 dark:text-${playerColor}-400`">Who</span>
          is playing?
        </h1>

        <!-- Lobby Player List -->
        <ul
          class="divide-y divide-stone-200 dark:divide-stone-700 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-md px-8">
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
      <div v-if="currentQuestion" class="space-y-6">
        <h1
          :class="`text-8xl uppercase font-display tracking-widest text-${playerColor}-700 dark:text-${playerColor}-400`">
          Who</h1>

        <!-- Current Question -->
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
                <svg v-if="player.currentVote" class="w-2" viewBox="0 0 91 75" fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M89.9099 10.35C89.7399 9.74999 89.1799 8.94999 88.2099 7.94999C85.9099 5.47998 82.2599 2.94999 77.2599 0.349985C76.1599 -0.180015 75.0299 -0.100015 73.8599 0.599985C72.9899 1.16999 72.1099 1.81999 71.2099 2.54999C68.6399 4.94999 65.9599 7.84999 63.1599 11.25C61.0899 13.65 57.9099 17.22 53.6099 21.95C53.1399 22.48 51.8399 23.98 49.7099 26.45C48.1399 28.28 46.8399 29.75 45.8099 30.85C40.9399 36.15 36.7299 41.38 33.1599 46.55C31.1899 45.72 29.1899 44.6 27.1599 43.2C25.7599 42.2 24.0099 40.78 21.9099 38.95C20.8399 37.98 19.4399 36.92 17.7099 35.75C16.7399 35.12 15.2899 34.13 13.3599 32.8C11.7899 31.73 10.2299 31.85 8.65993 33.15C7.95993 33.75 7.23993 34.48 6.50993 35.35C4.47993 37.88 2.67993 40.65 1.10993 43.65C0.309931 45.21 -0.0600686 46.53 -6.85868e-05 47.6C0.0999314 48.73 0.749931 49.93 1.94993 51.2C5.17993 54.6 9.06993 57.8 13.5999 60.8C15.2999 61.97 20.2199 65.03 28.3499 70C30.4499 71.47 32.0699 72.53 33.1999 73.2C34.7299 74.1 35.9799 74.48 36.9499 74.35C37.8499 74.18 38.9299 73.47 40.1999 72.2C40.8699 71.57 41.6299 70.67 42.4999 69.5C43.7299 67.93 44.4799 67 44.7499 66.7C45.6199 65.7 47.9499 63.05 51.7499 58.75C54.6199 55.48 56.8999 52.75 58.5999 50.55C61.0999 47.38 63.2199 44.85 64.9499 42.95C69.8199 37.82 73.5799 33.72 76.2499 30.65C80.2199 26.05 83.6499 21.68 86.5499 17.55C87.8499 16.12 88.7299 14.95 89.1999 14.05C89.9699 12.55 90.1999 11.32 89.8999 10.35H89.9099Z" />
                </svg>

                {{ player.name }}
              </li>
            </ul>
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
            <div
              :class="`bg-${entry.player.color}-600 dark:bg-${entry.player.color}-300 rounded-full text-white dark:text-stone-950 text-base text-left px-2 min-w-min`"
              :style="{ maxWidth: entry.percent + '%' }">{{ entry.percent }}%</div>
          </div>

          <!-- Voters List -->
          <div class="mt-2 text-xl flex flex-wrap justify-center gap-3">
            Who thinks so?
            <ul v-if="entry.voters.length" class="flex flex-wrap gap-3">
              <li v-for="voter in entry.voters" :key="voter.socketId"
                :class="`text-${voter.color}-700 dark:text-${voter.color}-300`">
                {{ voter.name }}
              </li>
            </ul>
            <p class="text-xl" v-else>Nobody!</p>
          </div>

        </div>
      </div>
    </div>

    <button @click="toggleMute" class="absolute cursor-pointer top-0 right-0 w-12 h-12 content-center text-stone-400  hover:text-stone-700 dark:hover:text-stone-100 transition-colors duration-150 ease-out" aria-label="Mute Sound Effects">
      <svg class="w-6 block m-auto" viewBox="0 0 99 67" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          d="M54.9 6.80999C54.67 4.53999 54.55 2.97999 54.55 2.10999C54.53 1.68999 54.41 1.40999 54.22 1.25999C54.19 1.19999 54.18 1.12999 54.14 1.06999C54.11 1.00999 54.08 0.94999 54.05 0.88999C53.88 0.60999 53.69 0.40999 53.42 0.22999C53.3 0.14999 53.15 0.0899902 53.01 0.0499902C52.94 0.0399902 52.87 0.0299902 52.8 0.0199902C52.73 0.00999023 52.66 -9.76585e-06 52.59 -0.0100098C52.45 -0.0100098 52.3 -9.76399e-06 52.16 0.0499902C52.1 0.0699902 52.03 0.0999902 51.97 0.12999C51.91 0.14999 51.84 0.17999 51.78 0.20999C51.74 0.22999 51.71 0.26999 51.67 0.29999C51.11 0.50999 50.51 0.81999 49.86 1.24999C49.36 1.54999 48.61 2.01999 47.61 2.64999C40.88 6.61999 35.78 10.02 32.31 12.85C28.88 15.68 24.63 16.93 19.56 16.6C14.83 16.27 11.13 16.27 8.45997 16.6C5.05997 16.97 3.02997 17.43 2.35997 18C1.58997 18.7 0.959974 20.83 0.459974 24.4C0.0499741 27.24 -0.0800259 30.96 0.049974 35.56C0.119974 41.36 0.099974 45.09 -2.59526e-05 46.76C-0.030026 48.29 0.649974 49.28 2.04997 49.71C3.74997 50.18 5.09997 50.41 6.09997 50.41C15.83 50.78 20.73 50.96 20.8 50.96C21.07 50.96 21.73 51.03 22.8 51.16C23.7 51.29 24.42 51.29 24.95 51.16C27.12 50.59 29.33 51.28 31.6 53.21C33.23 54.51 35.57 56.59 38.6 59.46C41.93 62.33 45.3 64.59 48.7 66.26C49.97 66.96 50.9 67.16 51.5 66.86C52.1 66.59 52.58 65.74 52.95 64.31C53.48 62.28 53.82 59.83 53.95 56.96C54.05 53.69 54.13 51.23 54.2 49.56C54.23 48.43 54.25 45.34 54.25 40.31C54.22 36.51 54.3 33.43 54.5 31.06C54.8 26.93 54.97 24.63 55 24.16C54.9 19.63 54.95 15.39 55.15 11.46C55.22 10.33 55.13 8.77999 54.9 6.80999Z" />
        <!-- unmuted-->
        <g v-show="!audioMuted">
          <path
            d="M88.7001 18.06C87.3001 13.23 85.3801 9.28999 82.9501 6.25999C82.4501 5.62999 81.5201 4.92999 80.1501 4.15999C78.8201 3.42999 77.9001 2.73999 77.4001 2.10999C76.5301 2.20999 75.7001 2.57999 74.9001 3.20999C74.7001 3.33999 74.0301 3.92999 72.9001 4.95999L71.9001 5.80999C70.6001 6.97999 70.3801 8.30999 71.2501 9.80999L76.1001 18.11C76.3301 18.58 76.7301 19.23 77.3001 20.06C79.2701 25.69 79.6501 30.98 78.4501 35.91C76.7801 42.91 72.6801 48.29 66.1501 52.06C65.5201 52.43 65.1301 52.73 65.0001 52.96C64.6701 53.29 64.5801 53.74 64.7501 54.31C64.6801 55.28 64.8701 56.08 65.3001 56.71C66.3001 58.54 67.3301 59.68 68.4001 60.11C69.5301 60.61 70.7801 60.34 72.1501 59.31C76.0801 56.44 79.5701 53.44 82.6001 50.31C84.7001 48.11 86.1301 45.83 86.9001 43.46C88.4301 38.63 89.4001 34.48 89.8001 31.01C90.2701 26.44 89.9001 22.13 88.7001 18.06Z" />
          <path
            d="M65.4999 18.46C64.6299 18.03 64.1299 17.79 63.9999 17.76C63.4299 17.59 62.9199 17.69 62.4499 18.06C61.3199 18.99 60.6299 19.54 60.3999 19.71C59.7699 20.44 59.4699 21.29 59.4999 22.26C59.4699 22.89 59.6299 23.56 59.9999 24.26C60.2299 24.63 60.6199 25.19 61.1499 25.96C63.1199 28.89 63.8199 31.88 63.2499 34.91C62.5499 38.71 61.2699 41.69 59.3999 43.86C58.6299 44.86 58.5999 45.78 59.2999 46.61C59.8699 47.41 60.7299 47.69 61.8999 47.46C64.3999 46.86 66.4199 45.31 67.9499 42.81C70.5199 38.58 71.8699 34.38 71.9999 30.21C72.1299 24.81 69.9699 20.89 65.4999 18.46Z" />
        </g>
        <!-- muted -->
        <path v-show="audioMuted"
          d="M94.2599 21.06C94.8599 20.07 95.5099 19.05 96.2599 18.17C96.8899 17.42 97.7299 16.7 98.2199 15.85C98.9799 14.52 98.7199 13.26 98.2299 11.93C97.6099 10.21 96.0599 9.96001 94.3299 10.05C93.5599 10.09 92.8699 10.34 92.0699 10.33C91.4899 10.33 90.8499 10.26 90.2699 10.33C89.2599 10.44 89.0299 10.74 88.4099 11.52C87.6099 12.27 86.9899 13.27 86.2999 14.12C85.4799 15.12 84.5999 16.05 83.6699 16.94C82.1099 18.43 80.4399 19.8 78.9599 21.38C78.4899 21.88 78.0499 22.4 77.6199 22.93C77.5399 22.83 77.4599 22.73 77.3699 22.63C75.8599 20.9 74.5099 19.06 73.2699 17.11C72.1499 15.34 71.2599 13.39 69.7299 11.93C68.4099 10.67 66.3799 9.46001 64.7099 8.79001C63.4699 8.29001 63.4899 8.86001 62.5799 9.67001C61.9799 10.2 61.1399 10.5 60.7399 11.25C60.4799 11.74 59.6599 13.12 60.1199 13.42C60.4699 15.52 62.8199 17.93 64.0199 19.69C65.2899 21.54 66.6399 23.36 68.0199 25.13C69.4099 26.91 70.7999 28.66 72.1499 30.44C71.6699 31.05 71.1699 31.65 70.6399 32.22C67.4799 35.59 64.8899 39.41 62.4899 43.33C61.7699 44.51 61.8599 45.51 61.4699 46.76C61.1299 47.87 60.2799 49.1 60.9599 50.17C61.6999 51.33 63.2199 51.75 64.4999 51.89C65.6999 52.02 67.1199 51.04 68.2499 50.54C71.1099 49.27 73.5399 46.43 75.2799 43.88C76.3499 42.31 77.3299 40.71 78.4499 39.19C80.2199 41.56 82.1199 43.86 83.8299 46.29C84.7999 47.67 85.9099 48.87 86.9799 50.16C88.1499 51.57 89.5399 52.19 91.1399 53.01C92.6599 53.8 93.7199 54.12 95.4099 53.59C97.1199 53.05 97.9899 51.15 97.7299 49.39C97.4399 47.39 96.1799 46.48 94.9399 45.05C93.8499 43.79 93.2199 42.22 92.4299 40.76C90.7399 37.64 88.6299 33.75 85.7899 31.49C86.7899 30.37 87.7599 29.21 88.6899 28.06C90.5899 25.71 92.6799 23.67 94.2599 21.07V21.06Z" />
      </svg>
    </button>
  </div>

  <!-- Disconnect Notification -->
  <div v-if="disconnectNotification"
    :class="`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-${disconnectNotification.color}-600 dark:bg-${disconnectNotification.color}-300 text-white dark:text-stone-950 px-6 py-2 rounded-full shadow-lg text-xl`">
    {{ disconnectNotification.name }} disconnected…
  </div>
</template>

<script setup>
  // Import reactive utilities from Vue and the socket.io client library.
  import { ref, reactive, computed, onMounted } from 'vue';
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
  let audioMuted = ref(false);

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
    playColorSound(c); // Play the sound for the newly selected color.
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

  // A Map to cache loaded <audio> elements. This improves performance by
  // preventing the browser from re-downloading the same sound file on every click.
  const soundCache = new Map();

  function playColorSound(color) {
    if (audioMuted.value) return; // If audio is muted, don't play any sound.

    // If the sound for this color hasn't been loaded yet
    if (!soundCache.has(color)) {
      const audio = new Audio(`/sounds/${color}.mp3`); // Create a new Audio object with the path to the sound file.
      audio.volume = 0.5; // Set a default volume.
      soundCache.set(color, audio); // Store the newly created audio object in the cache for future use.
    }

    const audio = soundCache.get(color); // Retrieve the audio object from the cache.
    audio.currentTime = 0; // Rewind the sound to the beginning.
    audio.play().catch(() => { }); // Play the sound.
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
    const targetPlayer = players[targetId]; // Find the player object that corresponds to the vote target.
    if (targetPlayer) playColorSound(targetPlayer.color); // If the player exists, play the sound associated with their color.
    socket.emit('answer', targetId);
    myCurrentVoteId.value = targetId; // Immediately update the UI to show the selection.
  }

  // Called when the "Start Game" button is clicked.
  function startGame() {
    socket.emit('start-game');
  }

  function toggleMute() {
    audioMuted.value = !audioMuted.value;
    localStorage.setItem('audioMuted', audioMuted.value); // Use local storage to remember the user's preference.
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

  onMounted(() => {
    // Check if the user has a saved audio preference
    const audioPreference = localStorage.getItem('audioMuted');
    audioMuted.value = audioPreference === 'true'; // Match the value from local storage.
  });
</script>