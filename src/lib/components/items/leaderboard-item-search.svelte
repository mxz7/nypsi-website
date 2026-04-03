<script lang="ts">
  import { getItemsRemote } from "$lib/api/items.remote";
  import type { Item } from "$lib/types/Item";

  interface Props {
    url?: string;
    search?: string;
  }

  let { url, search = $bindable("") }: Props = $props();

  const items = await getItemsRemote();

  const filteredItems: Item[] = $derived(
    items
      .filter((i) => i.name.includes(search.toLowerCase()) || i.id.startsWith(search))
      .slice(0, 10),
  );
</script>

<li>
  <input
    type="search"
    bind:value={search}
    class="input input-bordered input-sm w-full"
    placeholder="search for an item"
    autocapitalize="off"
    autocorrect="off"
  />
</li>

{#if filteredItems.length > 0 && search}
  {#each filteredItems as item}
    <li>
      <a href={url?.replaceAll("{item}", item.id)} class="flex w-full items-center gap-1">
        <img src={item.emoji} alt="" loading="lazy" class="size-4 object-contain" />

        <span class="text-xs">{item.name}</span>
      </a>
    </li>
  {/each}
{/if}
