<script lang="ts">
  import Loading from "$lib/components/Loading.svelte";
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";

  export let data;
  let loading = true;

  onMount(async () => {
    await Promise.race([...Object.values(data.streamed)]);
    loading = false;
  });
</script>

<svelte:head>
  <title>stats</title>
</svelte:head>

<div class="w-full flex justify-center">
  <div class="w-full sm:w-[70vw]">
    {#if loading}
      <div class="relative w-full mt-2">
        <Loading
          fadeOutSettings={{ delay: 0, duration: 150 }}
          fadeInSettings={{ delay: 50, duration: 100 }}
        />
      </div>
    {/if}

    {#await data.streamed.gambleStats then gambleStats}
      <div class="w-full px-6 sm:px-0 grid gap-4 grid-cols-1 md:grid-cols-3">
        {#each gambleStats as stat, i}
          <div
            class="p-4 duration-300 hover:border-accent hover:border-opacity-20 hover:bg-opacity-40 rounded border border-gray-300 border-opacity-5 bg-gray-950 bg-opacity-25 h-fit"
            in:fly|global={{ y: 50, duration: 500, delay: 100 * i }}
          >
            <h1 class="text-xl font-bold text-center">{stat.game}</h1>

            <p class="text-center">
              {stat.wins}/{stat._count._all} ({((stat.wins / stat._count._all) * 100).toFixed(1)}%)
            </p>
            <div
              class="gamble-template grid grid-cols-2 mt-2 w-full align-middle [&>p]:text-center gap-y-3"
            >
              <p>
                earned:<br /><span class="text-accent font-semibold"
                  >${stat._sum.earned.toLocaleString()}</span
                >
              </p>
              <p>
                spent:<br /><span class="text-accent font-semibold"
                  >${stat._sum.bet.toLocaleString()}</span
                >
              </p>
              <p>
                profit: <span class="text-accent font-semibold"
                  >${(stat._sum.earned - stat._sum.bet).toLocaleString()}</span
                >
              </p>
              <p>
                xp: <span class="text-accent font-semibold"
                  >{stat._sum.xpEarned.toLocaleString()}</span
                >
              </p>
              <p class="gamble-bottom">
                avg bet: <span class="text-accent font-semibold"
                  >${Math.floor(stat._avg.bet).toLocaleString()}</span
                >
              </p>
            </div>
          </div>
        {/each}
      </div>
    {/await}
  </div>
</div>

<!-- {#await data.streamed.itemStats then itemData}
        <div in:fly={{ y: 25, duration: 500 }}>
          <Stats
            title="items"
            data={itemData
              .filter((i) => data.items.find((item) => item.id === i.itemId))
              .map(
                (i) =>
                  `<div class="flex gap-2 items-center"><img src="${
                    data.items.find((item) => item.id === i.itemId).emoji
                  }" class="h-4" /> <p><span class="text-gray-300">${
                    data.items.find((item) => item.id === i.itemId).name
                  }</span> <span class="text-gray-100"><span class='font-bold'>${i.amount.toLocaleString()}</span> uses</span></p></div>`,
              )}
          />
        </div>
      {/await}
      {#await data.streamed.commandStats then commandData}
        <div in:fly={{ y: 25, duration: 500 }}>
          <Stats
            title="commands"
            data={commandData.map(
              (i) =>
                `<p><span class="text-gray-300">$</span><span class="text-gray-100">${
                  i.command
                }: <span class='font-bold'>${i.uses.toLocaleString()}</span> uses</span></p>`,
            )}
          />
        </div>
      {/await} -->

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
