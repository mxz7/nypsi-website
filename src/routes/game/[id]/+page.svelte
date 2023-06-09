<script lang="ts">
  import { fade, fly } from "svelte/transition";

  export let data;
</script>

<div class="mt-8 flex flex-col justify-center">
  {#await data.streamed.game}
    <div out:fade={{ duration: 300 }} class="flex items-center justify-center">
      <svg
        class="-ml-1 mr-3 h-10 w-10 animate-spin text-red-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  {:then game}
    <div in:fly={{ y: 25, delay: 300, duration: 500 }}>
      {#if game.ok}
        <div class="my-3">
          {#if game.game === "slots"}
            <div class="flex w-full items-center justify-center">
              <img
                src="https://cdn.discordapp.com/emojis/{game.outcome
                  ?.split('**|**')[0]
                  .split(':')[2]
                  .replace('>', '')}"
                alt=""
                class="h-14 w-14"
              />
              <p class="mx-3 text-5xl text-gray-200">-</p>
              <img
                src="https://cdn.discordapp.com/emojis/{game.outcome
                  ?.split('**|**')[1]
                  .split(':')[2]
                  .replace('>', '')}"
                alt=""
                class="h-14 w-14"
              />
              <p class="mx-3 text-5xl text-gray-200">-</p>
              <img
                src="https://cdn.discordapp.com/emojis/{game.outcome
                  ?.split('**|**')[2]
                  .split(':')[2]
                  .replace('>', '')}"
                alt=""
                class="h-14 w-14"
              />
            </div>
          {/if}
        </div>
        <div class="text-center text-xl">
          {#if game.win}
            <p class="font-bold text-green-400">won</p>
            <p class="text-lg text-green-400 opacity-75">
              ${(game.earned - game.bet).toLocaleString()} profit
            </p>
          {:else}
            <p class=" text-red-500">lost</p>
          {/if}
        </div>

        <div class="mt-5 text-center text-gray-300">
          {#if game.win}
            <p>
              bet ${game.bet.toLocaleString()} and won ${game.earned.toLocaleString()}{game.xpEarned >
              0
                ? ` (${game.xpEarned.toLocaleString()}xp)`
                : ""}
            </p>
          {:else}
            <p>bet ${game.bet.toLocaleString()}</p>
          {/if}

          <p class="mt-3 text-center text-gray-300">
            played by <span class="font-bold text-red-500">{game.username}</span> on {new Date(
              game.date
            ).toLocaleDateString()} at {new Date(game.date).toLocaleTimeString()}
          </p>
        </div>
      {:else}
        <p class="text-xl font-bold text-white">unknown game</p>
      {/if}
    </div>
  {/await}
</div>
