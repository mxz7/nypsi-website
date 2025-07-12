<script lang="ts">
  import getItems from "$lib/functions/items.js";
  import type { Item } from "$lib/types/Item.js";
  import { onMount } from "svelte";
  import { cubicInOut } from "svelte/easing";
  import { tweened } from "svelte/motion";

  let { data } = $props();

  const progress = tweened(0, { duration: 300, easing: cubicInOut });

  let items: Item[] = $state();

  onMount(async () => {
    $progress = (1 / 6) * 100;
    items = await getItems(fetch);
    $progress = (2 / 6) * 100;
    await Promise.resolve(data.commandStats);
    $progress = (3 / 6) * 100;
    await Promise.resolve(data.itemStats);
    $progress = (4 / 6) * 100;
    await Promise.resolve(data.scratchStats);
    $progress = (5 / 6) * 100;
    await Promise.resolve(data.gambleStats);

    $progress = (6 / 6) * 100;
  });
</script>

<svelte:head>
  <title>statistics | nypsi</title>
</svelte:head>

<h1 class=" text-center text-3xl font-bold text-white">statistics</h1>

{#if $progress !== 100}
  <div class="mt-14 flex w-full justify-center">
    <progress class="progress progress-primary w-56" value={$progress} max="100"></progress>
  </div>
{:else}
  {#await data.gambleStats then gambleStats}
    <h2 class="mt-9 text-center text-xl font-semibold">gamble stats</h2>
    <div class="mt-4 grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
      {#each gambleStats as stat}
        <a
          href="/games?user={data.user ? data.user.id : ''}&game={stat.game}"
          class="border-primary/5 bg-base-200 hover:border-primary/20 block rounded-lg border p-4 duration-300"
        >
          <h3 class="text-center text-xl font-bold">{stat.game}</h3>

          <p class="text-center">
            {stat.wins.toLocaleString()}/{stat._count._all.toLocaleString()} ({(
              (stat.wins / stat._count._all) *
              100
            ).toFixed(1)}%)
          </p>
          <div
            class="gamble-template mt-2 grid w-full grid-cols-2 gap-y-3 align-middle [&>p]:text-center"
          >
            <p>
              earned:<br /><span class="text-primary text-sm font-semibold"
                >${stat._sum.earned.toLocaleString()}</span
              >
            </p>
            <p>
              spent:<br /><span class="text-primary text-sm font-semibold"
                >${stat._sum.bet.toLocaleString()}</span
              >
            </p>
            <p>
              profit: <span class="text-primary text-sm font-semibold"
                >${(stat._sum.earned - stat._sum.bet).toLocaleString()}</span
              >
            </p>
            <p>
              xp: <span class="text-primary text-sm font-semibold"
                >{stat._sum.xpEarned.toLocaleString()}</span
              >
            </p>
            <p class="gamble-bottom">
              avg bet: <span class="text-primary text-sm font-semibold"
                >${Math.floor(stat._avg.bet).toLocaleString()}</span
              >
            </p>
          </div>
        </a>
      {/each}

      {#await data.scratchStats then scratchStats}
        {#each scratchStats as stat}
          <a
            href="/games?user={data.user ? data.user.id : ''}&game={stat.game}"
            class="border-primary/5 bg-base-200 hover:border-primary/20 block h-fit break-inside-avoid-column rounded-lg border p-4 duration-300"
          >
            <h1 class="text-center text-xl font-bold">{stat.game.replaceAll("_", " ")}</h1>

            <p class="text-center">
              {stat._sum.win.toLocaleString()}/{stat._count._all.toLocaleString()} ({(
                (stat._sum.win / stat._count._all) *
                100
              ).toFixed(1)}%)
            </p>
          </a>
        {/each}
      {/await}
    </div>

    <div class="mt-9 flex gap-6 text-center text-sm">
      <div class="bg-base-200 h-[500px] w-1/2 overflow-y-scroll rounded-lg p-4">
        <h2 class=" text-xl font-bold">item stats</h2>
        <div class="mt-6 grid w-full grid-cols-1 gap-2">
          {#await data.itemStats then itemStats}
            {#each itemStats as stat}
              {@const itemData = items.find((i) => i.id === stat.itemId)}
              {#if itemData}
                <div class="flex items-center justify-center gap-1">
                  <img
                    src={items.find((i) => i.id === stat.itemId)?.emoji}
                    decoding="async"
                    loading="lazy"
                    alt={stat.itemId}
                    class="h-4"
                  />
                  <span>{stat.itemId}: {stat.amount.toLocaleString()} uses</span>
                </div>
              {/if}
            {/each}
          {/await}
        </div>
      </div>

      <div class="bg-base-200 h-[500px] w-1/2 overflow-y-scroll rounded-lg p-4">
        <h2 class=" text-xl font-bold">command stats</h2>
        <div class="mt-6 grid w-full grid-cols-1 gap-2">
          {#await data.commandStats then commandStats}
            {#each commandStats as stat}
              <p>${stat.command}: {stat.uses.toLocaleString()} uses</p>
            {/each}
          {/await}
        </div>
      </div>
    </div>
  {/await}
{/if}

<style>
  .gamble-template {
    grid-template:
      ". ."
      ". ."
      "a a";
  }

  .gamble-bottom {
    grid-area: a;
  }
</style>
