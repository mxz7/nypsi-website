<script lang="ts">
  import { page } from "$app/state";
  import LeaderboardItemSearch from "$lib/components/items/leaderboard-item-search.svelte";
  import Main from "$lib/components/ui/Main.svelte";
  import { leaderboards, type LeaderboardsData } from "$lib/data/leaderboard";

  let { children } = $props();
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
              <LeaderboardItemSearch url={"/leaderboards/{item}"} />
            </ul>
          </details>
        </li>
      </ul>
    </nav>

    <div class="w-full">
      {@render children()}
    </div>
  </div>
</Main>
