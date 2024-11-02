<script lang="ts">
  import parseEmoji from "$lib/functions/parseEmoji";
  import { onMount } from "svelte";

  let items: {
    name: string;
    emoji: string;
    id: string;
    cost: number;
    items_left: number;
    aliases: string[];
    type: string;
    value: string;
    limit: number;
  }[] = $state();

  onMount(async () => {
    items = await fetch(
      "https://raw.githubusercontent.com/mxz7/nypsi/main/data/karmashop.json",
    ).then((response) => response.json());
  });
</script>

<div class="grid grid-cols-1 gap-2 lg:grid-cols-2">
  {#if items != null}
    {#each Object.values(items) as item}
      <div>
        <div class="flex items-center gap-2">
          <img
            src={parseEmoji(item.emoji)}
            class="w-5"
            alt={item.id}
            loading="lazy"
            decoding="async"
          />
          <span class="font-semibold">{item.name}</span>
        </div>

        <div class="ml-8 mt-1 flex items-center gap-2">
          <img src={parseEmoji("📦")} class="w-5" alt={item.id} loading="lazy" decoding="async" />
          <span
            >stock of {item.items_left}{item.items_left > 1
              ? ` (limit of ${item.limit} per person)`
              : ""}</span
          >
        </div>

        <div class="my-1 ml-8 flex items-center gap-2">
          <img src={parseEmoji("🔮")} class="w-5" alt={item.id} loading="lazy" decoding="async" />
          <span>{item.cost} karma</span>
        </div>
      </div>
    {/each}
  {:else}
    <span class="loading loading-spinner"></span>
  {/if}
</div>
