<script lang="ts">
  export let data;
</script>

<svelte:head>
  <title>nypsi leaderboard</title>
  <meta name="description" content="leaderboards for the nypsi discord bot" />
</svelte:head>

{#if data.title}
  <header class="mt-5 text-center sm:w-full">
    <h1 class="text-2xl font-bold text-white sm:text-4xl">
      {data.title}
    </h1>
    <div class="m-auto mt-3 h-1 w-3/4 rounded-full bg-red-500 sm:w-1/2" />
  </header>

  {#await data.test}
    <p>loading..</p>
  {:then value}
    <p>{value}</p>
    <!-- <div class="mt-10 px-5 sm:px-24">
      {#if value.length === 0}
        <h2 class="m-auto mt-12 text-center text-lg font-bold text-gray-400">
          {#if data.item}
            nobody has a {data.item.name}
          {:else}
            no data
          {/if}
        </h2>
      {:else}
        <BigLeaderboard data={value} suffix={data.suffix} />
      {/if}
    </div> -->
  {/await}
{:else}
  <h2
    class="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 transform px-5 text-center text-xl font-bold text-white"
  >
    invalid item, please select one from the <a
      href="/leaderboard#items"
      class="text-sky-300 underline">list</a
    >
  </h2>
{/if}
