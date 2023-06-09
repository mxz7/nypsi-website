<script lang="ts">
  import { searchTerm } from "$lib/data/stores";
  import getItems from "$lib/functions/getItems";
  import { onMount } from "svelte";
  import ItemIcon from "./ItemIcon.svelte";

  export let items: { id: string; name: string; emoji: string; aliases: string[]; role: string }[] =
    [];

  $: filteredItems = items.filter((i) => {
    if ($searchTerm.length == 0) return true;
    if (i.name.includes($searchTerm.toLowerCase())) return true;
    if (i.id.includes($searchTerm.toLowerCase())) return true;
    if (i.role.includes($searchTerm.toLowerCase())) return true;
    if (i.aliases)
      for (const alias of i.aliases) {
        if (alias.includes($searchTerm.toLowerCase())) return true;
      }
  });

  onMount(async () => {
    items = (await getItems()) as {
      id: string;
      name: string;
      emoji: string;
      aliases: string[];
      role: string;
    }[];
  });
</script>

<div id="items" class="mt-10 w-full p-4 sm:px-48">
  <form class="m-2 flex w-fit flex-row rounded-md bg-gray-950 bg-opacity-50 p-3">
    <div class="mr-1 flex items-center justify-center">
      <img src="/search.png" alt="" class="h-4 w-4" />
    </div>
    <input
      class="ml-2 border-none bg-transparent text-gray-400 placeholder:text-gray-400 focus:border-none focus:outline-none"
      type="search"
      name="search"
      placeholder="search"
      bind:value={$searchTerm}
    />
  </form>

  <div class="flex flex-row flex-wrap justify-center">
    {#each filteredItems as item}
      <ItemIcon {item} />
    {/each}
  </div>
</div>
