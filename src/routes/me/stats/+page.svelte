<script lang="ts">
  import Loading from "$lib/components/Loading.svelte";
  import { onMount } from "svelte";
  import { fly, fade } from "svelte/transition";
  import Stats from "./Stats.svelte";

  let { data } = $props();
  let loading = $state(true);

  onMount(async () => {
    await Promise.resolve(data.streamed.gambleStats);
    loading = false;
  });
</script>

<svelte:head>
  <title>stats / nypsi</title>
</svelte:head>

<div class="flex w-full justify-center">
  {#if loading}
    <div class="relative mt-2 w-full">
      <Loading
        fadeOutSettings={{ delay: 0, duration: 150 }}
        fadeInSettings={{ delay: 50, duration: 100 }}
      />
    </div>
  {:else}
    <div class="columns-1 gap-3 px-4 sm:max-w-4xl sm:columns-2 sm:px-0 md:columns-3">
      {#await data.streamed.gambleStats then gambleStats}
        {#each gambleStats as stat, i}
          <div class="break-inside-avoid-column pb-3">
            <a
              href="/game?user={data.user ? data.user.id : ''}&game={stat.game}"
              class="duration-300hover:border-opacity-20 block rounded-lg border border-primary border-opacity-5 bg-base-200 p-4"
              in:fade|global={{ duration: 300, delay: 150 }}
            >
              <h1 class="text-center text-xl font-bold">{stat.game}</h1>

              <p class="text-center">
                {stat.wins}/{stat._count._all} ({((stat.wins / stat._count._all) * 100).toFixed(
                  1,
                )}%)
              </p>
              <div
                class="gamble-template mt-2 grid w-full grid-cols-2 gap-y-3 align-middle [&>p]:text-center"
              >
                <p>
                  earned:<br /><span class="font-semibold text-primary"
                    >${stat._sum.earned.toLocaleString()}</span
                  >
                </p>
                <p>
                  spent:<br /><span class="font-semibold text-primary"
                    >${stat._sum.bet.toLocaleString()}</span
                  >
                </p>
                <p>
                  profit: <span class="font-semibold text-primary"
                    >${(stat._sum.earned - stat._sum.bet).toLocaleString()}</span
                  >
                </p>
                <p>
                  xp: <span class="font-semibold text-primary"
                    >{stat._sum.xpEarned.toLocaleString()}</span
                  >
                </p>
                <p class="gamble-bottom">
                  avg bet: <span class="font-semibold text-primary"
                    >${Math.floor(stat._avg.bet).toLocaleString()}</span
                  >
                </p>
              </div>
            </a>
          </div>
        {/each}
      {/await}

      {#await data.streamed.scratchStats then scratchStats}
        {#each scratchStats as stat, i}
          <div class="break-inside-avoid-column pb-3">
            <a
              href="/game?user={data.user ? data.user.id : ''}&game={stat.game}"
              class="block h-fit break-inside-avoid-column rounded-lg border border-primary border-opacity-5 bg-base-200 p-4 duration-300 hover:border-opacity-20"
              in:fade|global={{ duration: 300, delay: 150 }}
            >
              <h1 class="text-center text-xl font-bold">{stat.game.replaceAll("_", " ")}</h1>

              <p class="text-center">
                {stat._sum.win}/{stat._count._all} ({(
                  (stat._sum.win / stat._count._all) *
                  100
                ).toFixed(1)}%)
              </p>
            </a>
          </div>
        {/each}
      {/await}

      {#await data.streamed.itemStats then itemData}
        <div class="break-inside-avoid-column pb-3" in:fade|global={{ duration: 300, delay: 150 }}>
          <Stats
            title="items"
            data={itemData
              .filter((i) => data.items.find((item) => item.id === i.itemId))
              .map(
                (i) =>
                  `<div class="flex gap-2 items-center"><img loading="lazy" src="${
                    data.items.find((item) => item.id === i.itemId).emoji
                  }" class="h-4" /> <p><span>${
                    data.items.find((item) => item.id === i.itemId).name
                  }</span> <span><span>${i.amount.toLocaleString()}</span> uses</span></p></div>`,
              )}
          />
        </div>
      {/await}
      {#await data.streamed.commandStats then commandData}
        <div class="break-inside-avoid-column pb-3" in:fade|global={{ duration: 300, delay: 150 }}>
          <Stats
            title="commands"
            data={commandData.map(
              (i) =>
                `<p><span>$</span><span>${
                  i.command
                }: <span class='font-bold'>${i.uses.toLocaleString()}</span> uses</span></p>`,
            )}
          />
        </div>
      {/await}
      {#await data.streamed.leaderboards then leaderboardData}
        {#if leaderboardData.length > 0}
          <div
            class="break-inside-avoid-column pb-3"
            in:fade|global={{ duration: 300, delay: 150 }}
          >
            <Stats
              title="leaderboards"
              data={leaderboardData.map((i) => {
                let returnData = `<div class="flex gap-2 items-center">`;

                if (i.leaderboard.startsWith("item-")) {
                  returnData += `<img loading="lazy" src="${
                    data.items.find((item) => item.id === i.leaderboard.substring(5)).emoji
                  }" class="h-4" /> <p><span>${
                    data.items.find((item) => item.id === i.leaderboard.substring(5)).name
                  }</span>`;
                } else {
                  returnData += `<span>${i.leaderboard}</span>`;
                }

                returnData += ` <span class="${
                  i.position === 1 ? "text-primary" : ""
                } font-bold">#${i.position.toLocaleString()}</span></p></div>`;

                return returnData;
              })}
            />
          </div>
        {/if}
      {/await}
    </div>
  {/if}
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
