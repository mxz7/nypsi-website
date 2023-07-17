<script lang="ts">
  import { Chart, registerables, type ChartConfiguration, type ChartOptions } from "chart.js";
  import { onMount } from "svelte";

  let chartCanvas: HTMLCanvasElement;

  export let chartData: ChartConfiguration;
  export let chartOptions: ChartOptions = {};

  Chart.register(...registerables);

  onMount(() => {
    new Chart(chartCanvas, {
      ...chartData,
      options: chartOptions,
    });
  });
</script>

<div class="flex justify-center">
  <div class=" w-[1100px] overflow-x-scroll p-4">
    <div class="h-full w-fit px-4 sm:w-full">
      <canvas
        style="width: {(/Android|iPhone/i.test(navigator.userAgent) ? '150vw' : '100%') || '100%'};"
        bind:this={chartCanvas}
      />
    </div>
  </div>
</div>
