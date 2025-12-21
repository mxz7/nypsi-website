<script lang="ts">
  import { Chart, registerables, type ChartConfiguration, type ChartOptions } from "chart.js";
  import { onMount } from "svelte";

  let chartCanvas: HTMLCanvasElement = $state();

  interface Props {
    chartData: ChartConfiguration;
    chartOptions?: ChartOptions;
  }

  let { chartData, chartOptions = {} }: Props = $props();

  Chart.register(...registerables);

  onMount(() => {
    new Chart(chartCanvas, {
      ...chartData,
      options: chartOptions,
    });
  });
</script>

<canvas class="h-full w-full" style="width: 100%;" bind:this={chartCanvas}></canvas>
