<script lang="ts">
  import { getItemsRemote } from "$lib/api/items.remote";
  import type { Item } from "$lib/types/Item";
  import { onMount } from "svelte";

  let pets: Item[] = $state([]);

  onMount(async () => {
    pets = (await getItemsRemote()).filter((item) => item.role === "pet");
  });
</script>

<div class="grid grid-cols-1 gap-3 lg:grid-cols-2 mt-2">
  {#if pets.length === 0}
    <span class="loading loading-spinner"></span>
  {:else}
    {#each pets as pet (pet.id)}
      <a
        href="/items/{pet.id}"
        class="bg-base-200 hover:bg-base-300 flex items-center gap-3 rounded-lg p-3 duration-100"
        style:color="inherit"
        style:text-decoration="none"
      >
        <img src={pet.emoji} alt="" class="size-8 object-contain" loading="lazy" decoding="async" />

        <span>
          <span class="text-primary block font-semibold underline underline-offset-3"
            >{pet.name}</span
          >
          <span class="text-sm">{pet.longDesc}</span>
        </span>
      </a>
    {/each}
  {/if}
</div>
