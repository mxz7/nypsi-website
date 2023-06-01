<script lang="ts">
  import ItemList from "$lib/components/ItemList.svelte";
  import LeaderboardButton from "$lib/components/LeaderboardButton.svelte";
  import LoadingIcon from "$lib/components/LoadingIcon.svelte";
  import MiniLeaderboard from "$lib/components/MiniLeaderboard.svelte";
  import getBalances from "$lib/functions/getBalances";
  import { getCommandsData } from "$lib/functions/getCommandsData";
  import getPrestiges from "$lib/functions/getPrestiges";
  import sleep from "$lib/functions/sleep";
  import type { LeaderboardData } from "$lib/types/LeaderboardData";
  import { onMount } from "svelte";

  let balance: LeaderboardData | undefined;
  let prestige: LeaderboardData | undefined;
  let activeUsers: LeaderboardData | undefined;

  onMount(async () => {
    let attempts = 0;

    while (!balance) {
      attempts++;
      balance = (await getBalances(fetch)) || undefined;

      await sleep(500);

      if (attempts > 5) break;
    }

    attempts = 0;

    while (!prestige) {
      attempts++;
      prestige = (await getPrestiges(fetch)) || undefined;

      await sleep(500);

      if (attempts > 5) break;
    }

    (document.querySelector("#loadingpage") as HTMLElement).style.opacity = "0%";

    setTimeout(() => {
      (document.querySelector("#loadingpage") as HTMLElement).style.display = "none";
    }, 750);

    attempts = 0;

    while (!activeUsers) {
      attempts++;
      activeUsers = ((await getCommandsData(fetch))?.users as LeaderboardData) || undefined;

      await sleep(500);

      if (attempts > 5) break;
    }
  });
</script>

<svelte:head>
  <title>nypsi item leaderboard</title>
  <meta name="description" content="leaderboards for the nypsi discord bot" />
</svelte:head>

<LoadingIcon />

<header class="text-center mt-5">
  <h1 class="text-white text-5xl font-bold">leaderboards</h1>
  <div class="w-3/4 sm:w-96 h-1 bg-red-500 rounded-full mt-3 m-auto" />
</header>

<div class="flex flex-row mt-10 overflow-x-auto text-white sm:p-3 overflow-y-hidden">
  {#if balance}
    <MiniLeaderboard data={balance} title="top balance" />
  {/if}
  {#if prestige}
    <MiniLeaderboard data={prestige} title="top prestige" />
  {/if}
  {#if activeUsers}
    <MiniLeaderboard data={activeUsers} title="daily active users" />
  {/if}
</div>

<ItemList />

<div class="mt-7 mb-7">
  <h2 class="text-2xl text-center text-white font-bold">other</h2>
  <div class="w-3/4 sm:w-96 h-1 bg-red-500 rounded-full mt-3 m-auto" />

  <div class="mt-4 flex flex-row flex-wrap justify-center">
    <LeaderboardButton text="balance" key="balance" />
    <LeaderboardButton text="prestige" key="prestige" />
    <LeaderboardButton text="daily streak" key="streak" />
    <LeaderboardButton text="active users" key="aciveusers" />
  </div>
</div>
