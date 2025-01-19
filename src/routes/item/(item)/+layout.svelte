<script lang="ts">
  import { browser } from "$app/environment";
  import { page } from "$app/state";
  import { items } from "$lib/state.svelte";
  import { sort } from "fast-sort";
  import { Search } from "lucide-svelte";
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
    <label class="input mb-4 mt-8 flex w-full items-center gap-2 rounded-box bg-base-200">
      <Search class="text-base-content" />
      <input type="text" class="grow" placeholder="search" bind:value={search} />
    </label>

    <div class="flex h-fit flex-col-reverse gap-4 md:flex-row">
      <div class="grid h-fit flex-initial grow grid-cols-3 gap-3 lg:grid-cols-4 xl:grid-cols-4">
        {#each filteredItems as item (item.id)}
          <a
            data-sveltekit-noscroll={browser ? (innerWidth > 640 ? true : false) : false}
            href="/item/{item.id}"
            class="w-full overflow-hidden rounded-box border border-primary border-opacity-5 bg-base-200 duration-300 hover:border-opacity-25 {page
              .params.itemId === item.id
              ? 'border-opacity-50 hover:border-opacity-50'
              : ''}"
          >
            <div class="h-16 bg-base-300 p-3">
              <img
                src={item.emoji}
                alt={item.id}
                decoding="async"
                loading="lazy"
                class="h-full w-full object-contain"
              />
            </div>
            <span class="block w-full truncate p-2 text-center text-xs lg:text-sm">{item.name}</span
            >
          </a>
        {/each}
      </div>
      <div class="md:w-1/3">
        {@render children()}
      </div>
    </div>
  </div>
</div>
