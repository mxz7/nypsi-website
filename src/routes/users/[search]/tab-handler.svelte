<script lang="ts">
  import { page } from "$app/state";
  import Inventory from "./inventory.svelte";

  type Item = { label: string; paramValue: string };

  const items: Item[] = [
    { label: "inventory", paramValue: "inventory" },
    { label: "museum", paramValue: "museum" },
    { label: "achievements", paramValue: "achievements" },
    { label: "leaderboards", paramValue: "leaderboards" },
  ];

  const activeTab = $derived(
    items.find((i) => i.paramValue === page.url.searchParams.get("tab")) || items[0],
  );
</script>

<nav class="mx-auto w-fit shadow">
  <ol class="menu menu-sm md:menu-md menu-horizontal bg-base-200 rounded-xl">
    {#each items as { paramValue, label }}
      <li>
        <a class={activeTab.paramValue === paramValue && "menu-active"} href="?tab={paramValue}">
          {label}
        </a>
      </li>
    {/each}
  </ol>
</nav>

{#if activeTab.label === "inventory"}
  <Inventory />
{/if}
