<script lang="ts">
  import { page } from "$app/stores";
  import MiniLeaderboard from "$lib/components/MiniLeaderboard.svelte";
  import seasons from "$lib/data/seasons";

  const season = seasons[$page.params.season];
</script>

<svelte:head>
  <title>nypsi season winners</title>
</svelte:head>

<div class="w-full">
  <div class="mt-16 w-full text-center">
    {#if season}
      <h1 class="text-4xl font-bold text-white">season {$page.params.season}</h1>

      <div class="m-auto mt-3 h-1 w-52 rounded-full bg-red-500" />

      {#if season.ended}
        <h2 class="mt-3 text-lg font-bold text-gray-400">
          {season.started.toLocaleDateString()} - {season.ended.toLocaleDateString()}
        </h2>

        {#if season.winners}
          <div class="mt-16 text-left text-white">
            <MiniLeaderboard
              concatUser={false}
              data={season.winners.map((i) => {
                return {
                  username: i.username,
                  value: i.value,
                  position: season.winners ? season.winners?.indexOf(i) + 1 : 0
                };
              })}
              title="winners"
            />
          </div>
        {/if}
      {:else}
        <h2 class="mt-3 text-lg font-bold text-gray-400">
          started on {season.started.toLocaleDateString()}
        </h2>
      {/if}
    {:else}
      <h1 class="text-4xl font-bold text-gray-400 underline"><a href="/seasons">invalid season</a></h1>
    {/if}
  </div>
</div>
