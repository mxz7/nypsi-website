<script lang="ts">
  import { page } from "$app/state";
  import { getItemsRemote } from "$lib/api/items.remote";
  import { getInventory } from "$lib/api/users.remote";
  import Card from "$lib/components/ui/Card.svelte";
  import { fade } from "svelte/transition";

  const [inventory, itemsData] = $derived(
    await Promise.all([getInventory(page.params.search), getItemsRemote()]),
  );
</script>

<ol class="grid grid-cols-2 gap-2 md:grid-cols-4" transition:fade={{ duration: 100 }}>
  {#each inventory as { item, amount }}
    {@const { name, emoji, id } = itemsData.find((i) => i.id === item)}
    <Card
      mode="li"
      class="relative flex flex-col items-center justify-center gap-1.5 overflow-hidden p-1 text-center text-sm md:p-2"
    >
      <img
        src={emoji}
        alt=""
        decoding="async"
        loading="lazy"
        class="w-8 object-contain pt-1.5 pb-0.5"
      />

      <h3 class="text-base-content/75 text-xs">{name}</h3>

      <span class="block font-mono">{amount.toLocaleString()}</span>

      <a href="/items/{id}" class="absolute top-0 left-0 block h-full w-full">
        <span class="sr-only">{name}</span>
      </a>
    </Card>
  {/each}
</ol>
