<script lang="ts">
  import { getTags } from "$lib/functions/tags";
  import MiniLeaderboard from "./MiniLeaderboard.svelte";

  let { data } = $props();
</script>

<svelte:head>
  <title>leaderboards / nypsi</title>
</svelte:head>

<div class="mt-8 flex w-full justify-center">
  <div class="grid w-full grid-cols-1 flex-wrap justify-center gap-16 lg:max-w-4xl lg:grid-cols-2">
    <MiniLeaderboard title="top balance" data={data.balance} tags={getTags()} />
    <MiniLeaderboard title="top level" data={data.prestige} tags={getTags()} />
  </div>
</div>

<!-- {#if options.find((o) => o.selected)}
  {@const selected = options.find((o) => o.selected)}
  {#if !(selected.showItems && !$page.url.searchParams.has("item"))}
    <div class="mt-10 flex w-full justify-center">
      <BigLeaderboard
        tags={getTags()}
        data={data[`lb-${selected.data || selected.name}`] || new Promise(() => {})}
        title={selected.name === "items"
          ? `top ${data.items.find((i) => i.id === $page.url.searchParams.get("item"))?.name}`
          : selected.leaderboardName}
        userRoute={selected.name === "guilds" ? "/guild" : "/user"}
        descriptor={selected.descriptor}
      />
    </div>
  {/if}
{/if} -->
