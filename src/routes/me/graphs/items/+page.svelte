<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import Chart from "$lib/components/Chart.svelte";
  import ItemSearch from "$lib/components/items/ItemSearch.svelte";
  import getItems from "$lib/functions/items.js";
  import type { Item } from "$lib/types/Item.js";
  import type { ChartOptions } from "chart.js";
  import { onMount } from "svelte";

  const itemChartOptions: ChartOptions = {
    plugins: {
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

  const dayOptions = ["14", "30", "60", "90"];

  let { data } = $props();

  let days = $state(page.url.searchParams.get("days") || "30");
  let itemId: string = $state();
  let items: Item[] = $state();

  $effect(() => {
    const params = new URLSearchParams(page.url.searchParams.toString());
    params.set("days", days);
    if (itemId) params.set("item", itemId);
    goto(`?${params.toString()}`);
  });

  onMount(async () => {
    items = await getItems(fetch);
  });
</script>

<svelte:head>
  <title>items graph / nypsi</title>
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

{#if items}
  <div class="mt-14 flex w-full justify-center">
    <div class="px-4 lg:max-w-3xl lg:px-0">
      <ItemSearch
        {items}
        onClick={async (eventItemId: string) => {
          itemId = eventItemId;
        }}
      />
    </div>
  </div>
{/if}

{#key data}
  {#if data.chartData}
    <div class="h-[500px]">
      <Chart chartData={data.chartData} chartOptions={itemChartOptions} />
    </div>
  {/if}
{/key}
