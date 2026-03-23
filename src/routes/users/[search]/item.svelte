<script lang="ts">
  import Card from "$lib/components/ui/Card.svelte";
  import type { Item } from "$lib/types/Item";

  type Props = {
    item: Item;
    amount: bigint | number;
    style?: string;
    class?: string;
    overlay?: string;
  };

  let { item, amount, style = "", class: classes = "", overlay }: Props = $props();
</script>

<Card
  mode="li"
  class={`group relative flex flex-col items-center justify-center gap-1.5 overflow-hidden p-1 text-center text-sm md:p-2 ${classes}`}
  {style}
>
  <img
    src={item.emoji}
    alt=""
    decoding="async"
    loading="lazy"
    class="h-8 object-contain pt-1.5 pb-0.5"
  />

  <h3 class="text-base-content/75 text-xs">{item.name}</h3>

  <span class="block font-mono text-xs md:text-sm">{amount.toLocaleString()}</span>

  {#if overlay}
    <div
      class="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 bg-black/80 p-2 text-[11px] text-white opacity-0 backdrop-blur-[3px] duration-150 group-focus-within:opacity-100 group-hover:opacity-100"
    >
      <p class="text-center whitespace-pre-line">{overlay}</p>
    </div>
  {/if}

  <a href="/items/{item.id}" class="absolute top-0 left-0 block h-full w-full">
    <span class="sr-only">{item.name}</span>
  </a>
</Card>
