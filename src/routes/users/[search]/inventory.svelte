<script lang="ts">
  import { page } from "$app/state";
  import { getItemsRemote } from "$lib/api/items.remote";
  import { getInventory } from "$lib/api/users.remote";
  import Item from "./item.svelte";

  const [inventory, itemsData] = $derived(
    await Promise.all([getInventory(page.params.search), getItemsRemote()]),
  );
</script>

<ol class="grid grid-cols-3 gap-2 md:grid-cols-6">
  {#each inventory as { item, amount }}
    {@const itemData = itemsData.find((i) => i.id === item)}
    {#if itemData}
      <Item item={itemData} amount={amount.toLocaleString()} />
    {/if}
  {/each}
</ol>
