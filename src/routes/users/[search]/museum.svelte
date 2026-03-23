<script lang="ts">
  import { page } from "$app/state";
  import { getItemsRemote } from "$lib/api/items.remote";
  import { getMuseum } from "$lib/api/users.remote";
  import Item from "./item.svelte";

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

<section class="space-y-8">
  {#if featuredItems.length > 0}
    <section>
      <h2 class="sr-only">featured</h2>

      <ol class="mx-auto grid max-w-5xl grid-cols-10 gap-2">
        {#each featuredItems as { item, amount, completedAt }, index}
          <Item
            {item}
            {amount}
            class={!completedAt ? "grayscale" : ""}
            overlay={`items donated: ${amount.toLocaleString()}\n${formatDate(completedAt)}`}
            style={`grid-column: ${getFeaturedColumnStart(featuredItems.length, index)} / span 2;`}
          />
        {/each}
      </ol>
    </section>
  {/if}

  <section class="mt-4">
    <h2 class="sr-only">all items</h2>

    <ol class="grid grid-cols-3 gap-2 md:grid-cols-5">
      {#each items as { item, amount, completedAt }}
        <Item
          {item}
          {amount}
          class={!completedAt ? "grayscale" : ""}
          overlay={`items donated: ${amount.toLocaleString()}\n${formatDate(completedAt)}`}
        />
      {/each}
    </ol>
  </section>
</section>
