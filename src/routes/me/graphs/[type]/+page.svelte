<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Chart from "$lib/components/Chart.svelte";
  import type { ChartOptions } from "chart.js";

  const moneyChartOptions: ChartOptions = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        intersect: false,
        mode: "index",
        callbacks: {
          label(tooltipItem) {
            return `$${tooltipItem.formattedValue}`;
          },
        },
      },
    },
    maintainAspectRatio: false,
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
      },
      y1: {
        grid: {
          display: false,
        },
        position: "left",
        min: 0,
        ticks: {
          callback(tickValue) {
            return `$${Math.floor(Number(tickValue)).toLocaleString()}`;
          },
        },
      },
    },
  };

  const karmaChartOptions: ChartOptions = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        intersect: false,
        mode: "index",
        callbacks: {
          label(tooltipItem) {
            return tooltipItem.formattedValue;
          },
        },
      },
    },
    maintainAspectRatio: false,
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
      },
      y1: {
        grid: {
          display: false,
        },
        position: "left",
        min: 0,
        ticks: {
          callback(tickValue) {
            return Math.floor(Number(tickValue)).toLocaleString();
          },
        },
      },
    },
  };

  const dayOptions = ["14", "30", "60", "90", "180"];

  let { data } = $props();

  let days = $state($page.url.searchParams.get("days") || "30");

  $effect(() => {
    const params = new URLSearchParams($page.url.searchParams.toString());
    if (days === "30" && !params.has("days")) return;

    params.set("days", days);
    goto(`?${params.toString()}`);
  });
</script>

<svelte:head>
  <title>{$page.params.type} graph / nypsi</title>
</svelte:head>

<div class="mt-4 flex w-full justify-center">
  <select class="select select-bordered w-full max-w-xs" bind:value={days}>
    {#each dayOptions as dayOption}
      {#if days === dayOption}
        <option value={dayOption} selected>{dayOption} days</option>
      {:else}
        <option value={dayOption}>{dayOption} days</option>
      {/if}
    {/each}
  </select>
</div>

{#key data}
  <div class="h-[500px]">
    {#if data.options === "money"}
      <Chart chartData={data.chartData} chartOptions={moneyChartOptions} />
    {:else if data.options === "karma"}
      <Chart chartData={data.chartData} chartOptions={karmaChartOptions} />
    {/if}
  </div>
{/key}
