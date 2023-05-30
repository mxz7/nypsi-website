<script>
  import ItemList from "$lib/components/ItemList.svelte";
  import MiniLeaderboard from "../../lib/components/MiniLeaderboard.svelte";

  export let data;
</script>

<svelte:head>
  <title>nypsi item leaderboard</title>
  <meta name="description" content="leaderboards for the nypsi discord bot" />
</svelte:head>

<header class="text-center mt-5">
  <h1 class="text-white text-5xl font-bold">leaderboards</h1>
  <div class="w-3/4 sm:w-96 h-1 bg-red-500 rounded-full mt-3 m-auto" />
</header>

<div class="flex flex-row mt-10 overflow-x-auto text-white sm:p-3 overflow-y-hidden">
  {#if data.balance}
    <MiniLeaderboard data={data.balance} title="top balance" />
  {/if}
  {#if data.prestige}
    <MiniLeaderboard data={data.prestige} title="top prestige" />
  {/if}
  {#if data.commands}
    <MiniLeaderboard data={data.commands} title="daily active users" />
  {/if}
</div>

<ItemList items={data.items} />
