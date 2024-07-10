<script lang="ts">
  import { pushState, replaceState } from "$app/navigation";
  import { page } from "$app/stores";
  import ItemSearch from "$lib/components/items/ItemSearch.svelte";
  import { onMount } from "svelte";
  import BigLeaderboard from "./BigLeaderboard.svelte";
  import MiniLeaderboard from "./MiniLeaderboard.svelte";

  export let data;

  const options = [
    {
      name: "balance",
      leaderboardName: "top balance",
      selected: false,
      showItems: false,
      path: "/api/leaderboard/balance",
    },
    {
      name: "net worth",
      leaderboardName: "top net worth",
      selected: false,
      showItems: false,
      path: "/api/leaderboard/networth",
    },
    {
      name: "level",
      leaderboardName: "top level",
      selected: false,
      showItems: false,
      path: "/api/leaderboard/prestige",
    },
    {
      name: "guilds",
      leaderboardName: "top guilds",
      selected: false,
      showItems: false,
      path: "/api/leaderboard/guild",
    },
    {
      name: "streak",
      leaderboardName: "top daily streak",
      selected: false,
      showItems: false,
      path: "/api/leaderboard/streak",
    },
    {
      name: "vote",
      leaderboardName: "top monthly votes",
      selected: false,
      showItems: false,
      path: "/api/leaderboard/vote",
    },
    {
      name: "wordle",
      leaderboardName: "top wordle wins",
      selected: false,
      showItems: false,
      path: "/api/leaderboard/wordle",
    },
    {
      name: "lottery",
      leaderboardName: "top lottery wins",
      selected: false,
      showItems: false,
      path: "/api/leaderboard/lottery",
    },
    {
      name: "commands",
      leaderboardName: "top command uses",
      selected: false,
      showItems: false,
      path: "/api/leaderboard/commands",
    },
    { name: "items", leaderboardName: "", selected: false, showItems: true, path: "" },
  ];

  if ($page.url.searchParams.get("lb")) {
    if (!options.find((i) => i.name === $page.url.searchParams.get("lb"))) {
      options[0].selected = true;
    } else {
      options.find((i) => i.name === $page.url.searchParams.get("lb")).selected = true;
    }
  }

  onMount(() => {
    setTimeout(async () => {
      let selected = options.find((i) => i.selected);

      if (!selected) return;

      const state = {
        leaderboardSelection: options.findIndex((i) => i.selected),
        leaderboardItem: null,
        leaderboardPath: selected.path,
        leaderboardName: selected.leaderboardName,
      };

      if (selected.name === "items") {
        if ($page.url.searchParams.get("item")) {
          const items = await Promise.resolve(data.items);

          const item = items.find((i) => i.id === $page.url.searchParams.get("item"));

          if (item) {
            state.leaderboardItem = item.id;
            state.leaderboardPath = `/api/leaderboard/item/${item.id}`;
            state.leaderboardName = `top ${item.name}`;
          }
        }
      }

      replaceState("", state);
    }, 0);
  });
</script>

<svelte:head>
  <title>leaderboards / nypsi</title>
</svelte:head>

<div class="flex w-full justify-center">
  <div
    class="mt-8 flex flex-wrap justify-center gap-4 px-4 lg:w-full lg:max-w-5xl lg:justify-evenly lg:px-0"
  >
    {#each options as option, i}
      <button
        class="btn
        {(typeof $page.state.leaderboardSelection === 'number'
          ? $page.state.leaderboardSelection
          : -1) === i
          ? 'btn-primary '
          : ''}"
        on:click={() => {
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
  </div>
</div>

{#if !$page.state.leaderboardPath && options[$page.state.leaderboardSelection]?.name !== "items"}
  <div class="mt-8 flex w-full justify-center">
    <div
      class="grid w-full grid-cols-1 flex-wrap justify-center gap-16 lg:max-w-4xl lg:grid-cols-2"
    >
      <MiniLeaderboard title="top balance" data={data.balance} tags={data.tags} />
      <MiniLeaderboard title="top level" data={data.prestige} tags={data.tags} />
    </div>
  </div>
{/if}

{#if options[$page.state.leaderboardSelection]?.name === "items"}
  {#if data.items}
    {#await data.items then items}
      <div class="mt-14 flex w-full justify-center">
        <div class="px-4 lg:max-w-3xl lg:px-0">
          <ItemSearch
            {items}
            onClick={async (itemId) => {
              $page.url.searchParams.set("item", itemId);

              const item = (await Promise.resolve(data.items)).find((i) => i.id === itemId);

              pushState($page.url, {
                leaderboardPath: `/api/leaderboard/item/${itemId}`,
                leaderboardItem: itemId,
                leaderboardSelection: $page.state.leaderboardSelection,
                leaderboardName: `top ${item.name}`,
              });
            }}
          />
        </div>
      </div>
    {/await}
  {/if}
{/if}

<!-- {#if options[$page.state.leaderboardSelection]?.name === "items"}
  {#if data.items}
    {#await data.items then items}
      <ItemList
        {items}
        url=""
        onClick={async (itemId) => {
          $page.url.searchParams.set("item", itemId);

          const item = (await Promise.resolve(data.items)).find((i) => i.id === itemId);

          pushState($page.url, {
            leaderboardPath: `/api/leaderboard/item/${itemId}`,
            leaderboardItem: itemId,
            leaderboardSelection: $page.state.leaderboardSelection,
            leaderboardName: `top ${item.name}`,
          });
        }}
      />
    {/await}
  {/if}
{/if} -->

{#if $page.state.leaderboardPath}
  {#key $page.state.leaderboardPath}
    <div class="mt-10 flex w-full justify-center">
      <BigLeaderboard
        tags={data.tags}
        data={fetch($page.state.leaderboardPath).then((r) => r.json())}
        title={$page.state.leaderboardName}
        userRoute={options[$page.state.leaderboardSelection].name === "guilds" ? "/guild" : "/user"}
      />
    </div>
  {/key}
{/if}
