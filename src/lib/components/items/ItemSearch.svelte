<script lang="ts">
  import type { Item } from "$lib/types/Item";

  interface Props {
    items?: Item[];
    url?: string | undefined;
    onClick?: any;
    search?: string;
  }

  let {
    items = [],
    url = undefined,
    onClick = (itemId?: string) => {},
    search = $bindable(""),
  }: Props = $props();

  const filteredItems: Item[] = $derived(
    items.filter((i) => i.name.includes(search.toLowerCase()) || i.id.startsWith(search)),
  );
</script>

<input
  type="search"
  bind:value={search}
  class="input input-bordered w-full max-w-xs"
  placeholder="search for an item"
  autocapitalize="off"
  autocorrect="off"
/>

{#if filteredItems.length > 0 && search}
  <ul class="mt-4 flex max-h-[272px] w-full max-w-xs flex-col gap-2 overflow-y-scroll">
    {#each filteredItems as item}
      <li class="w-full">
        <a href={url?.replaceAll("{item}", item.id)} class="w-full">
          <button onclick={() => onClick(item.id)} class="w-full">
            <div class="flex w-full items-center gap-4 rounded-lg bg-base-200 p-3">
              <div class="flex h-6 w-6 items-center justify-center">
                <img
                  src={item.emoji}
                  alt="item emoji"
                  loading="lazy"
                  class="h-auto max-h-full w-auto max-w-full object-contain"
                />
              </div>
              <span class="link text-sm">{item.name}</span>
            </div>
          </button>
        </a>
      </li>
    {/each}
  </ul>
{/if}
