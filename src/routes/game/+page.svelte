<script lang="ts">
  import Loading from "$lib/components/Loading.svelte";
  import type Game from "$lib/types/Game";
  import { onMount } from "svelte";
  import InfiniteScroll from "svelte-infinite-scroll";
  import { fly } from "svelte/transition";

  export let data;

  let games: Game[] = [];

  onMount(async () => {
    const loaded = await Promise.resolve(data.streamed.recentGames);

    games = [...loaded.games];
  });

  async function fetchMore() {
    console.log("fetching more...");
    const more = await fetch(
      `/api/game?before=${data.loadedDate}&take=100&skip=${games.length}`,
    ).then((r) => r.json());
    console.log("fetched");

    if (more.ok) games = [...games, ...more.games];
    else console.error(more);
  }
</script>

<svelte:head>
  <title>games | nypsi</title>
</svelte:head>

<div class="w-full flex justify-center mt-12">
  <div class="flex flex-col w-full md:w-auto">
    {#if games.length === 0}
      <div class="relative w-full mt-2">
        <Loading
          fadeOutSettings={{ delay: 0, duration: 150 }}
          fadeInSettings={{ delay: 50, duration: 100 }}
        />
      </div>
    {:else}
      <div class="w-full px-6 sm:px-0 grid gap-4 grid-cols-1 md:grid-cols-3 md:w-fit">
        {#each games as game, i}
          <a
            href="/game/{game.id.toString(36)}"
            target="_blank"
            class="p-4 duration-300 hover:border-accent hover:border-opacity-20 hover:bg-opacity-40 rounded border border-gray-300 border-opacity-5 bg-gray-950 bg-opacity-25 flex flex-col justify-center {game.win ===
            1
              ? 'text-green-500'
              : game.win === 2
              ? 'text-yellow-500'
              : 'text-red-500'}"
            in:fly|global={{ y: 50, duration: 500, delay: i * 50 }}
          >
            <h1 class="text-xl font-semibold text-center">{game.game.replaceAll("_", " ")}</h1>

            {#if !game.game.includes("scratch")}
              <p class=" mt-1 mb-2 text-center text-sm font-semibold lg:text-base">
                {game.win == 1
                  ? `+$${game.earned.toLocaleString()}`
                  : game.win == 0
                  ? `-$${game.bet.toLocaleString()}`
                  : `$${game.bet.toLocaleString()}`}
              </p>
            {/if}

            <p class="text-center text-gray-500 text-xs">
              {game.id.toString(36)} | {new Date(game.date).toLocaleDateString()}
            </p>
          </a>
        {/each}
        <InfiniteScroll
          threshold={500}
          on:loadMore={() => {
            console.log("load");
          }}
        />
      </div>
    {/if}
  </div>
</div>
