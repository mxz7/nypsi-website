<script lang="ts">
  import BigLeaderboard from "$lib/components/BigLeaderboard.svelte";
  import SkeletonLeaderboard from "$lib/components/SkeletonLeaderboard.svelte";
  import { fly } from "svelte/transition";

  export let data;
</script>

<svelte:head>
  <title>nypsi leaderboard</title>
  <meta name="description" content="leaderboards for the nypsi discord bot" />
</svelte:head>

{#if data.title}
  <header class="mt-5 text-center sm:w-full">
    <h1 class="text-4xl font-bold text-white sm:text-5xl">
      {data.title}
    </h1>
    <div class="m-auto mt-3 h-1 w-3/4 rounded-full bg-red-500 sm:w-1/2" />
  </header>
  <div class="mt-10 px-5 sm:px-24">
    {#await data.streamed.data}
      <div out:fly={{ y: 5, duration: 300 }}>
        <SkeletonLeaderboard />
      </div>
    {:then value}
      {#if value.length === 0}
        <h2 class="m-auto mt-12 text-center text-lg font-bold text-gray-400">
          {#if data.item}
            nobody has a {data.item.name}
          {:else}
            no data
          {/if}
        </h2>
      {:else}
        <div in:fly={{ y: 60, duration: 1000 }}>
          <BigLeaderboard data={value} suffix={data.suffix} />
        </div>
      {/if}
    {:catch error}
      <p class="text-center text-xl text-red-600">error: {error}</p>
    {/await}
  </div>
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
