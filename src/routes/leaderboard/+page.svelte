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

<div class="mt-8 flex w-full justify-center">
  <ul class="menu menu-horizontal rounded-box bg-base-200 text-xs lg:text-sm">
    {#each options as option}
      <li>
        <a
          class={option.selected ? "focus" : ""}
          href="?lb={option.data || option.name}"
          onclick={() => {
            options.forEach((i) => (i.selected = false));
            option.selected = true;

            delete data.data;

            invalidate("lb");
          }}>{option.name}</a
        >
      </li>
    {/each}
  </ul>
  <!-- <div
    class="mt-8 flex flex-wrap justify-center gap-4 px-4 lg:w-full lg:max-w-5xl lg:justify-evenly lg:px-0"
  >
    {#each options as option, i}
      <button
        data-umami-event="lb-{option.name.replaceAll(' ', '-')}"
        data-umami-event-user={auth.value?.authenticated ? auth.value.user.id : undefined}
        onclick={() => {
          const selected = options[i];

          if (selected.name !== "items") $page.url.searchParams.delete("item");
          $page.url.searchParams.set("lb", encodeURIComponent(selected.name));

          const state = {
            leaderboardSelection: i,
            leaderboardPath: null,
            leaderboardName: null,
          };

          if (selected.name !== "items") {
            state.leaderboardPath = selected.path;
            state.leaderboardName = selected.leaderboardName;
          }
          pushState($page.url, state);
        }}
      >
        <h3>{option.name}</h3>
      </button>
    {/each}
  </div> -->
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

            delete data.data;

            return goto(`?${params.toString()}`);
          }}
        />
      </div>
    </div>
  {/await}
{/if}

{#if options.find((o) => o.selected) && data.data}
  {@const selected = options.find((o) => o.selected)}
  {#key data.data}
    <div class="mt-10 flex w-full justify-center">
      <BigLeaderboard
        tags={getTags()}
        data={data.data}
        title={selected.name === "items"
          ? `top ${data.items.find((i) => i.id === $page.url.searchParams.get("item"))?.name}`
          : selected.leaderboardName}
        userRoute={selected.name === "guilds" ? "/guild" : "/user"}
        descriptor={selected.descriptor}
      />
    </div>
  {/key}
{/if}
