<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Chart from "$lib/components/Chart.svelte";
  import ItemList from "$lib/components/ItemList.svelte";
  import Loading from "$lib/components/Loading.svelte";
  import type { ChartOptions } from "chart.js";

  export let data;
  let charts: HTMLDivElement;

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
        tension: 0.2,
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
    {#if $page.url.searchParams.get("items")}
      <div class="flex w-full flex-col gap-4 px-4">
        <div class="h-[30vh] w-full sm:h-[45vh]">
          {#await data.streamed.items}
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

      <div class="flex w-full flex-col gap-4 px-4">
        <div>
          <h1 class="text-center text-xl font-semibold text-white">level</h1>
          <div class="m-auto mt-1 h-1 w-3/4 rounded-full bg-accent sm:w-1/2" />
        </div>

        <div class="h-[30vh] w-full sm:h-[45vh]">
          {#await data.streamed.level}
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
    charts.scrollIntoView();

    // @ts-expect-error boooobbiiees
    data.streamed.items = new Promise((resolve) => {
      setTimeout(() => {
        resolve("not enough data");
      }, 10000);
    });

    if (selectedItems.includes(itemId)) {
      selectedItems.splice(selectedItems.indexOf(itemId), 1);

      if (selectedItems.length === 0) return goto("/me/graphs");

      return goto(`/me/graphs?items=${selectedItems.join("+")}`);
    } else {
      if (selectedItems.length + 1 > 10) selectedItems.shift();

      return goto(`/me/graphs?items=${[...selectedItems, itemId].join("+")}`);
    }
  }}
/>
