<script lang="ts">
  import Chart from "$lib/components/Chart.svelte";
  import ItemList from "$lib/components/ItemList.svelte";
  import Loading from "$lib/components/Loading.svelte";
  import type { ChartOptions } from "chart.js";

  import { fade } from "svelte/transition";

  export let data;

  const chartOptions: ChartOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label(tooltipItem) {
            if (tooltipItem.dataset.label.includes("items in world"))
              return `in world: ${tooltipItem.formattedValue}`;
            else if (
              tooltipItem.dataset.label === (data.user.authenticated ? data.user.username : "null")
            )
              return `${data.user.authenticated ? data.user.username : "null"}: ${
                tooltipItem.formattedValue
              }`;

            return `${tooltipItem.dataset.label} average: $${tooltipItem.formattedValue}`;
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
      y2: {
        position: "right",
        ticks: {
          callback(tickValue) {
            return Math.floor(Number(tickValue)).toLocaleString();
          },
        },
      },
      y1: {
        position: "left",
        ticks: {
          callback(tickValue) {
            return `$${Math.floor(Number(tickValue)).toLocaleString()}`;
          },
        },
      },
    },
  };
</script>

<svelte:head>
  <title>{data.item?.name} history</title>
  <meta
    name="description"
    content="showing auction/offers average and total item count for {data.item?.name}"
  />

  <meta name="og:title" content="{data.item?.name} history" />
  <meta
    name="og:description"
    content="showing auction/offers average and total item count for {data.item?.name}"
  />
  <meta name="og:site_name" content="nypsi" />
  {#if data.item}
    <meta name="og:image" content={data.item?.emoji} />
    <meta property="og:image:width" content="128" />
    <meta property="og:image:height" content="128" />
  {/if}
</svelte:head>

<header class="mb-10 mt-5 text-center sm:mb-3 sm:w-full">
  <h1 class="text-4xl font-bold text-white sm:text-5xl">
    {data.item?.name} history
  </h1>
  <div class="m-auto mt-3 h-1 w-3/4 rounded-full bg-accent sm:w-1/2" />
</header>

{#await data.streamed.graphData}
  <div class="relative mt-16 flex w-full justify-center">
    <Loading fadeInSettings={{ delay: 50, duration: 50 }} fadeOutSettings={{ duration: 150 }} />
  </div>
{:then graphData}
  <div in:fade={{ delay: 150, duration: 300 }}>
    {#if graphData === "invalid item"}
      <div class="mb-48 flex justify-center text-2xl font-semibold text-red-400">
        <h1>invalid item</h1>
      </div>
    {:else if graphData === "not enough data"}
      <div class="mb-48 flex justify-center text-2xl font-semibold text-red-400">
        <h1>not enough data</h1>
      </div>
    {:else if typeof graphData !== "string"}
      <Chart chartData={graphData} {chartOptions} />
    {/if}
  </div>

  <ItemList url="/item/history" />
{/await}
