<script lang="ts">
  import ItemList from "$lib/components/ItemList.svelte";
  import LeaderboardButton from "$lib/components/LeaderboardButton.svelte";

  export let data;
</script>

<svelte:head>
  <title>leaderboards / nypsi</title>
</svelte:head>

<header class="mt-5 text-center">
  <h1 class="text-4xl font-bold text-white sm:text-5xl">leaderboards</h1>
  <div class="m-auto mt-3 h-1 w-3/4 rounded-full bg-accent sm:w-96" />
</header>

<div class="mb-7 mt-7">
  <!-- <h2 class="text-2xl sm:text-4xl text-center text-white font-bold">other</h2>
  <div class="w-3/4 sm:w-96 h-1 bg-red-500 rounded-full mt-3 m-auto" /> -->

  <div class="mt-4 flex flex-row flex-wrap justify-center px-2">
    <LeaderboardButton text="balance" key="balance" />
    <LeaderboardButton text="net worth" key="networth" />
    <LeaderboardButton text="prestige" key="prestige" />
    <LeaderboardButton text="daily streak" key="streak" />
    <LeaderboardButton text="wordle" key="wordle" />
    <LeaderboardButton text="lottery" key="lottery" />
  </div>
</div>

<ItemList url="/leaderboard" items={data.items} />
