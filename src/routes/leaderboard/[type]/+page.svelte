<script lang="ts">
  import { page } from "$app/stores";
  import Loading from "$lib/components/Loading.svelte";
  import BigLeaderboard from "$lib/components/leaderboards/Leaderboard.svelte";
  import { fade } from "svelte/transition";

  export let data;
</script>

<svelte:head>
  <title>{$page.params.type} leaderboard | nypsi</title>

  <meta name="description" content="leaderboard for {$page.params.type}">

  <meta name="og:title" content="{$page.params.type} leaderboard | nypsi" />
  <meta name="og:site_name" content="nypsi" />
  {#if data.item}
    <meta name="og:image" content={data.item.emoji} />
    <meta property="og:image:width" content="128" />
    <meta property="og:image:height" content="128" />
  {/if}
</svelte:head>

{#if data.title}
  <header class="mt-5 text-center sm:w-full">
    <h1 class="text-4xl font-bold text-white sm:text-5xl">
      {data.title}
    </h1>
    <div class="m-auto mt-3 h-1 w-3/4 rounded-full bg-accent sm:w-1/2" />
  </header>
  <div class="mt-10 px-5 sm:px-24">
    {#await data.streamed.data}
      <div class="relative mt-16 flex w-full justify-center">
        <Loading
          fadeInSettings={{ delay: 75, duration: 100 }}
          fadeOutSettings={{ duration: 200 }}
        />
      </div>
    {:then value}
      {#if value.length === 0}
        <h2
          class="m-auto mt-12 text-center text-lg font-bold text-gray-400"
          in:fade|global={{ delay: 150, duration: 250 }}
        >
          {#if data.item}
            nobody has a {data.item.name}
          {:else}
            no data
          {/if}
        </h2>
      {:else}
        <BigLeaderboard data={value} suffix={data.suffix} />
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
