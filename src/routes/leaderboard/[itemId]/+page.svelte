<script lang="ts">
  import { page } from "$app/stores";
  import LoadingIcon from "$lib/components/LoadingIcon.svelte";
  import getItem from "$lib/functions/getItem";
  import getItems from "$lib/functions/getItems";
  import sleep from "$lib/functions/sleep";
  import type { LeaderboardData } from "$lib/types/LeaderboardData";
  import { onMount } from "svelte";

  let item: { id: string; name: string; emoji: string; aliases: string[]; role: string; plural?: string } | undefined;
  let itemData: LeaderboardData | undefined;

  onMount(async () => {
    let attempts = 0;

    item = (await getItems()).find((i) => i.id === $page.params.itemId);

    while (!itemData) {
      attempts++;
      itemData = (await getItem(fetch, $page.params.itemId)) || undefined;

      await sleep(500);

      if (attempts > 15) break;
    }

    (document.querySelector("#loadingpage") as HTMLElement).style.opacity = "0%";

    setTimeout(() => {
      (document.querySelector("#loadingpage") as HTMLElement).style.display = "none";
    }, 750);
  });
</script>

<svelte:head>
  <title>nypsi leaderboard</title>
  <meta name="description" content="leaderboards for the nypsi discord bot" />
</svelte:head>

<LoadingIcon />

{#if item && itemData}
  <header class="text-center mt-5 sm:w-full">
    <h1 class="text-white text-2xl sm:text-4xl font-bold">
      {item.plural ? item.plural : `${item.name}s`} leaderboard
    </h1>
    <div class="w-3/4 sm:w-1/2 h-1 bg-red-500 rounded-full mt-3 m-auto" />
  </header>

  <div class="mt-10 px-5 sm:px-24">
    {#if itemData.length === 0}
      <h2 class="m-auto text-lg font-bold text-gray-400 mt-12 text-center">nobody has a {item.name}</h2>
    {:else}
      <table class="mt-1 sm:text-xl mx-auto text-gray-200 w-full sm:w-1/2">
        <tbody>
          {#each itemData.slice(0, 100) as { username, value, position }}
            <tr
              class="bg-gray-950 border-b-[8px] border-gray-900 border-opacity-100 bg-opacity-20 hover:scale-105 duration-200 ease-in"
            >
              <td class="px-1 py-1 text-gray-400">#{position}</td>
              <td class="px-4 py-1">{username}</td>
              <td class="px-4 py-1 text-right"
                >{value}
                <span class="opacity-75"
                  >{parseInt(value) > 1 ? (item.plural ? item.plural : `${item.name}s`) : item.name}</span
                ></td
              >
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
{:else}
  <h2
    class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl font-bold w-full px-5 text-center"
  >
    invalid item, please select one from the <a href="/leaderboard#items" class="underline text-sky-300">list</a>
  </h2>
{/if}
