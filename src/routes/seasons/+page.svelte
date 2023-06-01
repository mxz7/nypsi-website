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
</svelte:head>

<div class="h-screen flex justify-center items-center">
  <div class="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
    <h1 class="text-white text-4xl font-bold">seasons</h1>

    <div class="w-3/4 h-1 bg-red-500 rounded-full mt-3 m-auto sm:w-full" />

    <div class="mt-4 flex flex-row flex-wrap justify-center">
      {#each Array.from(Object.keys(seasons)) as season}
        <SeasonButton number={season} />
      {/each}
    </div>
  </div>
</div>
