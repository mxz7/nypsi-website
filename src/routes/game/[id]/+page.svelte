<script lang="ts">
  import { page } from "$app/stores";
  import Blackjack from "$lib/components/games/Blackjack.svelte";
  import Mines from "$lib/components/games/Mines.svelte";
  import RockPaperScissors from "$lib/components/games/RockPaperScissors.svelte";
  import Roulette from "$lib/components/games/Roulette.svelte";
  import Scratch from "$lib/components/games/Scratch.svelte";
  import Slots from "$lib/components/games/Slots.svelte";
  import Tower from "$lib/components/games/Tower.svelte";
  import { fade, fly } from "svelte/transition";

  export let data;
</script>

<svelte:head>
  <title>nypsi game: {$page.params.id}</title>
  <meta
    name="description"
    content="
  view game information"
  />
</svelte:head>

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
            <Slots outcome={game.outcome} />
          {:else if game.game === "rps"}
            <RockPaperScissors outcome={game.outcome} />
          {:else if game.game === "blackjack"}
            <Blackjack outcome={game.outcome} />
          {:else if game.game.includes("scratch")}
            <Scratch {game} />
          {:else if game.game === "tower"}
            <Tower outcome={game.outcome} />
          {:else if game.game === "mines"}
            <Mines outcome={JSON.parse(game.outcome.slice(6))} />
          {:else if game.game === "roulette"}
            <Roulette outcome={game.outcome} />
          {:else}
            <p class="text-center text-white">game: {game.game}<br />outcome: {game.outcome}</p>
          {/if}
        </div>
        <div class="text-center text-xl">
          <!-- <p class="text-xs text-white">{game.outcome}</p> -->
          {#if game.win && !game.game.includes("scratch")}
            <p class="font-bold text-green-400">won</p>

            <p class="text-lg text-green-400 opacity-75">
              ${(game.earned - game.bet).toLocaleString()} profit
            </p>
          {:else if !game.win && !game.game.includes("scratch")}
            <p class=" text-red-500">lost</p>
          {/if}
        </div>

        <div class="mt-5 px-2 text-center text-gray-300">
          {#if game.win && !game.game.includes("scratch")}
            <p>
              bet ${game.bet.toLocaleString()} and won ${game.earned.toLocaleString()}{game.xpEarned >
              0
                ? ` (${game.xpEarned.toLocaleString()}xp)`
                : ""}
            </p>
          {:else if !game.game.includes("scratch")}
            <p>bet ${game.bet.toLocaleString()}</p>
          {/if}

          <p class="mt-3 text-center text-gray-300">
            played by <span class="font-bold text-red-500">{game.username}</span> on {new Date(
              game.date
            ).toLocaleDateString()} at {new Date(game.date).toLocaleTimeString()}
          </p>
        </div>
      {:else}
        <p class="text-center text-xl font-bold text-white">unknown game</p>
      {/if}
    </div>
  {/await}
</div>
