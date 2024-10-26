<script lang="ts">
  import { page } from "$app/stores";
  import search from "$lib/assets/search.png?as=run:0";
  import getItems from "$lib/functions/items";
  import { gameSearchTerm } from "$lib/state.svelte";
  import Img from "@zerodevx/svelte-img";
  import { onMount } from "svelte";
  import ItemIcon from "./ItemIcon.svelte";

  interface Props {
    items?: { id: string; name: string; emoji: string; aliases: string[]; role: string }[];
    url: string;
    includeSearchParams?: boolean;
    onClick?: any;
    selectedList?: string[];
  }

  let {
    items = $bindable([]),
    url,
    includeSearchParams = false,
    onClick = (itemId?: string) => {},
    selectedList = [],
  }: Props = $props();

  let filteredItems = $derived(
    items.filter((i) => {
      if (gameSearchTerm.value.length == 0) return true;
      if (i.name.includes(gameSearchTerm.value.toLowerCase())) return true;
      if (i.id.includes(gameSearchTerm.value.toLowerCase())) return true;
      if (i.role.includes(gameSearchTerm.value.toLowerCase())) return true;
      if (i.aliases)
        for (const alias of i.aliases) {
          if (alias.includes(gameSearchTerm.value.toLowerCase())) return true;
        }
    }),
  );

  onMount(async () => {
    if (!items || items.length === 0)
      items = (await getItems()) as {
        id: string;
        name: string;
        emoji: string;
        aliases: string[];
        role: string;
      }[];
  });
</script>

<div class="mt-10 flex w-full justify-center">
  <div id="items" class=" w-full overflow-x-hidden md:max-w-7xl">
    <form
      class="m-2 flex w-fit flex-row rounded-md border border-primary border-opacity-0 bg-base-200 p-3 duration-150 focus-within:border focus-within:border-opacity-50"
    >
      <div class="mr-1 flex items-center justify-center">
        <Img src={search} alt="search icon" class="h-4 w-4" />
      </div>

      <input
        class="ml-2 border-none bg-transparent pr-4 text-slate-300 placeholder:text-slate-400 focus:border-none focus:outline-none"
        type="search"
        name="search"
        placeholder="search"
        bind:value={gameSearchTerm.value}
        autocapitalize="off"
      />
    </form>

    <div class="flex w-full flex-row flex-wrap justify-center gap-1">
      {#each filteredItems as item}
        <ItemIcon
          {item}
          {url}
          {includeSearchParams}
          {onClick}
          selected={selectedList.includes(item.id) || $page.state?.leaderboardItem === item.id}
        />
      {/each}
    </div>
  </div>
</div>
