<script lang="ts">
  import { page } from "$app/state";
  import Card from "$lib/components/Card.svelte";
  import Chart from "$lib/components/Chart.svelte";
  import type { ChartOptions } from "chart.js";

  let { data } = $props();
  const days = $derived(page.url.searchParams.get("days") || "60");

  const chartOptions: ChartOptions = {
    plugins: {
      tooltip: {
        intersect: false,
        mode: "index",
        callbacks: {
          label(tooltipItem) {
            if (tooltipItem.dataset.label.includes("items in world")) {
              return `in world: ${tooltipItem.formattedValue}`;
            }

            return `${tooltipItem.dataset.label} average: $${tooltipItem.formattedValue}`;
          },
        },
      },
    },
    maintainAspectRatio: false,
    responsive: true,
    elements: {
      line: {
        tension: 0.15,
      },
      point: {
        radius: 0,
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
  <title>{data.item?.name} history | nypsi</title>
</svelte:head>

<main class="mx-auto mt-4 w-full max-w-6xl space-y-4">
  <header class="flex justify-center gap-3">
    <div class="rounded-box bg-base-300 h-14 w-14 p-2">
      <img
        class="h-full w-full object-contain"
        src={data.item.emoji}
        alt=""
        decoding="sync"
        loading="eager"
      />
    </div>

    <h1 class="my-auto text-3xl font-bold text-white">{data.item.name} history</h1>
  </header>

  <!-- <h1 class="text-center text-4xl font-bold text-white sm:text-5xl">
      {data.item.name}
    </h1> -->

  {#key data.graphData}
    <menu class="menu menu-horizontal rounded-box bg-base-200 mx-auto flex justify-center gap-2">
      {#each [14, 30, 45, 60, 90, 69420] as option}
        {@const focused = days === option.toString()}
        <li>
          <a href="?days={option}" class={focused ? "menu-active" : ""}
            >{#if option === 69420}
              all time
            {:else}
              {option} days
            {/if}</a
          >
        </li>
      {/each}
    </menu>

    <div>
      {#if data.graphData === "invalid item"}
        <div class="text-error mb-48 flex justify-center text-2xl font-semibold">
          <h1>invalid item</h1>
        </div>
      {:else if data.graphData === "not enough data"}
        <div class="text-error mb-48 flex justify-center text-2xl font-semibold">
          <h1>not enough data</h1>
        </div>
      {:else if typeof data.graphData !== "string"}
        <Card class="mx-auto max-w-6xl">
          <Chart chartData={data.graphData} {chartOptions} />
        </Card>
      {/if}
    </div>
  {/key}
</main>
