<script lang="ts">
  import { page } from "$app/stores";
  import Loading from "$lib/components/Loading.svelte";
  import Blackjack from "$lib/components/games/Blackjack.svelte";
  import Mines from "$lib/components/games/Mines.svelte";
  import RockPaperScissors from "$lib/components/games/RockPaperScissors.svelte";
  import Roulette from "$lib/components/games/Roulette.svelte";
  import Scratch from "$lib/components/games/Scratch.svelte";
  import Slots from "$lib/components/games/Slots.svelte";
  import Tower from "$lib/components/games/Tower.svelte";
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";

  export let data;

  onMount(async () => {
    console.log(await Promise.resolve(data.streamed.game));
  });
</script>

<svelte:head>
  <title>nypsi game {$page.params.id}</title>
  <meta name="description" content="view all information about game {$page.params.id}" />
</svelte:head>

<div class="mt-8 flex flex-col justify-center">
  {#await data.streamed.game}
    <div class="relative mt-4">
      <Loading fadeInSettings={{ delay: 50, duration: 100 }} fadeOutSettings={{ duration: 300 }} />
    </div>
  {:then game}
    <div in:fly={{ y: 25, delay: 300, duration: 500 }} out:fly={{ y: 15, duration: 250 }}>
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
        <div class="text-center text-xl font-bold">
          <!-- <p class="text-xs text-white">{game.outcome}</p> -->
          {#if game.win == 1 && !game.game.includes("scratch")}
            <p class=" text-green-400">won</p>

            <p class="text-lg text-green-400 opacity-75">
              ${(game.earned - game.bet).toLocaleString()} profit
            </p>
          {:else if game.win == 0 && !game.game.includes("scratch")}
            <p class=" text-red-500">lost</p>
          {:else if game.win == 2 && !game.game.includes("scratch")}
            <p class=" text-yellow-500">draw</p>
          {/if}
        </div>

        <div class="mt-5 px-2 text-center text-gray-300">
          {#if game.win == 1 && !game.game.includes("scratch")}
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
            played by
            {#if game.userId}
              <a
                href="/user/{game.userId}"
                class="font-bold text-accent underline-offset-4 hover:underline">{game.username}</a
              >
            {:else}
              <span class="font-bold text-accent">{game.username}</span>
            {/if}
            on {new Date(game.date).toLocaleDateString()} at {new Date(
              game.date
            ).toLocaleTimeString()}
          </p>
        </div>
      {:else}
        <p class="text-center text-xl font-bold text-white">unknown game</p>
      {/if}
    </div>
  {/await}
</div>
