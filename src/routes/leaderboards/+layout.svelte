<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { getItemsRemote } from "$lib/api/items.remote";
  import ItemSearch from "$lib/components/items/ItemSearch.svelte";
  import Main from "$lib/components/ui/Main.svelte";
  import { leaderboards, type LeaderboardsData } from "$lib/data/leaderboard";
  import { fly } from "svelte/transition";

  let { children } = $props();

  const items = $derived(await getItemsRemote());
</script>

{#snippet renderLeaderboard(leaderboard: {
  name: string;
  path: string;
  children?: LeaderboardsData;
})}
  <li>
    {#if leaderboard.children}
      <details open={page.url.pathname.startsWith(leaderboard.path)}>
        <summary class={page.url.pathname.startsWith(leaderboard.path) ? "text-primary" : ""}
          >{leaderboard.name.replaceAll("-", " ")}</summary
        >
        <ul>
          {#each Object.values(leaderboard.children) as child}
            {@render renderLeaderboard(child)}
          {/each}
        </ul>
      </details>
    {:else}
      <a
        data-sveltekit-preload-code="viewport"
        class={leaderboard.path === page.url.pathname ? "text-primary" : ""}
        href={leaderboard.path}
      >
        {leaderboard.name.replaceAll("-", " ")}
      </a>
    {/if}
  </li>
{/snippet}

<Main>
  <div class="flex gap-8">
    <!-- Desktop Navigation -->
    <nav class="hidden lg:block">
      <ul class="menu rounded-box bg-base-200 h-fit w-56 p-4">
        <li><h2 class="menu-title">leaderboards</h2></li>
        {#each Object.values(leaderboards) as leaderboard}
          {@render renderLeaderboard(leaderboard)}
        {/each}
        <li>
          <details
            open={!Object.values(leaderboards).some((l) => page.url.pathname.startsWith(l.path)) &&
              page.url.pathname !== "/leaderboards"}
          >
            <summary
              class={!Object.values(leaderboards).some((l) =>
                page.url.pathname.startsWith(l.path),
              ) && page.url.pathname !== "/leaderboards"
                ? "text-primary"
                : ""}>items</summary
            >
            <ul>
              <li class="py-1">
                <ItemSearch
                  {items}
                  onClick={async (itemId) => {
                    return goto(`/leaderboards/${itemId}`);
                  }}
                />
              </li>
            </ul>
          </details>
        </li>
      </ul>
    </nav>

    {#key page.url.pathname}
      <div in:fly={{ duration: 400, y: 25 }} class="w-full">
        {@render children()}
      </div>
    {/key}
  </div>
</Main>
