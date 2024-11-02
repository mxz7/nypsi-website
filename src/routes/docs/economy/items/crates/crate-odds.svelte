<script lang="ts">
  import { browser } from "$app/environment";
  import getItems from "$lib/functions/items";
  import type { Item } from "$lib/types/Item";
  import { onMount } from "svelte";

  export let crate = '';

  let items: Item[];

  let crateItems: string[];

  onMount(async () => {
    items = await getItems();
    const text = await fetch(`https://raw.githubusercontent.com/mxz7/nypsi-odds/main/out/${crate}.txt`).then(response => response.text());
    const regex = /\(([^()]+)\)/gi
    crateItems = text.replace(regex, "").replace(/\r\n/g, "\r").replace(/\n/g, "\r").split(/\r/);
  })

  function getItemEmoji(item: string) {
    return items.find((i) => i.id == (item === "xp" ? "double_xp" : item === "money" ? "highroller" : item)).emoji;
  }

  function getItemName(item: string) {
    return item === "xp" || item ==="money" ? item : items.find((i) => i.id === item).name;
  }
</script>

<div class="container">
  {#if browser && crateItems != null}
    {#each Object.values(crateItems) as item}
      <div class="flex items-center gap-2">
        <img src={getItemEmoji(item.split(":")[0])} width=20px style="height:20px" alt="">
        <span>{getItemName(item.split(":")[0])}:{item.split(":")[1]}</span>
      </div>
    {/each}
  {:else}
    loading...
  {/if}
</div>

<style>
  .container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
</style>
