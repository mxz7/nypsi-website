<script lang="ts">
  import getItems from "$lib/functions/items";
  import type { Item } from "$lib/types/Item";
  import { onMount } from "svelte";

  let { crate }: { crate: string } = $props();

  let items: Item[] = $state();

  let crateItems: string[] = $state();

  onMount(async () => {
    items = await getItems();
    const text = await fetch(
      `https://raw.githubusercontent.com/mxz7/nypsi-odds/main/out/${crate}.txt`,
    ).then((response) => response.text());
    const regex = /\(([^()]+)\)/gi;
    crateItems = text.replace(regex, "").replace(/\r\n/g, "\r").replace(/\n/g, "\r").split(/\r/);
  });

  function getItemEmoji(item: string) {
    return items.find(
      (i) => i.id == (item === "xp" ? "double_xp" : item === "money" ? "highroller" : item),
    ).emoji;
  }

  function getItemName(item: string) {
    return item === "xp" || item === "money" ? item : items.find((i) => i.id === item).name;
  }
</script>

<div class="grid grid-cols-1 gap-2 lg:grid-cols-3">
  {#if crateItems}
    {#each Object.values(crateItems) as item}
      <div class="flex items-center gap-2">
        <img
          src={getItemEmoji(item.split(":")[0])}
          class="h-4"
          alt={item}
          loading="lazy"
          decoding="async"
        />
        <span>{getItemName(item.split(":")[0])}:{item.split(":")[1]}</span>
      </div>
    {/each}
  {:else}
    <span class="loading loading-spinner"></span>
  {/if}
</div>
