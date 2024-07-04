<script lang="ts">
  import { page } from "$app/stores";
  import Loading from "$lib/components/Loading.svelte";
  import type Game from "$lib/types/Game";
  import dayjs from "dayjs";
  import InfiniteLoading from "svelte-infinite-loading";
  import { fly } from "svelte/transition";

  export let data;

  let games: Game[] = [];

  if (data.recentGames.ok) games = [...data.recentGames.games];

  function infiniteHandler({ detail: { loaded, complete, error } }) {
    console.log("fetching more");

    const params = $page.url.searchParams;

    params.set("take", "50");
    params.set("skip", games.length.toString());
    if (!params.get("before")) params.set("before", data.loadedDate.toString());

    fetch(`/api/game?${params.toString()}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.games.length > 0) {
          games = [...games, ...data.games];
          loaded();
        } else if (data.ok && data.games.length === 0) {
          complete();
        } else {
          setTimeout(() => {
            error();
          }, 1000);
        }
      });
  }
</script>

<svelte:head>
  <title>games / nypsi</title>
</svelte:head>

<div class="mt-12 flex w-full justify-center">
  <div class="flex w-full flex-col md:w-auto">
    {#if data.resultText}
      <h2 class="text-center text-3xl font-semibold">{@html data.resultText}</h2>
    {:else if data.loadedDate}
      <h2 class="text-center text-3xl font-semibold">recent games</h2>
    {/if}

    {#if data.loadedDate}
      <h3 class="mb-6 text-center text-sm opacity-50">
        as of {dayjs(data.loadedDate).format("HH:mm:ss")}
      </h3>
    {/if}

    {#if games.length === 0}
      <div class="relative mt-6 w-full">
        <Loading
          fadeOutSettings={{ delay: 0, duration: 150 }}
          fadeInSettings={{ delay: 50, duration: 100 }}
        />
      </div>
    {:else}
      <div
        class="grid w-full grid-cols-1 gap-4 px-6 sm:px-0 md:max-w-4xl md:grid-cols-3 lg:grid-cols-4"
      >
        {#each games as game, i}
          <a
            href="/game/{game.id.toString(36)}"
            target="_blank"
            class="flex flex-col justify-center rounded border border-slate-300 border-opacity-5 bg-slate-950 bg-opacity-25 p-4 duration-300 hover:border-accent hover:border-opacity-20 hover:bg-opacity-40 {game.win ===
            1
              ? 'text-green-500'
              : game.win === 2
                ? 'text-yellow-500'
                : 'text-red-500'}"
            in:fly|global={{ y: 50, duration: 500, delay: (i % 50) * 50 }}
          >
            <h1 class="text-center text-xl font-semibold">{game.game.replaceAll("_", " ")}</h1>

            {#if !game.game.includes("scratch")}
              <p class=" mb-2 mt-1 text-center text-sm font-semibold lg:text-base">
                {game.win == 1
                  ? `+$${game.earned.toLocaleString()}`
                  : game.win == 0
                    ? `-$${game.bet.toLocaleString()}`
                    : `$${game.bet.toLocaleString()}`}
              </p>
            {/if}

            <p class="text-center text-xs text-slate-500">
              {game.id.toString(36)} | {#if new Date().getDate() !== new Date(game.date).getDate()}
                {new Date(game.date).toLocaleDateString()}
              {:else}
                {new Date(game.date).toLocaleTimeString()}
              {/if}
            </p>
          </a>
        {/each}
      </div>
      <InfiniteLoading on:infinite={infiniteHandler}>
        <div class="relative mt-8 w-full" slot="spinner">
          <Loading />
        </div></InfiniteLoading
      >
    {/if}
  </div>
</div>
