<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Chart from "$lib/components/Chart.svelte";
  import ItemList from "$lib/components/ItemList.svelte";
  import Loading from "$lib/components/Loading.svelte";
  import type { ChartOptions } from "chart.js";

  export let data;
  let charts: HTMLDivElement;
  let days = $page.url.searchParams.get("days") || "30";

  const moneyChartOptions: ChartOptions = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        intersect: false,
        mode: "index",
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
      y1: {
        grid: {
          display: false,
        },
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
        intersect: false,
        mode: "index",
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
      y1: {
        grid: {
          display: false,
        },
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

  const itemChartOptions: ChartOptions = {
    plugins: {
      tooltip: {
        intersect: false,
        mode: "index",
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
      y1: {
        grid: {
          display: false,
        },
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

  let selectedItems: string[];

  $: selectedItems = $page.url.searchParams.get("items")?.split(" ") || [];
</script>

<svelte:head>
  <title>personal graphs / nypsi</title>
</svelte:head>

<div class="flex w-full justify-center">
  <div class="flex w-full flex-col gap-8 sm:w-[60vw]" bind:this={charts}>
    <div class="flex w-full justify-center">
      <select
        name="days"
        id="days"
        class="bg-gray-950 text-gray-100"
        bind:value={days}
        on:change={() => {
          const params = new URLSearchParams($page.url.searchParams.toString());
          params.set("days", days);

          goto(`?${params.toString()}`);
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
    {#if $page.url.searchParams.get("items")}
      <div class="flex w-full flex-col gap-4 px-4">
        <div class="h-[30vh] w-full sm:h-[45vh]">
          {#await data.itemsData}
            <div class="relative h-full w-full">
              <Loading />
            </div>
          {:then chartData}
            {#if typeof chartData === "string"}
              <h2 class="text-center font-semibold text-white">not enough data</h2>
            {:else}
              <Chart {chartData} chartOptions={itemChartOptions} />
            {/if}
          {/await}
        </div>
      </div>
    {:else}
      <div class="flex w-full flex-col gap-4 px-4">
        <div>
          <h1 class="text-center text-xl font-semibold text-white">balance</h1>
          <div class="m-auto mt-1 h-1 w-3/4 rounded-full bg-primary sm:w-1/2" />
        </div>

        <div class="h-[30vh] w-full sm:h-[45vh]">
          {#await data.balance}
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
          <div class="m-auto mt-1 h-1 w-3/4 rounded-full bg-primary sm:w-1/2" />
        </div>

        <div class="h-[30vh] w-full sm:h-[45vh]">
          {#await data.networth}
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
          <div class="m-auto mt-1 h-1 w-3/4 rounded-full bg-primary sm:w-1/2" />
        </div>

        <div class="h-[30vh] w-full sm:h-[45vh]">
          {#await data.karma}
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

      <div class="flex w-full flex-col gap-4 px-4">
        <div>
          <h1 class="text-center text-xl font-semibold text-white">level</h1>
          <div class="m-auto mt-1 h-1 w-3/4 rounded-full bg-primary sm:w-1/2" />
        </div>

        <div class="h-[30vh] w-full sm:h-[45vh]">
          {#await data.level}
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

<ItemList
  items={data.items}
  url=""
  bind:selectedList={selectedItems}
  onClick={(itemId) => {
    // @ts-expect-error boooobbiiees
    data.itemsData = new Promise((resolve) => {
      setTimeout(() => {
        resolve("not enough data");
      }, 10000);
    });

    if (selectedItems.includes(itemId)) {
      selectedItems.splice(selectedItems.indexOf(itemId), 1);

      if (selectedItems.length === 0) return goto("/me/graphs");

      const params = new URLSearchParams($page.url.searchParams.toString());

      params.set("items", selectedItems.join("+"));

      return goto(`?${params.toString()}`);
    } else {
      if (selectedItems.length + 1 > 10) selectedItems.shift();

      const params = new URLSearchParams($page.url.searchParams.toString());

      params.set("items", [...selectedItems, itemId].join("+"));

      return goto(`?${params.toString()}`);
    }
  }}
/>
