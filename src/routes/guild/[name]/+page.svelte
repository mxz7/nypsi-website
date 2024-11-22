<script lang="ts">
  import Chart from "$lib/components/Chart.svelte";
  import { guildSearchTerm } from "$lib/state.svelte";
  import type { ChartOptions } from "chart.js";
  import Guild from "./Guild.svelte";

  let { data } = $props();
  let title = $derived(
    `${data.guild.success ? data.guild.guild.guildName : "unknown guild"} / nypsi`,
  );

  $effect(() => {
    if (data.guild.success) guildSearchTerm.value = data.guild.guild.guildName;
  });

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

  const numberChartOptions: ChartOptions = {
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
</script>

<svelte:head>
  <title>{title}</title>

  {#if data.guild.success}
    <meta name="og:title" content={data.guild.guild.guildName} />
    <meta name="og:site_name" content="nypsi" />
    <meta
      name="description"
      content="level {data.guild.guild.level} guild created by {data.guild.guild.owner.user
        .lastKnownUsername} on {new Date(
        data.guild.guild.createdAt,
      ).toLocaleDateString()} with {data.guild.guild.members
        .length} members: {data.guild.guild.members
        .map((i) => i.economy.user.lastKnownUsername)
        .join(', ')}"
    />
    <meta
      name="og:description"
      content="level {data.guild.guild.level} guild created by {data.guild.guild.owner.user
        .lastKnownUsername} on {new Date(
        data.guild.guild.createdAt,
      ).toLocaleDateString()} with {data.guild.guild.members
        .length} members: {data.guild.guild.members
        .map((i) => i.economy.user.lastKnownUsername)
        .join(', ')}"
    />
    <meta name="og:image" content={data.guild.guild.owner.user.avatar} />
    <meta property="og:image:width" content="128" />
    <meta property="og:image:height" content="128" />
  {:else}
    <meta name="robots" content="noindex" />
  {/if}
</svelte:head>

<div>
  {#if data.guild.success}
    <Guild guildData={data.guild} />
  {:else}
    <div class="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 transform">
      <p class="text-xl font-bold text-slate-300">unknown guild</p>
    </div>
  {/if}
</div>

{#if data.graphs}
  <div class="flex w-full justify-center">
    <div class="flex w-full flex-col gap-8 sm:w-[60vw]">
      {#await data.graphs.balance then chartData}
        {#if typeof chartData !== "string"}
          <div class="flex w-full flex-col gap-4 px-4">
            <div>
              <h1 class="text-center text-lg font-semibold text-white">balance</h1>
              <div class="m-auto mt-1 h-1 w-3/4 rounded-full bg-primary sm:w-1/2"></div>
            </div>

            <div class="h-[30vh] w-full sm:h-[45vh]">
              <Chart {chartData} chartOptions={moneyChartOptions} />
            </div>
          </div>
        {/if}
      {/await}

      {#await data.graphs.xp then chartData}
        {#if typeof chartData !== "string"}
          <div class="flex w-full flex-col gap-4 px-4">
            <div>
              <h1 class="text-center text-lg font-semibold text-white">xp</h1>
              <div class="m-auto mt-1 h-1 w-3/4 rounded-full bg-primary sm:w-1/2"></div>
            </div>

            <div class="h-[30vh] w-full sm:h-[45vh]">
              <Chart {chartData} chartOptions={numberChartOptions} />
            </div>
          </div>
        {/if}
      {/await}

      {#await data.graphs.level then chartData}
        {#if typeof chartData !== "string"}
          <div class="flex w-full flex-col gap-4 px-4">
            <div>
              <h1 class="text-center text-lg font-semibold text-white">level</h1>
              <div class="m-auto mt-1 h-1 w-3/4 rounded-full bg-primary sm:w-1/2"></div>
            </div>

            <div class="h-[30vh] w-full sm:h-[45vh]">
              <Chart {chartData} chartOptions={numberChartOptions} />
            </div>
          </div>
        {/if}
      {/await}
    </div>
  </div>
{/if}
