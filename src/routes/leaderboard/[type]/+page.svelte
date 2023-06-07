<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import BigLeaderboard from "$lib/components/BigLeaderboard.svelte";
  import LoadingIcon from "$lib/components/LoadingIcon.svelte";
  import { getCommandsData } from "$lib/functions/getCommandsData";
  import getItems from "$lib/functions/getItems";
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
        data =
          (await fetch(`/api/leaderboard/item/${item.id}`)
            .then((r) => r.json())
            .catch(() => {})) || undefined;

        await sleep(500);

        if (attempts > 15) break;
      }
    } else if ($page.params.type === "activeusers") {
      title = "top active users";
      suffix = (value) => (parseInt(value) > 1 ? "cmds" : "cmd");
      while (!data) {
        attempts++;
        data = (await getCommandsData(fetch).then((r) => r?.users.splice(0, 5))) || undefined;

        await sleep(500);

        if (attempts > 15) break;
      }
    } else {
      switch ($page.params.type) {
        case "balance":
          title = "top balance";
          break;
        case "networth":
          title = "top net worth";
          break;
        case "prestige":
          title = "top prestige";
          break;
        case "wordle":
          title = "top wordle wins";
          break;
        case "streak":
          title = "top daily streak";
          break;
      }

      data = await fetch(`/api/leaderboard/${$page.params.type}`)
        .then((r) => r.json())
        .catch(() => {});
    }

    (document.querySelector("#loadingpage") as HTMLElement).style.opacity = "0%";

    setTimeout(() => {
      (document.querySelector("#loadingpage") as HTMLElement).style.display = "none";
    }, 750);

    if (!data) {
      console.log("https://http.cat/308");
      setTimeout(() => {
        return goto("/leaderboard");
      }, 3000);
    }
  });
</script>

<svelte:head>
  <title>nypsi leaderboard</title>
  <meta name="description" content="leaderboards for the nypsi discord bot" />
</svelte:head>

<LoadingIcon />

{#if data}
  <header class="mt-5 text-center sm:w-full">
    <h1 class="text-2xl font-bold text-white sm:text-4xl">
      {title}
    </h1>
    <div class="m-auto mt-3 h-1 w-3/4 rounded-full bg-red-500 sm:w-1/2" />
  </header>

  <div class="mt-10 px-5 sm:px-24">
    {#if data.length === 0}
      <h2 class="m-auto mt-12 text-center text-lg font-bold text-gray-400">
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
    class="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 transform px-5 text-center text-xl font-bold text-white"
  >
    invalid item, please select one from the <a href="/leaderboard#items" class="text-sky-300 underline">list</a>
  </h2>
{/if}
