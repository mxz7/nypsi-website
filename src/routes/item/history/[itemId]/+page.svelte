<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import Chart from "$lib/components/Chart.svelte";
  import { auth } from "$lib/state.svelte.js";
  import type { ChartOptions } from "chart.js";
  import { onMount } from "svelte";

  let { data } = $props();
  let days = $state(page.url.searchParams.get("days") || "60");

  const chartOptions: ChartOptions = {
    plugins: {
      tooltip: {
        intersect: false,
        mode: "index",
        callbacks: {
          label(tooltipItem) {
            if (tooltipItem.dataset.label.includes("items in world"))
              return `in world: ${tooltipItem.formattedValue}`;
            else if (tooltipItem.dataset.label === (data.user ? data.user.username : "null"))
              return `${data.user ? data.user.username : "null"}: ${tooltipItem.formattedValue}`;

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

  onMount(() => {
    if (data.user && !auth?.value) {
      auth.value = {
        authenticated: true,
        user: data.user,
      };
    }
  });
</script>

<svelte:head>
  <title>{data.item?.name} history | nypsi</title>
</svelte:head>

{#if !data.auth}
  <div class="flex w-full justify-center">
    <main class="mt-14 text-center">
      <h1 class="mb-4 text-2xl font-bold text-white">you must be logged in to view this page</h1>
      <p>
        to view item history you need a <a
          href="https://ko-fi.com/tekoh"
          target="_blank"
          class="link link-primary">premium membership</a
        >
      </p>

      <a href="/login?next={encodeURIComponent(page.url.pathname)}" class="btn mt-4">log in</a>
    </main>
  </div>
{:else if data.premium}
  <header class="mt-5 mb-10 text-center sm:mb-3 sm:w-full">
    <h1 class="text-4xl font-bold text-white sm:text-5xl">
      {data.item?.name} history
    </h1>
    <div class="bg-primary m-auto mt-3 h-1 w-3/4 rounded-full sm:w-1/2"></div>
  </header>

  {#key data.graphData}
    <div class="my-10 flex w-full justify-center">
      <select
        name="days"
        id="days"
        class="bg-gray-950 text-gray-100"
        bind:value={days}
        onchange={() => {
          goto(`?days=${days}`);
        }}
      >
        <option value="14">14 days</option>
        <option value="30">30 days</option>
        <option value="45">45 days</option>
        <option value="60">60 days</option>
        <option value="90">90 days</option>
        <option value="69420">all time</option>
      </select>
    </div>
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
        <div class="flex h-full w-full justify-center">
          <div class="h-[40vh] w-full px-4 sm:h-[65vh] sm:w-[70vw] sm:px-0">
            <Chart chartData={data.graphData} {chartOptions} />
          </div>
        </div>
      {/if}
    </div>
  {/key}
{:else}
  <div class="flex w-full justify-center">
    <div class="mt-14 text-center">
      <h1 class="text-3xl font-bold text-white">you must have premium for item graphs</h1>
      <p>
        you can buy premium <a
          href="https://ko-fi.com/tekoh"
          target="_blank"
          class="link link-primary">here</a
        >
      </p>
    </div>
  </div>
{/if}
