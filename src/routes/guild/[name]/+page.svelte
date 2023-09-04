<script lang="ts">
  import { page } from "$app/stores";
  import Chart from "$lib/components/Chart.svelte";
  import Guild from "$lib/components/guild/Guild.svelte";
  import { userSearchTerm } from "$lib/data/stores.js";
  import type { ApiGuildResponse } from "$lib/types/Guild.js";
  import type { ChartOptions } from "chart.js";
  import { fly } from "svelte/transition";

  export let data;
  let title = `${$page.params.name} / nypsi`;

  async function updateTags(userData: Promise<ApiGuildResponse> | ApiGuildResponse) {
    const data = await Promise.resolve(userData);
    if (!data.success) return;

    title = `${data.guild.guildName} / nypsi`;
    $userSearchTerm = data.guild.guildName;
  }

  $: updateTags(data.guild);

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
        radius: 2,
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
        tension: 0.3,
      },
      point: {
        radius: 2,
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
  {#if !data.guild.success}
    <div
      class="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 transform"
      in:fly={{ delay: 300, duration: 500, y: 75 }}
    >
      <p class="text-xl font-bold text-slate-300">unknown guild</p>
    </div>
  {:else}
    {#key data.guild}
      <Guild guildData={data.guild}></Guild>
    {/key}
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
              <div class="m-auto mt-1 h-1 w-3/4 rounded-full bg-accent sm:w-1/2" />
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
              <div class="m-auto mt-1 h-1 w-3/4 rounded-full bg-accent sm:w-1/2" />
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
              <div class="m-auto mt-1 h-1 w-3/4 rounded-full bg-accent sm:w-1/2" />
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
