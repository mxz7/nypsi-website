<script lang="ts">
  import ItemModal from "$lib/components/docs/ItemModal.svelte";
  import getItems from "$lib/functions/items";
  import type { Item } from "$lib/types/Item";
  import { onMount } from "svelte";

  let { crate }: { crate: string } = $props();

  let items: Item[] = $state();

  let crateItems: string[] = $state();

  onMount(async () => {
    items = await getItems(fetch);
    const text = await fetch(
      `https://raw.githubusercontent.com/mxz7/nypsi-odds/main/out/${crate}.txt`,
    ).then((response) => response.text());
    const regex = /\(([^()]+)\)/gi;
    crateItems = text.replace(regex, "").replace(/\r\n/g, "\r").replace(/\n/g, "\r").split(/\r/);
  });

  function getItemEmoji(item: string) {
    return items.find(
      (i) =>
        i.id ==
        (item.startsWith("xp") ? "double_xp" : item.startsWith("money") ? "highroller" : item),
    ).emoji;
  }

  function getItemName(itemId: string) {
    const [id, value] = itemId.split(":");

    if (value) {
      if (id === "money") return `$${Number(value).toLocaleString()}`;
      if (id === "xp") return `${Number(value).toLocaleString()} xp`;
    }

    return items.find((i) => i.id === itemId).name;
  }
</script>

<div class="grid grid-cols-1 gap-2 lg:grid-cols-3">
  {#if crateItems}
    {#each Object.values(crateItems) as item}
      {@const itemId = item.split(": ")[0]}
      <div class="flex items-center gap-2">
        <div class="h-4 w-4">
          <img
            src={getItemEmoji(itemId)}
            class="h-full w-full object-contain"
            alt={item}
            loading="lazy"
            decoding="async"
          />
        </div>
        {#if items.find((i) => i.id == itemId)}
          <span
            ><ItemModal item={itemId}>{getItemName(itemId)}</ItemModal>: {item.split(": ")[1]}</span
          >
        {:else}
          <span>{getItemName(itemId)}: {item.split(": ")[1]}</span>
        {/if}
      </div>
    {/each}
  {:else}
    <span class="loading loading-spinner"></span>
  {/if}
</div>
