<script lang="ts">
  import { page } from "$app/state";
  import seasons from "$lib/data/seasons";
  import MiniLeaderboard from "./MiniLeaderboard.svelte";

  const season = seasons[page.params.season];
</script>

<svelte:head>
  <title>season {page.params.season} | nypsi</title>
  <meta name="og:title" content="season {page.params.season} | nypsi" />
</svelte:head>

<div class="w-full">
  <div class="mt-16 w-full text-center">
    {#if season}
      <h1 class="text-4xl font-bold text-white">season {page.params.season}</h1>

      <div class="m-auto mt-3 h-1 w-52 rounded-full bg-primary"></div>

      {#if season.ended}
        <h2 class="mt-3 text-lg font-bold text-slate-400">
          {season.started.toLocaleDateString()} - {season.ended.toLocaleDateString()}
        </h2>

        {#if season.winners}
          <div class="mt-6 flex w-full justify-center">
            <MiniLeaderboard
              data={season.winners.map((i) => {
                return {
                  user: { username: i.username, id: i.id },
                  value: i.value,
                  position: season.winners ? season.winners?.indexOf(i) + 1 : 0,
                };
              })}
              title="winners"
            />
          </div>
        {/if}
      {:else}
        <h2 class="mt-3 text-lg font-bold text-slate-400">
          started on {season.started.toLocaleDateString()}
        </h2>
      {/if}
    {:else}
      <h1 class="text-4xl font-bold text-slate-400 underline">
        <a href="/seasons">invalid season</a>
      </h1>
    {/if}
  </div>
</div>
