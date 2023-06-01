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
  <div class="text-center w-full mt-16">
    {#if season}
      <h1 class="text-white text-4xl font-bold">season {$page.params.season}</h1>

      <div class="w-52 h-1 bg-red-500 rounded-full mt-3 m-auto" />

      {#if season.ended}
        <h2 class="text-lg text-gray-400 font-bold mt-3">
          {season.started.toLocaleDateString()} - {season.ended.toLocaleDateString()}
        </h2>

        {#if season.winners}
          <div class="text-white mt-16 text-left">
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
        <h2 class="text-lg text-gray-400 font-bold mt-3">
          started on {season.started.toLocaleDateString()}
        </h2>
      {/if}
    {:else}
      <h1 class="text-gray-400 text-4xl font-bold underline"><a href="/seasons">invalid season</a></h1>
    {/if}
  </div>
</div>
