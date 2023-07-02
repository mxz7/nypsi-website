<script lang="ts">
  import { Chart as ChartJs, registerables } from "chart.js";

  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  export let data;

  ChartJs.register(...registerables);

  let chartCanvas: HTMLCanvasElement;

  onMount(async () => {
    setTimeout(async () => {
      const chartData = await Promise.resolve(data.streamed.graphData);

      const chart = new ChartJs(chartCanvas, {
        ...chartData,
        options: {
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
        },
      });
    }, 100);
  });
</script>

<svelte:head>
  <title>{data.item.name} leaderboard</title>
  <meta
    name="description"
    content="showing auction/offers average and total item count for {data.item.name}"
  />

  <meta name="og:title" content="{data.item.name} leaderboard" />
  <meta
    name="og:description"
    content="showing auction/offers average and total item count for {data.item.name}"
  />
  <meta name="og:site_name" content="nypsi" />
  {#if data.item}
    <meta name="og:image" content={data.item.emoji} />
    <meta property="og:image:width" content="128" />
    <meta property="og:image:height" content="128" />
  {/if}
</svelte:head>

<header class="mb-10 mt-5 text-center sm:mb-3 sm:w-full">
  <h1 class="text-4xl font-bold text-white sm:text-5xl">
    {data.item.name} history
  </h1>
  <div class="m-auto mt-3 h-1 w-3/4 rounded-full bg-red-500 sm:w-1/2" />
</header>

{#await data.streamed.graphData}
  <div class="absolute left-1/2 top-1/4 mb-[100vh] -translate-x-1/2 -translate-y-1/2 transform">
    <div out:fade={{ duration: 300 }} class="flex items-center justify-center">
      <svg
        class="-ml-1 mr-3 h-10 w-10 animate-spin text-red-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  </div>
{:then}
  <div class="flex justify-center">
    <div class=" w-[1100px] overflow-x-scroll p-4">
      <div class="h-full w-fit px-4 sm:w-full">
        <canvas
          in:fade={{ delay: 300, duration: 250 }}
          style="width: {/Android|iPhone/i.test(navigator.userAgent) ? '150vw' : '100%'};"
          bind:this={chartCanvas}
        />
      </div>
    </div>
  </div>

  <!-- <ItemList url="/item/history" /> -->
{/await}
