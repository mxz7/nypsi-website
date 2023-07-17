<script lang="ts">
  import Chart from "$lib/components/Chart.svelte";
  import Loading from "$lib/components/Loading.svelte";
  import type { ChartOptions } from "chart.js";
  import { fade } from "svelte/transition";

  export let data;

  const chartOptions: ChartOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label(tooltipItem) {
            if (data.category.includes("money") || data.category.includes("net"))
              return `$${tooltipItem.formattedValue}`;
            return Number(tooltipItem.formattedValue).toLocaleString();
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
        radius: /Android|iPhone/i.test(navigator.userAgent) ? 1 : 5,
      },
    },
    scales: {
      y1: {
        position: "left",
        min: 0,
        ticks: {
          callback(tickValue) {
            if (data.category.includes("money") || data.category.includes("net"))
              return `$${Math.floor(Number(tickValue)).toLocaleString()}`;
            return Number(tickValue).toLocaleString();
          },
        },
      },
    },
  };
</script>

<svelte:head>
  <title>{data.title || "nypsi"}</title>
</svelte:head>

{#await data.streamed.graphData}
  <div class="relative mt-16 flex w-full justify-center">
    <Loading fadeInSettings={{ delay: 50, duration: 50 }} fadeOutSettings={{ duration: 150 }} />
  </div>
{:then graphData}
  {#if graphData === "invalid user"}
    <div class="mb-48 flex justify-center text-xl font-bold text-gray-300">
      <h1>invalid user</h1>
    </div>
  {:else if graphData == "private profile"}
    <div class="mb-48 flex justify-center text-xl font-bold text-gray-300">
      <h1>user has a private profile</h1>
    </div>
  {:else}
    <header class="mb-10 mt-5 text-center sm:mb-3 sm:w-full">
      <h1 class="text-4xl font-bold text-white sm:text-5xl">{data.title}</h1>
      <div class="m-auto mt-3 h-1 w-3/4 rounded-full bg-accent sm:w-1/2" />
    </header>

    <div in:fade={{ delay: 150, duration: 300 }}>
      {#if graphData === "not enough data"}
        <div class="mb-48 flex justify-center text-2xl font-semibold text-red-400">
          <h1>not enough data</h1>
        </div>
      {:else if typeof graphData !== "string"}
        <Chart chartData={graphData} {chartOptions} />
      {/if}
    </div>
  {/if}
{/await}
