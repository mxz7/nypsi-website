<script lang="ts">
  import { page } from "$app/stores";
  import BigLeaderboard from "$lib/components/leaderboards/Leaderboard.svelte";
  import { getTags } from "$lib/stores.js";
  import { fade } from "svelte/transition";

  let { data } = $props();
</script>

<svelte:head>
  <meta name="robots" content="noindex" />
  <title>{data.item?.name || $page.params.type} leaderboard / nypsi</title>

  <meta
    property="description"
    name="description"
    content="leaderboard for {data.item?.name || $page.params.type}. {data.data
      ? data.data
          .slice(0, 3)
          .map((value, index) => `#${['🥇', '🥈', '🥉'][index] || index}: ${value.user.username}. `)
      : ''}"
  />
  <meta
    property="og:description"
    name="og:description"
    content="leaderboard for {data.item?.name || $page.params.type}. {data.data
      ? data.data
          .slice(0, 3)
          .map((value, index) => `#${['🥇', '🥈', '🥉'][index] || index}: ${value.user.username}. `)
      : ''}"
  />

  <meta name="og:title" content="{data.item?.name} leaderboard" />
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
    <div class="m-auto mt-3 h-1 w-9/12 rounded-full bg-primary sm:w-full sm:max-w-2xl"></div>
  </header>
  <div class="mt-10 px-5 sm:px-24">
    {#if data.data.length === 0}
      <h2
        class="m-auto mt-12 text-center text-lg font-bold text-slate-400"
        in:fade|global={{ delay: 150, duration: 250 }}
      >
        {#if data.item}
          nobody has a {data.item.name}
        {:else}
          no data
        {/if}
      </h2>
    {:else}
      <BigLeaderboard data={data.data} suffix={data.suffix} tags={getTags()} />
    {/if}
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
