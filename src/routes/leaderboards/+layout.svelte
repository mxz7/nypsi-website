<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { getItemsRemote } from "$lib/api/items.remote";
  import ItemSearch from "$lib/components/items/ItemSearch.svelte";
  import Main from "$lib/components/ui/Main.svelte";
  import { fly } from "svelte/transition";

  let { children } = $props();

  const knownTypes = [
    "/leaderboards/balance",
    "/leaderboards/net-worth",
    "/leaderboards/level",
    "/leaderboards/guilds",
    "/leaderboards/streak",
    "/leaderboards/lottery",
    "/leaderboards/commands",
  ];

  const isItemPage = $derived(
    !knownTypes.includes(page.url.pathname) &&
      !page.url.pathname.startsWith("/leaderboards/vote") &&
      !page.url.pathname.startsWith("/leaderboards/wordle") &&
      page.url.pathname !== "/leaderboards",
  );

  const items = $derived(await getItemsRemote());
</script>

<Main>
  <div class="flex gap-8">
    <nav class="hidden lg:block">
      <ul class="menu rounded-box bg-base-200 h-fit w-56 p-4">
        <li><h2 class="menu-title">leaderboards</h2></li>
        <li>
          <a
            data-sveltekit-preload-code="viewport"
            class={page.url.pathname === "/leaderboards/balance" ? "text-primary" : ""}
            href="/leaderboards/balance">balance</a
          >
        </li>
        <li>
          <a
            data-sveltekit-preload-code="viewport"
            class={page.url.pathname === "/leaderboards/net-worth" ? "text-primary" : ""}
            href="/leaderboards/net-worth">net worth</a
          >
        </li>
        <li>
          <a
            data-sveltekit-preload-code="viewport"
            class={page.url.pathname === "/leaderboards/level" ? "text-primary" : ""}
            href="/leaderboards/level">level</a
          >
        </li>
        <li>
          <a
            data-sveltekit-preload-code="viewport"
            class={page.url.pathname === "/leaderboards/guilds" ? "text-primary" : ""}
            href="/leaderboards/guilds">guilds</a
          >
        </li>
        <li>
          <a
            data-sveltekit-preload-code="viewport"
            class={page.url.pathname === "/leaderboards/streak" ? "text-primary" : ""}
            href="/leaderboards/streak">daily streak</a
          >
        </li>
        <li>
          <a
            data-sveltekit-preload-code="viewport"
            class={page.url.pathname === "/leaderboards/lottery" ? "text-primary" : ""}
            href="/leaderboards/lottery">lottery</a
          >
        </li>
        <li>
          <a
            data-sveltekit-preload-code="viewport"
            class={page.url.pathname === "/leaderboards/commands" ? "text-primary" : ""}
            href="/leaderboards/commands">commands</a
          >
        </li>
        <li>
          <details open={page.url.pathname.startsWith("/leaderboards/vote")}>
            <summary
              class={page.url.pathname.startsWith("/leaderboards/vote") ? "text-primary" : ""}
              >vote</summary
            >
            <ul>
              <li>
                <a
                  data-sveltekit-preload-code="viewport"
                  class={page.url.pathname === "/leaderboards/vote/month" ? "text-primary" : ""}
                  href="/leaderboards/vote/month">votes this month</a
                >
              </li>
              <li>
                <a
                  data-sveltekit-preload-code="viewport"
                  class={page.url.pathname === "/leaderboards/vote/streak" ? "text-primary" : ""}
                  href="/leaderboards/vote/streak">vote streak</a
                >
              </li>
            </ul>
          </details>
        </li>
        <li>
          <details open={page.url.pathname.startsWith("/leaderboards/wordle")}>
            <summary
              class={page.url.pathname.startsWith("/leaderboards/wordle") ? "text-primary" : ""}
              >wordle</summary
            >
            <ul>
              <li>
                <a
                  data-sveltekit-preload-code="viewport"
                  class={page.url.pathname === "/leaderboards/wordle/wins" ? "text-primary" : ""}
                  href="/leaderboards/wordle/wins">wins</a
                >
              </li>
              <li>
                <a
                  data-sveltekit-preload-code="viewport"
                  class={page.url.pathname === "/leaderboards/wordle/time" ? "text-primary" : ""}
                  href="/leaderboards/wordle/time">fastest wins</a
                >
              </li>
            </ul>
          </details>
        </li>
        <li>
          <details open={isItemPage}>
            <summary class={isItemPage ? "text-primary" : ""}>items</summary>
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
      <div in:fly={{ duration: 400, y: 25 }} class="w-full min-w-0">
        {@render children()}
      </div>
    {/key}
  </div>
</Main>
