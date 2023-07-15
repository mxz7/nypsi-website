<script>
  import SeasonButton from "$lib/components/SeasonButton.svelte";
  import seasons from "$lib/data/seasons";
</script>

<svelte:head>
  <title>nypsi seasons</title>
  <meta
    name="description"
    content="nypsi has a seasonal economy. meaning that the economy is reset every few months, with the top 10 players receiving rewards"
  />

  <meta name="og:title" content="seasonal economy" />
  <meta
    name="og:description"
    content="nypsi uses a seasonal economy. meaning that the economy is reset every few months, with the top 10 players receiving rewards"
  />
  <meta name="og:site_name" content="nypsi" />
</svelte:head>

<div class="flex h-screen items-center justify-center">
  <div class="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 transform text-center">
    <h1 class="text-4xl font-bold text-white">seasons</h1>

    <div class="m-auto mt-3 h-1 w-3/4 rounded-full bg-accent sm:w-full" />

    <div class="mt-4 flex flex-row flex-wrap justify-center">
      {#each Array.from(Object.keys(seasons)) as season}
        <SeasonButton number={season} />
      {/each}
    </div>
  </div>
</div>
