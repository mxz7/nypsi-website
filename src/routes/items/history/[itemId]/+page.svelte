<script lang="ts">
  import { page } from "$app/state";
  import { getItemChartData } from "$lib/api/items-history.remote";
  import Chart from "$lib/components/Chart.svelte";
  import Card from "$lib/components/ui/Card.svelte";
  import Main from "$lib/components/ui/Main.svelte";
  import {
    itemPriceChartOptions,
    worldItemCountChartOptions,
  } from "$lib/functions/chart/chart-options.js";

  const days = $derived(parseInt(page.url.searchParams.get("days") || "60"));

  const { chartData, item } = $derived(
    await getItemChartData({ itemId: page.params.itemId, days }),
  );
</script>

<svelte:head>
  <title>{item.name} history | nypsi</title>
</svelte:head>

<Main class="mt-4 space-y-4">
  <header class="flex justify-center gap-3">
    <div class="rounded-box bg-base-300 h-14 w-14 p-2">
      <img
        class="h-full w-full object-contain"
        src={item.emoji}
        alt=""
        decoding="sync"
        loading="eager"
      />
    </div>

    <h1 class="my-auto text-3xl font-bold text-white">{item.name} history</h1>
  </header>

  {#key days}
    <menu class="menu menu-horizontal rounded-box bg-base-200 mx-auto flex justify-center gap-2">
      {#each [14, 30, 60, 90, 69420] as option}
        {@const focused = days === option}
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

    {#if typeof chartData === "string"}
      <div class="text-error mb-48 flex justify-center text-2xl font-semibold">
        <p>{chartData}</p>
      </div>
    {:else}
      <Card class="mx-auto max-w-6xl" mode="section">
        <h2>price history</h2>
        <div class="h-80 w-full">
          <Chart chartData={chartData.priceData} chartOptions={itemPriceChartOptions} />
        </div>
      </Card>

      <Card class="max-w-6xl" mode="section">
        <h2>items in world</h2>
        <div class="h-80 w-full">
          <Chart chartData={chartData.itemCountData} chartOptions={worldItemCountChartOptions} />
        </div>
      </Card>
    {/if}
  {/key}
</Main>

<style>
  @reference "../../../../app.css";

  h2 {
    @apply mb-4 text-xl font-bold;
  }
</style>
