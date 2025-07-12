<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import ItemSearch from "$lib/components/items/ItemSearch.svelte";
  import { items, tags } from "$lib/state.svelte";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  let { children, data } = $props();

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
      name: "daily streak",
      data: "streak",
      leaderboardName: "top daily streak",
      selected: false,
      showItems: false,
    },
    {
      name: "vote",
      leaderboardName: "top monthly votes",
      selected: false,
      showItems: false,
    },
    {
      name: "wordle",
      leaderboardName: "top wordle wins",
      selected: false,
      showItems: false,
    },
    {
      name: "lottery",
      leaderboardName: "top lottery wins",
      selected: false,
      showItems: false,
    },
    {
      name: "commands",
      leaderboardName: "top command uses",
      selected: false,
      showItems: false,
    },
    { name: "items", leaderboardName: "", selected: false, showItems: true, path: "" },
  ]);

  let showChild = $state(true);

  if (!page.url.pathname.endsWith("leaderboards")) {
    const selected = options.find((i) => page.url.pathname.endsWith(i.data || i.name));

    if (selected) selected.selected = true;
    else options[options.length - 1].selected = true;
  }

  const selected = $derived(options.find((i) => i.selected));

  onMount(() => {
    items.value = data.items;
    tags.value = data.tags;
  });
</script>

<div class="mt-8 flex w-full justify-center px-4">
  <ul class="menu menu-md menu-horizontal rounded-box bg-base-200 justify-center gap-2">
    {#each options as option}
      <li>
        <a
          data-sveltekit-preload-code="viewport"
          class={option.selected ? "menu-active" : ""}
          href="/leaderboards{option.showItems ? '' : `/${option.data || option.name}`}"
          onclick={() => {
            options.forEach((i) => {
              if (i.name === option.name) i.selected = true;
              else i.selected = false;
            });

            if (option.showItems) {
              showChild = false;
            } else {
              setTimeout(() => {
                showChild = true;
              }, 50);
            }
          }}>{option.name}</a
        >
      </li>
    {/each}
  </ul>
</div>

{#if selected?.showItems}
  <div class="mt-14 flex w-full justify-center">
    <div class=" w-full px-4 lg:max-w-xs lg:px-0">
      <ItemSearch
        items={data.items}
        onClick={async (itemId) => {
          showChild = true;
          return goto(`/leaderboards/${itemId}`);
        }}
      />
    </div>
  </div>
{/if}

{#if showChild}
  {#key page.url.pathname}
    <div in:fade={{ duration: 100 }} out:fade={{ duration: 100 }}>
      {@render children()}
    </div>
  {/key}
{/if}
