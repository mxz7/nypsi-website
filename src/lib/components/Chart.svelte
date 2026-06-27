<script lang="ts">
  import {
    Chart as ChartJS,
    registerables,
    type ChartConfiguration,
    type ChartOptions,
  } from "chart.js";
  import { onDestroy, onMount } from "svelte";

  let chartCanvas: HTMLCanvasElement = $state();
  let chartInstance: ChartJS | null = $state(null);

  interface Props {
    chartData: ChartConfiguration;
    chartOptions?: ChartOptions;
  }

  let { chartData, chartOptions = {} }: Props = $props();

  ChartJS.register(...registerables);

  onMount(() => {
    chartInstance = new ChartJS(chartCanvas, {
      ...chartData,
      options: chartOptions,
    });
  });

  $effect(() => {
    if (!chartInstance) return;

    chartInstance.data = chartData.data;
    chartInstance.options = chartOptions;
    chartInstance.update();
  });

  onDestroy(() => {
    chartInstance?.destroy();
    chartInstance = null;
  });
</script>

<canvas class="h-full w-full" style="width: 100%;" bind:this={chartCanvas}></canvas>
