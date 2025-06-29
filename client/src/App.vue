<template>
  <div class="game-container p-6 max-w-xl mx-auto text-center text-stone-700 text-3xl">
    <!-- Join Screen -->
    <div v-if="!nameSubmitted" class="join-screen space-y-8">
      <h1 class="text-5xl">
        <span :class="`text-${previewColor}-700 block text-8xl font-display uppercase tracking-widest transition-colors duration-150 ease-out`">Who</span>
        wants to play?
      </h1>

      <p v-if="lobbyFull">The game is currently full. Stick around an join when a spot opens up!</p>

      <form v-if="!lobbyFull" @submit.prevent="submitName" class="space-y-8">
        <div class="space-y-1">
          <div :class="`relative text-${previewColor}-700`">
            <input v-model="playerName" type="text" placeholder="Enter your name" :maxlength="maxNameLength" required autofocus
               :class="[
                `bg-white text-center rounded-full px-6 py-4 w-full placeholder-stone-400 border focus:outline-none focus:ring-2 focus:ring-stone-300`,
                nameTaken ? 'border-red-600' : 'border-stone-300'
              ]" />

              <!-- <svg class="absolute top-1/2 left-6 -mt-4 w-8 h-8 pointer-events-none" viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M506.914 189.903C498.166 137.197 467.797 86.1993 426.232 51.4107C372.385 6.34813 264.876 -0.651284 264.73 0.0439006C212.116 0.409787 159.172 4.5809 114.534 34.6934C113.856 35.1148 113.35 35.7632 113.107 36.5228L112.558 36.1935C44.4296 80.7219 4.10889 149.106 1.84039 229.159C1.34644 246.688 -6.30791 360.786 48.0812 418.212C63.2581 434.238 76.4557 452.115 94.5305 464.885C95.2257 465.379 95.9611 465.836 96.6782 466.308C115.06 480.922 136.07 491.84 159.541 498.931C205.204 512.724 259.392 516.457 306.006 505.992C308.208 505.498 310.396 504.935 312.588 504.335C342.825 500.573 374.167 484.577 399.285 469.89C400.364 469.261 422.127 456.502 431.827 448.735C464.563 422.511 485.557 379.904 493.018 339.009C493.281 337.534 520.723 273.142 506.914 189.903ZM9.3118 298.534C12.9999 315.248 17.7272 331.764 22.8423 347.929C28.4623 365.751 35.4032 383.618 44.1113 400.547C23.146 370.592 7.26283 335.229 9.3118 298.534ZM310.481 158.579C310.892 158.331 311.246 157.996 311.518 157.599C311.789 157.202 311.972 156.752 312.054 156.278C314.838 158.912 317.399 161.872 319.664 165.315C320.359 168.019 320.949 170.803 321.421 173.584C318.266 168.241 314.603 163.216 310.481 158.579ZM273.383 135.828C268.371 134.727 263.431 134.291 258.601 134.434C260.614 134.141 262.59 133.812 264.529 133.483C269.026 133.849 273.493 134.398 277.81 135.129C278.209 135.422 278.656 135.674 279.091 135.967C277.19 135.867 275.287 135.821 273.383 135.828ZM264.086 308.23C261.708 307.974 259.403 307.462 257.098 306.917C257.163 306.899 257.226 306.869 257.292 306.847C259.45 307.356 261.609 307.824 263.834 308.066C266.578 307.7 269.322 307.188 272.066 306.346C293.785 299.826 310.03 284.078 319.364 264.734C319.591 264.481 319.84 264.254 320.067 263.995C310.81 283.753 294.378 299.888 272.319 306.511C269.574 307.352 266.83 307.864 264.086 308.23ZM289.296 324.037C289.113 324 288.966 323.89 288.75 323.89C286.628 323.781 284.543 323.707 282.421 323.638C285.567 322.573 288.718 321.036 291.861 318.914C291.381 320.853 290.58 322.573 289.296 324.037ZM292.259 312.621C291.632 312.172 290.87 311.953 290.101 311.999C288.198 312.076 286.262 312.076 284.32 312.076C286.884 311.34 289.515 310.682 292.186 310.17C292.296 310.901 292.333 311.596 292.373 312.292C292.296 312.401 292.296 312.511 292.259 312.621ZM418.34 450.059C408.388 457.655 397.247 463.147 385.608 467.75C397.693 459.331 409.171 450.392 419.833 441.666C444.922 421.169 463.882 394.463 478.327 365.927C466.817 399.095 446.393 428.651 418.34 450.059ZM498.898 284.192C490.116 330.22 469.993 372.517 440.978 407.971C434.498 389.421 411.63 381.294 394.437 375.041C377.935 369.037 355.664 365.232 339.751 357.585C321.274 348.694 302.833 340.352 299.797 319.935C300.236 314.447 299.398 308.336 298.699 304.568C298.605 303.887 298.266 303.263 297.744 302.815C318.124 289.094 330.165 266.739 333.934 242.733C334.41 241.621 334.827 240.475 335.24 239.33C336.129 238.957 336.898 238.251 337.315 237.142C340.293 229.228 345.8 222.547 348.35 214.333C350.907 206.071 347.033 200.107 339.261 199.957C337.977 188.322 334.742 177.042 329.909 167.657C328.299 164.514 326.506 161.656 324.64 159.025C321.677 149.585 317.14 140.837 309.2 133.743C294.341 120.498 272.026 111.058 251.719 113.835C243.304 113.835 234.962 116.948 227.091 121.522C193.796 127.116 175.062 163.705 172.391 198.395C172.08 199.401 171.864 200.436 171.612 201.457L171.707 202.815C172.098 204.955 172.472 207.099 172.852 209.24C162.073 209.928 161.063 219.25 164.894 229.067C168.835 239.166 172.245 249.557 181.425 254.127C182.636 260.504 183.873 266.874 185.307 273.204C194.176 286.508 206.316 297.898 220.213 305.49C222.481 310.978 224.018 316.759 225.372 322.54C225.77 325.211 226.433 327.922 227.201 330.626C226.063 333.919 224.091 336.81 221.566 339.444C215.862 343.981 209.309 348.046 202.796 351.665C195.149 355.214 167.583 371.13 157.997 377.57C150.46 381.744 142.959 386.025 135.605 390.668C131.845 393.055 128.026 395.349 124.153 397.547C113.103 402.999 101.724 408.447 92.8694 416.211C91.2595 417.305 89.6496 418.439 88.1128 419.647C81.783 424.443 79.1486 431.062 78.0875 438.307C71.9767 431.216 66.3651 423.709 61.2933 415.841C26.278 361.69 7.50797 287.528 9.30082 224.08C11.423 148.199 53.7195 82.4819 118.152 41.0598C118.407 40.8932 118.63 40.6826 118.811 40.4378C165.022 9.56062 220.015 7.10917 274.28 7.1421C275.707 7.1421 349.821 10.9217 402.3 42.3038C483.739 90.9997 515.728 196.196 498.898 284.192ZM175.34 222.99C174.982 221.895 174.692 220.779 174.469 219.649C174.1 217.725 172.669 217.007 171.191 217.103C171.905 216.718 172.867 216.514 174.155 216.492C174.539 218.661 174.941 220.827 175.34 222.99Z" />
              </svg> -->
          </div>

          <p v-if="nameTaken" class="text-red-600 text-xl">That name is already taken!</p>
        </div>

        <div role="radiogroup" aria-label="Choose a color" class="flex flex-wrap justify-center gap-3">
          <button type="button" role="radio" v-for="color in colors" :key="color" @click="pickColor(color)"
            :disabled="!colorAvailable(color)"
            :aria-checked="previewColor === color ? 'true' : 'false'"
            :aria-label="`${color} color${!colorAvailable(c) ? ' (unavailable)' : ''}`"
            :class="[
              'flex items-center justify-center w-10 h-10 rounded-full border-4 transition-opacity',
              `bg-${color}-600`,
              previewColor === color ? `border-${color}-800` : 'border-transparent',
              !colorAvailable(color)
                ? 'opacity-10 cursor-not-allowed'
                : 'cursor-pointer'
            ]">
            <svg v-if="previewColor === color" class="w-4 h-4 fill-white" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path
                d="M510.537 105.794C510.219 104.105 509.291 102.592 507.929 101.543C493.428 90.063 459.145 43.77 436.629 51.4449C405.22 62.1621 232.546 289.334 194.267 339.4C180.9 320.298 69.5613 167.575 63.9748 170.999C44.8407 182.691 25.0917 192.688 6.8162 205.886C5.91679 206.504 5.15173 207.298 4.56697 208.22C3.98221 209.142 3.58983 210.172 3.4134 211.249C2.03808 212.285 1.00494 213.709 0.447475 215.338C-0.109989 216.967 -0.166164 218.726 0.286209 220.387C15.9751 284.097 69.3175 334.27 107.416 384.453C129.54 413.594 160.388 486.951 201.974 452.318C202.684 451.725 203.108 451.046 203.575 450.357C211.737 447.029 218.723 440.552 226.037 432.665C257.733 398.531 285.634 361.026 315.04 324.856C346.471 286.185 381.337 249.984 415.863 214.281C446.011 183.105 472.788 141.826 508.322 117.444C512.753 114.381 512.763 109.324 510.537 105.794ZM100.112 218.214C90.0619 209.309 79.6986 200.763 69.0419 192.592C80.4731 199.74 90.9188 208.353 100.112 218.214ZM52.3353 225.528C51.4809 224.658 50.4162 224.023 49.2443 223.685C48.0724 223.347 46.833 223.317 45.6463 223.599C44.2605 219.882 43.2173 216.047 42.5297 212.14C42.217 209.968 41.0777 208.001 39.3495 206.649C39.9856 206.172 40.5792 205.695 41.2365 205.228C41.362 207.127 42.0983 208.934 43.3354 210.38C67.4094 238.864 94.5364 264.284 119.013 292.387C121.822 295.62 124.568 298.885 127.324 302.129C101.321 277.493 78.3917 250.027 52.3353 225.528ZM149.882 415.704C152.31 418.502 154.727 421.312 157.207 424.057C160.08 427.979 162.985 431.902 165.985 435.771L166.017 435.898C160.133 430.598 154.727 423.114 149.882 415.704ZM157.674 353.595C164.808 359.891 172.271 365.891 180.115 370.704C179.935 371.921 180.007 373.163 180.327 374.351C180.423 374.87 180.635 375.39 180.836 375.898C173.28 368.295 165.557 360.859 157.674 353.595ZM192.37 435.442C192.348 435.368 192.359 435.294 192.327 435.241C192.073 434.658 191.776 434.138 191.522 433.566C198.794 433.481 208.313 428.085 218.765 419.679C209.532 428.393 200.405 434.531 192.37 435.442ZM440.053 71.7981C433.269 74.7557 427.619 79.3139 422.562 84.6673C427.566 77.5224 432.866 72.0313 440.053 71.7981ZM272.192 291.634C268.143 295.885 260.892 302.319 252.147 310.206C259.875 302.478 267.889 295.132 275.086 287.797C298.567 263.924 316.747 234.645 335.701 206.659C357.199 185.564 379.471 165.486 400.015 143.31C413.531 128.702 421.852 105.285 437.658 92.8085C427.121 103.918 418.799 119.967 411.697 135.391C400.428 147.264 390.464 160.684 380.011 173.681C346.821 215.002 308.648 253.376 272.192 291.634ZM411.029 192.836C394.312 213.094 375.549 231.539 357.708 250.79C371.171 233.914 384.538 216.953 396.813 199.08C397.778 197.67 398.944 195.688 400.227 193.26C404.541 188.946 408.856 184.642 413.085 180.253C425.34 167.49 439.905 153.465 448.841 137.14C455.976 127.547 463.788 118.027 472.619 112.303C459.824 141.338 428.796 171.327 411.029 192.836Z" />
            </svg>
          </button>
        </div>

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
          <h2 class="text-5xl text-balance">{{ currentQuestion }}</h2>

          <p v-if="countdown" :class="['text-2xl', countdown <= 5 ? 'text-red-700' : 'text-stone-500']">
            {{ countdown }}s to answer!
          </p>

          <div v-if="votingAllowed" class="space-y-6">
            <!-- Voting buttons -->
            <ul v-if="votingAllowed" class="space-y-2">
              <li v-for="player in playerList" :key="player.socketId">
                <button @click="vote(player.socketId)" :class="[
                  'flex items-center gap-2 justify-center px-8 py-4 rounded-full w-full border-b-4 cursor-pointer',
                  'transition-colors duration-150 ease-out',
                  player.socketId === myCurrentVoteId
                    ? `bg-${player.color}-600 text-white border-${player.color}-800`
                    : `bg-white text-${player.color}-700 border-stone-200`
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

  /* NEW: full palette the server supports (filled on first “config”) */
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

        // Clear it after 3s
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
    if (players[voterId]) players[voterId].currentVote = '?'   // placeholder
  })

  socket.on('round-result', ({ votes }) => {
    // merge votes into players
    Object.entries(votes).forEach(([voterId, targetId]) => {
      if (players[voterId]) players[voterId].currentVote = targetId
    })
    result.value = { status: 'results' }   // you can store votes as well if needed
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