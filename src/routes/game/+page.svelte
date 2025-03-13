<script lang="ts">
  import { page } from "$app/state";
  import Loading from "$lib/components/Loading.svelte";
  import type Game from "$lib/types/Game";
  import dayjs from "dayjs";
  import { fly } from "svelte/transition";

  let { data } = $props();

  let games: Game[] = $state([]);
  let status: "more" | "loading" | "complete" | "error" = $state("more");

  (() => {
    if (data.recentGames.ok) {
      games.push(...data.recentGames.games);
    }
  })();

  async function loadMore() {
    status = "loading";
    console.log("fetching more");

    const params = page.url.searchParams;

    params.set("take", "50");
    params.set("skip", games.length.toString());

    if (!params.get("before")) params.set("before", data.loadedDate.toString());

    const response = await fetch(`/api/game?${params.toString()}`);
    const json = await response.json();

    console.log(json);

    if (json.games.length > 0) {
      games.push(...json.games);
      status = "more";
    } else if (json.ok && json.games.length === 0) {
      status = "complete";
    } else {
      status = "error";
    }
  }
</script>

<svelte:head>
  <title>games | nypsi</title>
  <meta name="og:title" content="games | nypsi" />
</svelte:head>

<div class="mt-12 flex w-full justify-center">
  <div class="w-full md:max-w-4xl">
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
        class="grid w-full grid-cols-1 gap-4 px-6 md:max-w-4xl md:grid-cols-3 md:px-0 lg:grid-cols-4"
      >
        {#each games as game, i}
          <a
            href="/game/{game.id.toString(36)}"
            target="_blank"
            class="border-primary/55 bg-base-200 hover:border-primary/20 flex flex-col justify-center rounded-lg border p-4 text-center duration-300 {game.win ===
            1
              ? 'text-success'
              : game.win === 2
                ? 'text-warning'
                : 'text-error'}"
            in:fly|global={{ y: 50, duration: 500, delay: (i % 48) * 50 }}
          >
            <h1 class="text-xl font-semibold">{game.game.replaceAll("_", " ")}</h1>

            {#if !game.game.includes("scratch")}
              <p class=" mt-1 mb-2 text-sm font-semibold lg:text-base">
                {game.win == 1
                  ? `+$${game.earned.toLocaleString()}`
                  : game.win == 0
                    ? `-$${game.bet.toLocaleString()}`
                    : `$${game.bet.toLocaleString()}`}
              </p>
            {/if}

            <p class="text-xs text-slate-500">
              {game.id.toString(36)} | {#if new Date().getDate() !== new Date(game.date).getDate()}
                {new Date(game.date).toLocaleDateString()}
              {:else}
                {new Date(game.date).toLocaleTimeString()}
              {/if}
            </p>
          </a>
        {/each}
      </div>

      <div class="mt-4 flex w-full justify-center">
        {#if status === "more"}
          <button class="btn" onclick={() => loadMore()}>load more</button>
        {:else if status === "loading"}
          <button class="btn btn-disabled" aria-label="loading"
            ><span class="loading loading-spinner"></span></button
          >
        {:else if status === "error"}
          <button class="btn btn-disabled btn-error">error</button>
        {/if}
      </div>
    {/if}
  </div>
</div>
