<script lang="ts">
  import { page } from "$app/state";
  import { getItemsRemote } from "$lib/api/items.remote";
  import { getMuseum } from "$lib/api/users.remote";
  import Item from "./item.svelte";

  const [museum, itemsData] = $derived(
    await Promise.all([getMuseum(page.params.search), getItemsRemote()]),
  );

  const items = $derived.by(() => {
    const museumMap = new Map(museum.map((entry) => [entry.itemId, entry]));

    return itemsData
      .filter((item) => item.museum)
      .map((item) => {
        const donated = museumMap.get(item.id);

        return {
          item,
          amount: donated?.amount ?? 0,
          completedAt: donated?.completedAt ?? null,
          favorited: donated?.favorited ?? null,
        };
      });
  });

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

  const completionCount = $derived.by(() => items.filter((item) => item.completedAt).length);
  const totalMuseumItems = $derived.by(() => items.length);
  const completionPercentage = $derived.by(() => {
    if (totalMuseumItems === 0) {
      return 0;
    }

    return (completionCount / totalMuseumItems) * 100;
  });

  const formatDate = (date: Date | string | null) => {
    if (!date) {
      return "not completed";
    }

    return `completed ${new Date(date).toLocaleDateString()}`;
  };
</script>

<section class="space-y-8">
  {#if featuredItems.length > 0}
    <ol class="mx-auto grid max-w-5xl grid-cols-10 gap-2">
      {#each featuredItems as { item, amount, completedAt }, index}
        {@const overlay = completedAt ? formatDate(completedAt) : null}
        {@const displayAmount = item.museum.no_overflow
          ? `${amount.toLocaleString()}/${item.museum.threshold.toLocaleString()}`
          : completedAt
            ? `${amount.toLocaleString()}`
            : `${amount.toLocaleString()}/${item.museum.threshold.toLocaleString()}`}

        <Item
          {item}
          amount={displayAmount}
          class={!completedAt ? "grayscale" : ""}
          {overlay}
          style={`grid-column: ${getFeaturedColumnStart(featuredItems.length, index)} / span 2;`}
        />
      {/each}
    </ol>
  {/if}

  <p class="text-base-content/60 -mb-0.5 pb-1 text-sm">
    {completionCount.toLocaleString()} / {totalMuseumItems.toLocaleString()} completed ({completionPercentage.toPrecision(
      3,
    )}%)
  </p>
  <ol class="grid grid-cols-3 gap-2 md:grid-cols-6">
    {#each items as { item, amount, completedAt }}
      {@const overlay = completedAt ? formatDate(completedAt) : null}
      {@const displayAmount = item.museum.no_overflow
        ? `${amount.toLocaleString()}/${item.museum.threshold.toLocaleString()}`
        : completedAt
          ? `${amount.toLocaleString()}`
          : `${amount.toLocaleString()}/${item.museum.threshold.toLocaleString()}`}

      <Item {item} amount={displayAmount} class={!completedAt ? "grayscale" : ""} {overlay} />
    {/each}
  </ol>
</section>
