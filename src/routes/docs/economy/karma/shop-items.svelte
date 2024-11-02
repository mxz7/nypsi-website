<script lang="ts">
  import { browser } from "$app/environment";
  import parseEmoji from "$lib/functions/parseEmoji";
  import { onMount } from "svelte";

  let items: {name: string, emoji: string, id: string, cost: number, items_left: number, aliases: string[], type: string, value: string, limit: number}[];

  onMount(async () => {
    items = await fetch("https://raw.githubusercontent.com/mxz7/nypsi/main/data/karmashop.json").then(response => response.json());
  })
</script>

<div class="container">
  {#if browser && items != null}
    {#each Object.values(items) as item}
      <div>
        <div class="flex items-center gap-2">
          <img src={parseEmoji(item.emoji)} width=20 alt="">
          <span class="font-bold">{item.name}</span>
        </div>
        
        <div class="flex items-center gap-2" style="margin-top: 2px; margin-left: 33px">
          <img src={parseEmoji("📦")} width=20 alt="">
          <span>stock of {item.items_left}{item.items_left > 1 ? ` (limit of ${item.limit} per person)` : ""}</span>
        </div>

        <div class="flex items-center gap-2" style="margin-top: 2px; margin-bottom: 5px; margin-left: 33px">
          <img src={parseEmoji("🔮")} width=20 alt="">
          <span>{item.cost} karma</span>
        </div>
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
