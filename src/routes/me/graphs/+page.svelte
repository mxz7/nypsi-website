<script lang="ts">
  import { page } from "$app/stores";
  import Chart from "$lib/components/Chart.svelte";
  import Loading from "$lib/components/Loading.svelte";
  import type { ChartOptions } from "chart.js";

  export let data;

  const moneyChartOptions: ChartOptions = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
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
        tension: 0.4,
      },
      point: {
        radius: /Android|iPhone/i.test(navigator.userAgent) ? 2 : 5,
      },
    },
    scales: {
      y1: {
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
        tension: 0.4,
      },
      point: {
        radius: /Android|iPhone/i.test(navigator.userAgent) ? 2 : 5,
      },
    },
    scales: {
      y1: {
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
</script>

<div class="flex w-full justify-center">
  <div class="flex w-full flex-col gap-8 sm:w-[60vw]">
    {#if $page.url.searchParams.get("item")}{:else}
      <div class="flex w-full flex-col gap-4 px-4">
        <div>
          <h1 class="text-center text-xl font-semibold text-white">balance</h1>
          <div class="m-auto mt-1 h-1 w-3/4 rounded-full bg-accent sm:w-1/2" />
        </div>

        <div class="h-[30vh] w-full sm:h-[45vh]">
          {#await data.streamed.balance}
            <div class="relative h-full w-full">
              <Loading />
            </div>
          {:then chartData}
            {#if typeof chartData === "string"}
              <h2 class="text-center font-semibold text-white">not enough data</h2>
            {:else}
              <Chart {chartData} chartOptions={moneyChartOptions} />
            {/if}
          {/await}
        </div>
      </div>

      <div class="flex w-full flex-col gap-4 px-4">
        <div>
          <h1 class="text-center text-xl font-semibold text-white">net worth</h1>
          <div class="m-auto mt-1 h-1 w-3/4 rounded-full bg-accent sm:w-1/2" />
        </div>

        <div class="h-[30vh] w-full sm:h-[45vh]">
          {#await data.streamed.networth}
            <div class="relative h-full w-full">
              <Loading />
            </div>
          {:then chartData}
            {#if typeof chartData === "string"}
              <h2 class="text-center font-semibold text-white">not enough data</h2>
            {:else}
              <Chart {chartData} chartOptions={moneyChartOptions} />
            {/if}
          {/await}
        </div>
      </div>

      <div class="flex w-full flex-col gap-4 px-4">
        <div>
          <h1 class="text-center text-xl font-semibold text-white">karma</h1>
          <div class="m-auto mt-1 h-1 w-3/4 rounded-full bg-accent sm:w-1/2" />
        </div>

        <div class="h-[30vh] w-full sm:h-[45vh]">
          {#await data.streamed.karma}
            <div class="relative h-full w-full">
              <Loading />
            </div>
          {:then chartData}
            {#if typeof chartData === "string"}
              <h2 class="text-center font-semibold text-white">not enough data</h2>
            {:else}
              <Chart {chartData} chartOptions={karmaChartOptions} />
            {/if}
          {/await}
        </div>
      </div>
    {/if}
  </div>
</div>
