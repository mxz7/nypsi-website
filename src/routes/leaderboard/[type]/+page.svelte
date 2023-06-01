<script lang="ts">
  import { page } from "$app/stores";
  import BigLeaderboard from "$lib/components/BigLeaderboard.svelte";
  import LoadingIcon from "$lib/components/LoadingIcon.svelte";
  import getBalances from "$lib/functions/getBalances";
  import { getCommandsData } from "$lib/functions/getCommandsData";
  import getItem from "$lib/functions/getItem";
  import getItems from "$lib/functions/getItems";
  import getPrestiges from "$lib/functions/getPrestiges";
  import getStreaks from "$lib/functions/getStreaks";
  import getWordles from "$lib/functions/getWordles";
  import sleep from "$lib/functions/sleep";
  import type { LeaderboardData } from "$lib/types/LeaderboardData";
  import { onMount } from "svelte";

  let item: { id: string; name: string; emoji: string; aliases: string[]; role: string; plural?: string } | undefined;
  let data: LeaderboardData | undefined;
  let title = "";
  let suffix = (value: string) => {
    if (!item) return "";
    return parseInt(value) > 1 ? (item.plural ? item.plural : `${item.name}s`) : item.name;
  };

  onMount(async () => {
    let attempts = 0;

    item = (await getItems()).find((i) => i.id === $page.params.type);

    if (item) {
      title = `${item.plural ? item.plural : item.name} leaderboard`;
      while (!data) {
        attempts++;
        data = (await getItem(fetch, $page.params.type)) || undefined;

        await sleep(500);

        if (attempts > 15) break;
      }
    } else if ($page.params.type === "balance") {
      title = "top balance";
      while (!data) {
        attempts++;
        data = (await getBalances(fetch)) || undefined;

        await sleep(500);

        if (attempts > 15) break;
      }
    } else if ($page.params.type === "prestige") {
      title = "top prestige";
      while (!data) {
        attempts++;
        data = (await getPrestiges(fetch)) || undefined;

        await sleep(500);

        if (attempts > 15) break;
      }
    } else if ($page.params.type === "activeusers") {
      while (!data) {
        attempts++;
        data = (await getCommandsData(fetch).then((r) => r?.users.splice(0, 5))) || undefined;

        await sleep(500);

        if (attempts > 15) break;
      }
    } else if ($page.params.type === "streak") {
      title = "top daily streak";
      while (!data) {
        attempts++;
        data = (await getStreaks(fetch)) || undefined;
        suffix = (value: string) => (parseInt(value) > 1 ? "days" : "day");

        await sleep(500);

        if (attempts > 15) break;
      }
    } else if ($page.params.type === "wordle") {
      title = "top wordle wins";
      while (!data) {
        attempts++;
        data = (await getWordles(fetch)) || undefined;
        suffix = (value: string) => (parseInt(value) > 1 ? "wins" : "win");

        await sleep(500);

        if (attempts > 15) break;
      }
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

{#if data}
  <header class="text-center mt-5 sm:w-full">
    <h1 class="text-white text-2xl sm:text-4xl font-bold">
      {title}
    </h1>
    <div class="w-3/4 sm:w-1/2 h-1 bg-red-500 rounded-full mt-3 m-auto" />
  </header>

  <div class="mt-10 px-5 sm:px-24">
    {#if data.length === 0}
      <h2 class="m-auto text-lg font-bold text-gray-400 mt-12 text-center">
        {#if item}
          nobody has a {item.name}
        {:else}
          no data
        {/if}
      </h2>
    {:else}
      <BigLeaderboard {data} {suffix} />
    {/if}
  </div>
{:else}
  <h2
    class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl font-bold w-full px-5 text-center"
  >
    invalid item, please select one from the <a href="/leaderboard#items" class="underline text-sky-300">list</a>
  </h2>
{/if}
