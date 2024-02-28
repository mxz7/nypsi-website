<script lang="ts">
  import { pushState, replaceState } from "$app/navigation";
  import { page } from "$app/stores";
  import ItemList from "$lib/components/ItemList.svelte";
  import { onMount } from "svelte";
  import BigLeaderboard from "./BigLeaderboard.svelte";
  import MiniLeaderboard from "./MiniLeaderboard.svelte";

  export let data;
  let scrollElement: HTMLDivElement;

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
    { name: "items", leaderboardName: "", selected: false, showItems: true, path: "" },
  ];

  if ($page.url.searchParams.get("lb")) {
    if (!options.find((i) => i.name === $page.url.searchParams.get("lb"))) {
      options[0].selected = true;
    } else {
      options.find((i) => i.name === $page.url.searchParams.get("lb")).selected = true;
    }
  } else {
    options[0].selected = true;
  }

  onMount(() => {
    setTimeout(async () => {
      let selected = options.find((i) => i.selected);

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

      setTimeout(() => {
        if (selected.name !== "balance") scrollElement.scrollIntoView();
      }, 100);
    }, 0);
  });
</script>

<svelte:head>
  <title>leaderboards / nypsi</title>
</svelte:head>

<div class="mt-14 flex w-full justify-center px-14">
  <div class="flex flex-col flex-wrap justify-center gap-16 lg:flex-row">
    <MiniLeaderboard title="top balance" data={data.balance} tags={data.tags}></MiniLeaderboard>
    <MiniLeaderboard title="top level" data={data.prestige} tags={data.tags}></MiniLeaderboard>
    <MiniLeaderboard title="top net worth" data={data.net} tags={data.tags}></MiniLeaderboard>
  </div>
</div>

<div class="flex w-full justify-center">
  <div class="mt-14 flex flex-wrap justify-center gap-4">
    {#each options as option, i}
      <button
        class="flex items-center justify-center rounded-lg border bg-slate-950 bg-opacity-25 p-3 shadow duration-200 hover:border-accent hover:border-opacity-55
        {($page.state.leaderboardSelection ? $page.state.leaderboardSelection : 0) === i
          ? 'border-accent border-opacity-60 hover:border-opacity-100'
          : 'border-white border-opacity-10'}"
        on:click={() => {
          const selected = options[i];

          if (selected.name !== "items") $page.url.searchParams.delete("item");
          if (i !== 0) $page.url.searchParams.set("lb", encodeURIComponent(selected.name));
          else $page.url.searchParams.delete("lb");

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
          setTimeout(() => {
            scrollElement.scrollIntoView();
          }, 100);
        }}
      >
        <p>{option.name}</p>
      </button>
    {/each}
  </div>
</div>

{#if options[$page.state.leaderboardSelection]?.name === "items"}
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
          setTimeout(() => {
            scrollElement.scrollIntoView();
          }, 100);
        }}
      />
    {/await}
  {/if}
{/if}

<div bind:this={scrollElement} />

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
