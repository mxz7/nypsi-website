<script lang="ts">
  import MiniLeaderboard from "./MiniLeaderboard.svelte";

  let { data } = $props();
</script>

<svelte:head>
  <title>leaderboards | nypsi</title>
  <meta name="og:title" content="leaderboards | nypsi" />
  <meta
    name="description"
    content="view nypsi's leaderboards for balance, guilds, networth, streaks, items and more"
  />

  <link rel="canonical" href="https://nypsi.xyz/leaderboards" />
</svelte:head>

<div class="mt-8 flex w-full justify-center">
  <div class="grid w-full grid-cols-1 flex-wrap justify-center gap-16 lg:max-w-4xl lg:grid-cols-2">
    <MiniLeaderboard title="top balance" data={data.balance} tags={data.tags} />
    <MiniLeaderboard title="top guilds" data={data.guilds} tags={data.tags} href="/guilds/" />
  </div>
</div>
