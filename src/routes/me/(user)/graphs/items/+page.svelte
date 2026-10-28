<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { getItemsRemote } from "#lib/api/items.remote.js";
  import Chart from "#lib/components/chart.svelte";
  import ItemSearch from "#lib/components/items/item-search.svelte";
  import type { ChartOptions } from "#lib/types/chart.js";

  const itemChartOptions: ChartOptions = {
    legend: true,
    valueFormat: (value) => Math.floor(value).toLocaleString(),
    tooltipFormat: (value) => value.toLocaleString(),
  };

  const dayOptions = ["14", "30", "60", "90"];

  let { data } = $props();

  let days = $state(page.url.searchParams.get("days") || "30");
  const items = await getItemsRemote();
</script>

<svelte:head>
  <title>items graph | nypsi</title>
</svelte:head>

<div class="mt-4 flex w-full justify-center">
  <select class="select select-bordered w-full max-w-xs" bind:value={days}>
    {#each dayOptions as dayOption (dayOption)}
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
    <div class="w-full px-4 lg:max-w-xs lg:px-0">
      <ItemSearch
        {items}
        onClick={(eventItemId: string) => {
          const params = new URLSearchParams(page.url.searchParams.toString());
          params.set("days", days);

          params.set("item", eventItemId);
          goto(`?${params.toString()}`);
        }}
      />
    </div>
  </div>
{/if}

{#key data}
  {#if data.chartData}
    {#if typeof data.chartData === "string"}
      <p>not enough data</p>
    {:else}
      <div class="h-[500px]">
        <Chart chartData={data.chartData} chartOptions={itemChartOptions} />
      </div>
    {/if}
  {/if}
{/key}
