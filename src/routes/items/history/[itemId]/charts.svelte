<script lang="ts">
  import { getItemChartData } from "$lib/api/items-history.remote";
  import Chart from "$lib/components/Chart.svelte";
  import Card from "$lib/components/ui/Card.svelte";
  import {
    itemPriceChartOptions,
    worldItemCountChartOptions,
  } from "$lib/functions/chart/chart-options";
  import { DollarSign, Earth } from "@lucide/svelte";

  interface Props {
    days: number;
    itemId: string;
  }

  let { days, itemId }: Props = $props();

  const chartData = $derived(await getItemChartData({ itemId, days }));
</script>

{#if typeof chartData === "string"}
  <div class="text-error mb-48 flex justify-center text-2xl font-semibold">
    <p>{chartData}</p>
  </div>
{:else}
  <Card class="mx-auto max-w-6xl" mode="section">
    <h2>
      <span class="icon">
        <DollarSign class="text-primary" />
      </span>
      <span>price history</span>
    </h2>
    <div class="h-80 w-full">
      <Chart chartData={chartData.priceData} chartOptions={itemPriceChartOptions} />
    </div>
  </Card>

  <Card class="max-w-6xl" mode="section">
    <h2>
      <span class="icon">
        <Earth class="text-primary" />
      </span>
      <span>items in world</span>
    </h2>
    <div class="h-80 w-full">
      <Chart chartData={chartData.itemCountData} chartOptions={worldItemCountChartOptions} />
    </div>
  </Card>
{/if}
