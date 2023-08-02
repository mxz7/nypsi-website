<script lang="ts">
  import Loading from "$lib/components/Loading.svelte";
  import Stats from "$lib/components/users/Stats.svelte";
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";

  export let data;
  let loading = true;

  onMount(async () => {
    await Promise.resolve(data.streamed.gambleStats);
    loading = false;
  });
</script>

<svelte:head>
  <title>stats | nypsi</title>
</svelte:head>

<div class="w-full flex justify-center">
  <div class="w-full sm:w-fit flex flex-col gap-24 px-6 sm:px-0">
    {#if loading}
      <div class="relative w-full mt-2">
        <Loading
          fadeOutSettings={{ delay: 0, duration: 150 }}
          fadeInSettings={{ delay: 50, duration: 100 }}
        />
      </div>
    {:else}
      {#await data.streamed.gambleStats then gambleStats}
        <div class="w-full grid gap-4 grid-cols-1 md:grid-cols-3">
          {#each gambleStats as stat, i}
            <a
              href="/game?user={data.user.authenticated ? data.user.id : ''}&game={stat.game}"
              class="p-4 duration-300 hover:border-accent hover:border-opacity-20 hover:bg-opacity-40 rounded border border-gray-300 border-opacity-5 bg-gray-950 bg-opacity-25 h-fit"
              in:fly|global={{ y: 50, duration: 500, delay: 100 * i }}
            >
              <h1 class="text-xl font-bold text-center">{stat.game}</h1>

              <p class="text-center">
                {stat.wins}/{stat._count._all} ({((stat.wins / stat._count._all) * 100).toFixed(
                  1,
                )}%)
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
            </a>
          {/each}
        </div>
      {/await}

      {#await data.streamed.scratchStats then scratchStats}
        <div class="w-full grid gap-4 grid-cols-1 md:grid-cols-3">
          {#each scratchStats as stat, i}
            <a
              href="/game?user={data.user.authenticated ? data.user.id : ''}&game={stat.game}"
              class="p-4 duration-300 hover:border-accent hover:border-opacity-20 hover:bg-opacity-40 rounded border border-gray-300 border-opacity-5 bg-gray-950 bg-opacity-25 h-fit"
              in:fly|global={{ y: 50, duration: 500, delay: 100 * i }}
            >
              <h1 class="text-xl font-bold text-center">{stat.game.replaceAll("_", " ")}</h1>

              <p class="text-center">
                {stat._sum.win}/{stat._count._all} ({(
                  (stat._sum.win / stat._count._all) *
                  100
                ).toFixed(1)}%)
              </p>
            </a>
          {/each}
        </div>
      {/await}

      <div class="grid gap-4 grid-cols-1 md:grid-cols-3">
        {#await data.streamed.itemStats then itemData}
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
        {/await}
        {#await data.streamed.leaderboards then leaderboardData}
          {#if leaderboardData.length > 0}
            <div in:fly={{ y: 25, duration: 500 }}>
              <Stats
                title="leaderboards"
                data={leaderboardData.map((i) => {
                  let returnData = `<div class="flex gap-2 items-center">`;

                  if (i.leaderboard.startsWith("item-")) {
                    returnData += `<img src="${
                      data.items.find((item) => item.id === i.leaderboard.substring(5)).emoji
                    }" class="h-4" /> <p><span class="text-gray-300">${
                      data.items.find((item) => item.id === i.leaderboard.substring(5)).name
                    }</span>`;
                  } else {
                    returnData += `<span class="text-gray-300">${i.leaderboard}</span>`;
                  }

                  returnData += ` <span class="${
                    i.position === 1 ? "text-accent" : "text-gray-100"
                  } font-bold">#${i.position.toLocaleString()}</span></p></div>`;

                  return returnData;

                  // return `<p><span class="text-gray-300">$</span><span class="text-gray-100">${
                  //   i.command
                  // }: <span class='font-bold'>${i.uses.toLocaleString()}</span> uses</span></p>`;
                })}
              />
            </div>
          {/if}
        {/await}
      </div>
    {/if}
  </div>
</div>

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
