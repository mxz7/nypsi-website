<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Chart from "$lib/components/Chart.svelte";
  import ItemList from "$lib/components/ItemList.svelte";
  import type { ChartOptions } from "chart.js";

  import { fade } from "svelte/transition";

  export let data;
  let days = $page.url.searchParams.get("days") || "30";

  const chartOptions: ChartOptions = {
    plugins: {
      tooltip: {
        intersect: false,
        mode: "index",
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
    responsive: true,
    elements: {
      line: {
        tension: 0.3,
      },
      point: {
        radius: /Android|iPhone/i.test(navigator.userAgent) ? 2 : 3,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y2: {
        grid: {
          display: false,
        },
        min: 0,
        position: "right",
        ticks: {
          callback(tickValue) {
            return Math.floor(Number(tickValue)).toLocaleString();
          },
        },
      },
      y1: {
        grid: {
          display: false,
        },
        min: 0,
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
  <title>{data.item?.name} history / nypsi</title>
</svelte:head>

<header class="mb-10 mt-5 text-center sm:mb-3 sm:w-full">
  <h1 class="text-4xl font-bold text-white sm:text-5xl">
    {data.item?.name} history
  </h1>
  <div class="m-auto mt-3 h-1 w-3/4 rounded-full bg-accent sm:w-1/2" />
</header>

{#key data.graphData}
  <div class="my-10 flex w-full justify-center">
    <select
      name="days"
      id="days"
      class="bg-gray-950 text-gray-100"
      bind:value={days}
      on:change={() => {
        $page.url.searchParams.set("days", days);
        if (days === "30") {
          $page.url.searchParams.delete("days");
        }
        goto($page.url.toString(), { invalidateAll: true });
      }}
    >
      <option value="30">30 days</option>
      <option value="45">45 days</option>
      <option value="60">60 days</option>
      <option value="90">90 days</option>
      <option value="69420">all time</option>
    </select>
  </div>
  <div in:fade={{ delay: 150, duration: 300 }}>
    {#if data.graphData === "invalid item"}
      <div class="mb-48 flex justify-center text-2xl font-semibold text-red-400">
        <h1>invalid item</h1>
      </div>
    {:else if data.graphData === "not enough data"}
      <div class="mb-48 flex justify-center text-2xl font-semibold text-red-400">
        <h1>not enough data</h1>
      </div>
    {:else if typeof data.graphData !== "string"}
      <div class="flex h-full w-full justify-center">
        <div class="h-[40vh] w-full px-4 sm:h-[65vh] sm:w-[70vw] sm:px-0">
          <Chart chartData={data.graphData} {chartOptions} />
        </div>
      </div>
    {/if}
  </div>

  <ItemList url="/item/history" />
{/key}
