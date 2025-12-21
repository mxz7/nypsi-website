<script lang="ts">
  import { page } from "$app/state";
  import Chart from "$lib/components/Chart.svelte";
  import Card from "$lib/components/ui/Card.svelte";
  import Main from "$lib/components/ui/Main.svelte";
  import {
    itemPriceChartOptions,
    worldItemCountChartOptions,
  } from "$lib/functions/chart/chart-options.js";

  let { data } = $props();
  const days = $derived(page.url.searchParams.get("days") || "60");

  const priceChartData = $derived.by(() => {
    if (typeof data.chartData === "string") return null;
    return data.chartData.priceData;
  });

  const itemCountChartData = $derived.by(() => {
    if (typeof data.chartData === "string") return null;
    return data.chartData.itemCountData;
  });
</script>

<svelte:head>
  <title>{data.item?.name} history | nypsi</title>
</svelte:head>

<Main class="mt-4 space-y-4">
  <header class="flex justify-center gap-3">
    <div class="rounded-box bg-base-300 h-14 w-14 p-2">
      <img
        class="h-full w-full object-contain"
        src={data.item.emoji}
        alt=""
        decoding="sync"
        loading="eager"
      />
    </div>

    <h1 class="my-auto text-3xl font-bold text-white">{data.item.name} history</h1>
  </header>

  {#key data.chartData}
    <menu class="menu menu-horizontal rounded-box bg-base-200 mx-auto flex justify-center gap-2">
      {#each [14, 30, 60, 90, 69420] as option}
        {@const focused = days === option.toString()}
        <li>
          <a href="?days={option}" class={focused ? "menu-active" : ""}
            >{#if option === 69420}
              all time
            {:else}
              {option} days
            {/if}</a
          >
        </li>
      {/each}
    </menu>

    {#if data.chartData === "invalid item"}
      <div class="text-error mb-48 flex justify-center text-2xl font-semibold">
        <p>invalid item</p>
      </div>
    {:else if data.chartData === "not enough data"}
      <div class="text-error mb-48 flex justify-center text-2xl font-semibold">
        <p>not enough data</p>
      </div>
    {:else if typeof data.chartData !== "string"}
      <Card class="mx-auto max-w-6xl" mode="section">
        <h2>price history</h2>
        <div class="h-80 w-full">
          <Chart chartData={priceChartData} chartOptions={itemPriceChartOptions} />
        </div>
      </Card>

      <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
        <Card class="max-w-6xl" mode="section">
          <h2>items in world</h2>
          <div class="h-80 w-full">
            <Chart chartData={itemCountChartData} chartOptions={worldItemCountChartOptions} />
          </div>
        </Card>

        <Card class="max-w-6xl" mode="section">
          <h2>items in world</h2>
          <div class="h-80 w-full">
            <Chart chartData={itemCountChartData} chartOptions={worldItemCountChartOptions} />
          </div>
        </Card>
      </div>
    {/if}
  {/key}
</Main>

<style>
  @reference "../../../../app.css";

  h2 {
    @apply mb-4 text-xl font-bold;
  }
</style>
