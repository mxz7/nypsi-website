<script lang="ts">
  import { page } from "$app/state";
  import Guild from "./guild.svelte";
  import Inventory from "./inventory.svelte";
  import Museum from "./museum.svelte";

  type Item = { label: string; paramValue: string };

  type Props = {
    username: string;
    guildName?: string;
  };

  let { username, guildName }: Props = $props();

  const items: Item[] = [
    { label: "guild", paramValue: "guild" },
    { label: "inventory", paramValue: "inventory" },
    { label: "museum", paramValue: "museum" },
    { label: "achievements", paramValue: "achievements" },
    { label: "leaderboards", paramValue: "leaderboards" },
  ];

  const activeTab = $derived(
    items.find((i) => i.paramValue === page.url.searchParams.get("tab")) ||
      (guildName ? items[0] : items[1]),
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

{#if activeTab.label === "guild"}
  {#if guildName}
    <Guild {guildName} />
  {:else}
    <p class="text-center">
      <span class="text-primary font-medium">{username}</span>
      is not in a guild {"):"}
    </p>
  {/if}
{:else if activeTab.label === "inventory"}
  <Inventory />
{:else if activeTab.label === "museum"}
  <Museum />
{/if}
