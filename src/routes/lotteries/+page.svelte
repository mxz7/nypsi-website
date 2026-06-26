<script lang="ts">
  import { page } from "$app/state";
  import {
    getLotteryHistory,
    getLotteryWinningsChart,
    type LotteryChartRange,
  } from "$lib/api/lottery.remote";
  import Main from "$lib/components/ui/Main.svelte";
  import { onDestroy, onMount } from "svelte";
  import CountdownCards from "./countdown-cards.svelte";
  import LotteryHistoryCard from "./lottery-history-card.svelte";
  import WinningsChartCard from "./winnings-chart-card.svelte";

  function isValidRange(value: string | null): value is LotteryChartRange {
    return value === "30d" || value === "90d" || value === "1y" || value === "all";
  }

  function getRangeParam(value: string | null): LotteryChartRange {
    return isValidRange(value) ? value : "30d";
  }

  function getPageParam(value: string | null): number {
    const parsed = Number.parseInt(value || "1");

    if (Number.isNaN(parsed)) return 1;

    return Math.max(1, parsed);
  }

  let now = $state(Date.now());
  let timer: ReturnType<typeof setInterval>;

  onMount(() => {
    timer = setInterval(() => {
      now = Date.now();
    }, 1000);
  });

  onDestroy(() => {
    clearInterval(timer);
  });

  const range = $derived(getRangeParam(page.url.searchParams.get("range")));
  const currentPage = $derived(getPageParam(page.url.searchParams.get("page")));

  const chartData = $derived(await getLotteryWinningsChart(range));
  const historyData = $derived(await getLotteryHistory(currentPage));
</script>

<svelte:head>
  <title>lotteries | nypsi</title>
  <meta name="og:title" content="lotteries | nypsi" />
</svelte:head>

<Main class="space-y-4 px-3 lg:px-0">
  <header class="text-center">
    <h1 class="text-4xl font-black text-white">lotteries</h1>
    <p class="text-base-content/70 mt-2 text-sm">
      track countdowns, winnings, and complete draw history
    </p>
  </header>

  <CountdownCards {now} />
  <WinningsChartCard {range} {chartData} />
  <LotteryHistoryCard {historyData} {currentPage} {range} />
</Main>
