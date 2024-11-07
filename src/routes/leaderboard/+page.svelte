<script lang="ts">
  import { goto, invalidate, onNavigate } from "$app/navigation";
  import { page } from "$app/stores";
  import ItemSearch from "$lib/components/items/ItemSearch.svelte";
  import getItems from "$lib/functions/items";
  import { getTags } from "$lib/functions/tags";
  import { items } from "$lib/state.svelte";
  import { onMount } from "svelte";
  import BigLeaderboard from "./BigLeaderboard.svelte";
  import MiniLeaderboard from "./MiniLeaderboard.svelte";

  let { data } = $props();

  const options = $state([
    {
      name: "balance",
      leaderboardName: "top balance",
      selected: false,
      showItems: false,
    },
    {
      name: "net worth",
      leaderboardName: "top net worth",
      selected: false,
      showItems: false,
      data: "net-worth",
    },
    {
      name: "level",
      leaderboardName: "top level",
      selected: false,
      showItems: false,
    },
    {
      name: "guilds",
      leaderboardName: "top guilds",
      selected: false,
      showItems: false,
    },
    {
      name: "streak",
      leaderboardName: "top daily streak",
      selected: false,
      showItems: false,
    },
    {
      name: "vote",
      leaderboardName: "top monthly votes",
      selected: false,
      showItems: false,
      descriptor: "votes",
    },
    {
      name: "wordle",
      leaderboardName: "top wordle wins",
      selected: false,
      showItems: false,
      descriptor: "wins",
    },
    {
      name: "lottery",
      leaderboardName: "top lottery wins",
      selected: false,
      showItems: false,
      descriptor: "wins",
    },
    {
      name: "commands",
      leaderboardName: "top command uses",
      selected: false,
      showItems: false,
      descriptor: "uses",
    },
    { name: "items", leaderboardName: "", selected: false, showItems: true, path: "" },
  ]);

  if ($page.url.searchParams.get("lb")) {
    if (
      options.find(
        (i) =>
          i?.data === $page.url.searchParams.get("lb") ||
          i.name === $page.url.searchParams.get("lb"),
      )
    ) {
      options.find(
        (i) =>
          i?.data === $page.url.searchParams.get("lb") ||
          i.name === $page.url.searchParams.get("lb"),
      ).selected = true;
    }
  }

  onNavigate((event) => {
    if (!event.to.url.searchParams.has("lb")) {
      options.forEach((o) => (o.selected = false));
    }
  });

  onMount(() => {
    items.value = data.items;
  });
</script>

<svelte:head>
  <title>leaderboards / nypsi</title>
</svelte:head>

<div class="mt-8 flex w-full justify-center px-4">
  <ul class="menu menu-horizontal justify-center rounded-box bg-base-200 text-xs lg:text-sm">
    {#each options as option}
      <li>
        <a
          class={option.selected ? "focus" : ""}
          href="?lb={option.data || option.name}"
          onclick={() => {
            options.forEach((i) => (i.selected = false));
            option.selected = true;

            invalidate("lb");
          }}>{option.name}</a
        >
      </li>
    {/each}
  </ul>
</div>

{#if !options.find((o) => o.selected)}
  <div class="mt-8 flex w-full justify-center">
    <div
      class="grid w-full grid-cols-1 flex-wrap justify-center gap-16 lg:max-w-4xl lg:grid-cols-2"
    >
      <MiniLeaderboard title="top balance" data={data.balance} tags={getTags()} />
      <MiniLeaderboard title="top level" data={data.prestige} tags={getTags()} />
    </div>
  </div>
{/if}

{#if options.find((o) => o.selected)?.showItems}
  {#await getItems() then items}
    <div class="mt-14 flex w-full justify-center">
      <div class="px-4 lg:max-w-3xl lg:px-0">
        <ItemSearch
          {items}
          onClick={async (itemId) => {
            const params = new URLSearchParams($page.url.searchParams.toString());
            params.set("item", itemId);

            return goto(`?${params.toString()}`);
          }}
        />
      </div>
    </div>
  {/await}
{/if}

{#if options.find((o) => o.selected)}
  {@const selected = options.find((o) => o.selected)}
  {#if !(selected.showItems && !$page.url.searchParams.has("item"))}
    <div class="mt-10 flex w-full justify-center">
      <BigLeaderboard
        tags={getTags()}
        data={data[`lb-${selected.data || selected.name}`] || new Promise(() => {})}
        title={selected.name === "items"
          ? `top ${data.items.find((i) => i.id === $page.url.searchParams.get("item"))?.name}`
          : selected.leaderboardName}
        userRoute={selected.name === "guilds" ? "/guild" : "/user"}
        descriptor={selected.descriptor}
      />
    </div>
  {/if}
{/if}
