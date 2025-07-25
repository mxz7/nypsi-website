<script lang="ts">
  import { browser } from "$app/environment";
  import { page } from "$app/state";
  import { items } from "$lib/state.svelte";
  import { Search } from "@lucide/svelte";
  import { sort } from "fast-sort";
  import { onMount } from "svelte";

  let { children, data } = $props();

  onMount(() => {
    if (!items?.value) items.value = data.items;
  });

  let search: string = $state();

  const filteredItems = $derived(
    (search || "").length === 0
      ? data.items
      : sort(
          data.items.filter(
            (i) =>
              i.name.includes(search.toLowerCase()) ||
              i.id.startsWith(search.toLowerCase()) ||
              i.role.includes(search.toLowerCase()),
          ),
        ).desc((i) => {
          let score = 0;

          if (i.name.startsWith(search.toLowerCase())) {
            score += search.length;
          }

          if (i.role.startsWith(search.toLowerCase())) {
            score += search.length / 1.5;
          }

          return score;
        }),
  );
</script>

<div class="flex w-full justify-center">
  <div class="w-full px-4 lg:max-w-6xl lg:px-0">
    <label class="input rounded-box bg-base-200 mt-8 mb-4 flex w-full items-center gap-2">
      <Search class="text-base-content" />
      <input type="text" class="grow" placeholder="search" bind:value={search} />
    </label>

    <div class="flex h-fit flex-col gap-4 md:flex-row-reverse">
      <main class="md:w-1/3">
        {@render children()}
      </main>

      <nav class="flex-initial grow">
        <ol class="grid h-fit w-full flex-initial grid-cols-3 gap-3 lg:grid-cols-4 xl:grid-cols-4">
          {#each filteredItems as item (item.id)}
            <li
              class="rounded-box border-primary/5 bg-base-200 hover:border-primary/25 w-full overflow-hidden border duration-300 {page
                .params.itemId === item.id
                ? 'border-primary/50 hover:border-primary/50'
                : ''}"
            >
              <a
                href="/items/{item.id}"
                data-sveltekit-noscroll={browser ? (innerWidth > 640 ? true : false) : false}
              >
                <div class="bg-base-300 h-16 p-3">
                  <img
                    src={item.emoji}
                    alt=""
                    decoding="async"
                    loading="lazy"
                    class="h-full w-full object-contain"
                  />
                </div>
                <span class="block w-full truncate p-2 text-center text-xs lg:text-sm"
                  >{item.name}</span
                >
              </a>
            </li>
          {/each}
        </ol>
      </nav>
    </div>
  </div>
</div>
