<script lang="ts">
  import ItemList from "$lib/components/ItemList.svelte";
  import LeaderboardButton from "$lib/components/LeaderboardButton.svelte";

  // let balance: LeaderboardData | undefined;
  // let prestige: LeaderboardData | undefined;
  // let streaks: LeaderboardData | undefined;

  // onMount(async () => {
  //   let attempts = 0;

  //   while (!balance) {
  //     attempts++;
  //     balance = (await getBalances(fetch)) || undefined;

  //     await sleep(500);

  //     if (attempts > 5) break;
  //   }

  //   attempts = 0;

  //   while (!prestige) {
  //     attempts++;
  //     prestige = (await getPrestiges(fetch)) || undefined;

  //     await sleep(500);

  //     if (attempts > 5) break;
  //   }

  //   attempts = 0;

  //   while (!streaks) {
  //     attempts++;
  //     streaks = ((await getStreaks(fetch)) as LeaderboardData) || undefined;

  //     await sleep(500);

  //     if (attempts > 5) break;
  //   }

  //   (document.querySelector("#loadingpage") as HTMLElement).style.opacity = "0%";

  //   setTimeout(() => {
  //     (document.querySelector("#loadingpage") as HTMLElement).style.display = "none";
  //   }, 750);
  // });
</script>

<svelte:head>
  <title>leaderboards | nypsi</title>
</svelte:head>

<!-- <LoadingIcon /> -->

<header class="mt-5 text-center">
  <h1 class="text-4xl font-bold text-white sm:text-5xl">leaderboards</h1>
  <div class="m-auto mt-3 h-1 w-3/4 rounded-full bg-accent sm:w-96" />
</header>

<!-- <div class="flex flex-row mt-10 overflow-x-auto text-white sm:p-3 overflow-y-hidden">
  {#if balance}
    <MiniLeaderboard data={balance} title="top balance" />
  {/if}
  {#if prestige}
    <MiniLeaderboard data={prestige} title="top prestige" />
  {/if}
  {#if streaks}
    <MiniLeaderboard data={streaks} title="top daily streak" />
  {/if}
</div> -->

<div class="mb-7 mt-7">
  <!-- <h2 class="text-2xl sm:text-4xl text-center text-white font-bold">other</h2>
  <div class="w-3/4 sm:w-96 h-1 bg-red-500 rounded-full mt-3 m-auto" /> -->

  <div class="mt-4 flex flex-row flex-wrap justify-center px-2">
    <LeaderboardButton text="balance" key="balance" />
    <LeaderboardButton text="net worth" key="networth" />
    <LeaderboardButton text="prestige" key="prestige" />
    <LeaderboardButton text="daily streak" key="streak" />
    <LeaderboardButton text="wordle wins" key="wordle" />
  </div>
</div>

<ItemList url="/leaderboard" />
