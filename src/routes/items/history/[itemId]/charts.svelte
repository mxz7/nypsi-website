<script lang="ts">
  import { getItemChartData } from "$lib/api/items-history.remote";
  import Chart from "$lib/components/Chart.svelte";
  import Card from "$lib/components/ui/Card.svelte";
  import {
    itemPriceChartOptions,
    worldItemCountChartOptions,
  } from "$lib/functions/chart/chart-options";

  interface Props {
    days: number;
    itemId: string;
  }

  let { days, itemId }: Props = $props();

  const { chartData, item } = $derived(await getItemChartData({ itemId, days }));
</script>

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

<style>
  @reference "../../../../app.css";

  h2 {
    @apply mb-4 text-xl font-bold;
  }
</style>
