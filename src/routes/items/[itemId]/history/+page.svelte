<script lang="ts">
  import { page } from "$app/state";
  import { getItem } from "$lib/api/items.remote";
  import ItemMarket from "$lib/components/items/ItemMarket.svelte";
  import Card from "$lib/components/ui/Card.svelte";
  import Main from "$lib/components/ui/Main.svelte";
  import { Store } from "@lucide/svelte";
  import Charts from "./charts.svelte";

  const days = $derived(parseInt(page.url.searchParams.get("days") || "60"));

  const item = $derived(await getItem(page.params.itemId));
</script>

<svelte:head>
  <title>{item.name} history | nypsi</title>
</svelte:head>

<Main class="item-history-page space-y-4">
  <header class="flex justify-center gap-3">
    <div class="rounded-box bg-base-300 h-14 w-14 p-2">
      <img
        class="h-full w-full object-contain"
        src={item.emoji}
        alt=""
        decoding="sync"
        loading="eager"
      />
    </div>

    <h1 class="my-auto text-3xl font-bold text-white">{item.name} history</h1>
  </header>

  {#key days}
    <menu class="menu menu-horizontal rounded-box bg-base-200 mx-auto flex justify-center gap-2">
      {#each [14, 30, 60, 90, 69420] as option}
        {@const focused = days === option}
        <li>
          <a href="?days={option}" class={focused ? "menu-active" : ""}
            >{#if option === 69420}
              all time
            {:else}
              {option} days
            {/if}</a
          >
        </li>
      {/each}
    </menu>

    <Charts {days} itemId={page.params.itemId} />
  {/key}

  <Card mode="section" class="overflow-x-auto">
    <h2>
      <span class="icon">
        <Store class="text-primary" />
      </span>
      <span>market</span>
    </h2>

    <ItemMarket itemId={page.params.itemId} />
  </Card>
</Main>

<style>
  @reference "../../../../app.css";

  :global {
    .item-history-page {
      h2 {
        @apply mb-4 flex items-center gap-2 text-xl font-bold;

        .icon {
          @apply rounded-box bg-base-300 p-2;
        }
      }
    }
  }
</style>
