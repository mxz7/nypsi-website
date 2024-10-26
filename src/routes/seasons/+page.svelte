<script>
  import SeasonButton from "$lib/components/SeasonButton.svelte";
  import seasons from "$lib/data/seasons";
</script>

<svelte:head>
  <title>seasons / nypsi</title>
</svelte:head>

<div class="flex h-screen items-center justify-center">
  <div class="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 transform text-center">
    <h1 class="text-4xl font-bold text-white">seasons</h1>

    <div class="m-auto mt-3 h-1 w-3/4 rounded-full bg-primary sm:w-full"></div>

    <div class="mt-4 flex flex-row flex-wrap justify-center">
      {#each Array.from(Object.keys(seasons)) as season}
        <SeasonButton number={season} />
      {/each}
    </div>
  </div>
</div>
