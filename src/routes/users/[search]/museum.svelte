<script lang="ts">
  import { page } from "$app/state";
  import { getItemsRemote } from "$lib/api/items.remote";
  import { getMuseum } from "$lib/api/users.remote";
  import Card from "$lib/components/ui/Card.svelte";
  import type { Item } from "$lib/types/Item";

  const [museum, itemsData] = $derived(
    await Promise.all([getMuseum(page.params.search), getItemsRemote()]),
  );

  const items = $derived.by(() =>
    museum
      .map((entry) => {
        const item = itemsData.find((i) => i.id === entry.itemId);

        if (!item) {
          return null;
        }

        return { ...entry, item };
      })
      .filter((entry) => entry !== null),
  );

  const featuredItems = $derived.by(() =>
    [...items.filter((item) => item.favorited !== null)]
      .sort((a, b) => a.favorited - b.favorited)
      .slice(0, 5),
  );

  const featuredGridStarts = new Map<number, number[]>([
    [1, [5]],
    [2, [4, 6]],
    [3, [3, 5, 7]],
    [4, [2, 4, 6, 8]],
    [5, [1, 3, 5, 7, 9]],
  ]);

  const getFeaturedColumnStart = (count: number, index: number) =>
    featuredGridStarts.get(count)?.[index] ?? index + 1;

  const formatDate = (date: Date | string | null) => {
    if (!date) {
      return "not completed";
    }

    return `completed ${new Date(date).toLocaleDateString()}`;
  };
</script>

{#snippet museumItemCard(item: Item, amount: bigint, completedAt: Date | string | null, style = "")}
  <Card
    mode="li"
    class={`group relative flex flex-col items-center justify-center gap-1.5 overflow-hidden p-1 text-center text-sm md:p-2 ${
      !completedAt ? "grayscale" : ""
    }`}
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

    <div
      class="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 bg-black/80 p-2 text-[11px] text-white opacity-0 backdrop-blur-[3px] duration-150 group-focus-within:opacity-100 group-hover:opacity-100"
    >
      <p>items donated: {amount.toLocaleString()}</p>
      <p>{formatDate(completedAt)}</p>
    </div>

    <a href="/items/{item.id}" class="absolute top-0 left-0 block h-full w-full">
      <span class="sr-only">{item.name}</span>
    </a>
  </Card>
{/snippet}

<section class="space-y-8">
  {#if featuredItems.length > 0}
    <section>
      <h2 class="sr-only">featured</h2>

      <ol class="mx-auto grid max-w-5xl grid-cols-10 gap-2">
        {#each featuredItems as { item, amount, completedAt }, index}
          {@render museumItemCard(
            item,
            amount,
            completedAt,
            `grid-column: ${getFeaturedColumnStart(featuredItems.length, index)} / span 2;`,
          )}
        {/each}
      </ol>
    </section>
  {/if}

  <section class="mt-4">
    <h2 class="sr-only">all items</h2>

    <ol class="grid grid-cols-3 gap-2 md:grid-cols-5">
      {#each items as { item, amount, completedAt }}
        {@render museumItemCard(item, amount, completedAt)}
      {/each}
    </ol>
  </section>
</section>
