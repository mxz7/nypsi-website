<script lang="ts">
  import ItemList from "$lib/components/ItemList.svelte";
  import LoadingIcon from "$lib/components/LoadingIcon.svelte";
  import MiniLeaderboard from "$lib/components/MiniLeaderboard.svelte";
  import getBalances from "$lib/functions/getBalances";
  import { getCommandsData } from "$lib/functions/getCommandsData";
  import getPrestiges from "$lib/functions/getPrestiges";
  import sleep from "$lib/functions/sleep";
  import type { LeaderboardData } from "$lib/types/LeaderboardData";
  import { onMount } from "svelte";

  $: loading = true;

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

    attempts = 0;

    while (!activeUsers) {
      attempts++;
      activeUsers = ((await getCommandsData(fetch))?.users as LeaderboardData) || undefined;

      await sleep(500);

      if (attempts > 5) break;
    }

    loading = false;
  });
</script>

<svelte:head>
  <title>nypsi item leaderboard</title>
  <meta name="description" content="leaderboards for the nypsi discord bot" />
</svelte:head>

{#if loading}
  <LoadingIcon />
{:else}
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
{/if}
