<script lang="ts">
  import { page } from "$app/state";
  import Chart from "$lib/components/Chart.svelte";
  import Card from "$lib/components/ui/Card.svelte";
  import Main from "$lib/components/ui/Main.svelte";
  import { formatNumberPretty } from "$lib/functions/string.js";
  import type { ChartOptions } from "chart.js";

  let { data } = $props();
  const days = $derived(page.url.searchParams.get("days") || "60");

  const priceChartOptions: ChartOptions = {
    plugins: {
      tooltip: {
        intersect: false,
        mode: "index",
        callbacks: {
          label(tooltipItem) {
            return `${tooltipItem.dataset.label} average: $${tooltipItem.formattedValue}`;
          },
        },
      },
    },
    maintainAspectRatio: true,
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
        ticks: {
          autoSkip: true,
          maxTicksLimit: 7,
        },
      },
      y: {
        grid: {
          display: false,
        },
        min: 0,
        ticks: {
          callback(tickValue) {
            return `$${formatNumberPretty(Number(tickValue))}`;
          },
        },
      },
    },
  };

  const itemCountChartOptions: ChartOptions = {
    plugins: {
      tooltip: {
        intersect: false,
        mode: "index",
        callbacks: {
          label(tooltipItem) {
            return `items in world: ${tooltipItem.formattedValue}`;
          },
        },
      },
    },
    maintainAspectRatio: true,
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
        ticks: {
          autoSkip: true,
          maxTicksLimit: 7,
        },
      },
      y: {
        grid: {
          display: false,
        },
        min: 0,
        ticks: {
          callback(tickValue) {
            return formatNumberPretty(Number(tickValue));
          },
        },
      },
    },
  };

  const priceChartData = $derived.by(() => {
    if (typeof data.chartData === "string") return null;
    return data.chartData.priceData;
  });

  const itemCountChartData = $derived.by(() => {
    if (typeof data.chartData === "string") return null;
    return data.chartData.itemCountData;
  });
</script>

<svelte:head>
  <title>{data.item?.name} history | nypsi</title>
</svelte:head>

<Main class="mt-4 space-y-4">
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

  {#key data.chartData}
    <menu class="menu menu-horizontal rounded-box bg-base-200 mx-auto flex justify-center gap-2">
      {#each [14, 30, 60, 90, 69420] as option}
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

    {#if data.chartData === "invalid item"}
      <div class="text-error mb-48 flex justify-center text-2xl font-semibold">
        <p>invalid item</p>
      </div>
    {:else if data.chartData === "not enough data"}
      <div class="text-error mb-48 flex justify-center text-2xl font-semibold">
        <p>not enough data</p>
      </div>
    {:else if typeof data.chartData !== "string"}
      <Card class="mx-auto max-w-6xl" mode="section">
        <h2 class="mb-4 text-lg font-semibold">Price History</h2>
        <Chart chartData={priceChartData} chartOptions={priceChartOptions} />
      </Card>

      <Card class="mx-auto max-w-6xl" mode="section">
        <h2 class="mb-4 text-lg font-semibold">Items in World</h2>
        <Chart chartData={itemCountChartData} chartOptions={itemCountChartOptions} />
      </Card>
    {/if}
  {/key}
</Main>
