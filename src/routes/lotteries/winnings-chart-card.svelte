<script lang="ts">
  import type { LotteryChartRange } from "$lib/api/lottery.remote";
  import Chart from "$lib/components/Chart.svelte";
  import Card from "$lib/components/ui/Card.svelte";
  import { formatNumberPretty } from "$lib/functions/string";
  import { Gem } from "@lucide/svelte";
  import type { ChartConfiguration, ChartOptions } from "chart.js";

  interface Props {
    range: LotteryChartRange;
    chartData: ChartConfiguration;
  }

  let { range, chartData }: Props = $props();

  const lotteryChartOptions: ChartOptions = {
    plugins: {
      tooltip: {
        intersect: false,
        mode: "index",
        callbacks: {
          label(tooltipItem) {
            return `${tooltipItem.dataset.label}: $${formatNumberPretty(Number(tooltipItem.raw))}`;
          },
        },
      },
    },
    maintainAspectRatio: false,
    responsive: true,
    elements: {
      line: {
        tension: 0.15,
      },
      point: {
        radius: 0,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 7,
        },
      },
      y: {
        grid: {
          display: false,
        },
        min: 0,
        ticks: {
          callback(tickValue) {
            return `$${formatNumberPretty(Number(tickValue))}`;
          },
        },
      },
    },
  };

  const rangeOptions = [
    { value: "30d", label: "30d" },
    { value: "90d", label: "90d" },
    { value: "1y", label: "1 year" },
    { value: "all", label: "all time" },
  ] as const;
</script>

<Card mode="section" class="mx-auto w-full max-w-6xl">
  <h2 class="mb-4 flex items-center gap-2 text-xl font-bold">
    <span class="rounded-box bg-base-300 p-2">
      <Gem class="text-primary" />
    </span>
    <span>winnings over time</span>
  </h2>

  <menu class="menu menu-horizontal rounded-box bg-base-200 mx-auto mb-4 flex justify-center gap-2">
    {#each rangeOptions as option}
      {@const focused = range === option.value}
      <li>
        <a
          href="?range={option.value}&page=1"
          class={focused ? "menu-active" : ""}
          data-sveltekit-noscroll>{option.label}</a
        >
      </li>
    {/each}
  </menu>

  {#if chartData.data?.labels && chartData.data.labels.length > 0}
    <div class="h-96 w-full">
      <Chart {chartData} chartOptions={lotteryChartOptions} />
    </div>
  {:else}
    <p class="text-base-content/70 py-10 text-center text-sm">not enough lottery data yet</p>
  {/if}
</Card>
