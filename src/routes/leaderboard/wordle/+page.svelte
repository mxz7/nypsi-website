<script lang="ts">
  import MiniLeaderboard from "../MiniLeaderboard.svelte";

  let { data } = $props();
</script>

<svelte:head>
  <title>leaderboards | nypsi</title>
  <meta name="og:title" content="leaderboards | nypsi" />
</svelte:head>

<div class="mt-8 flex w-full justify-center">
  <div class="grid w-full grid-cols-1 flex-wrap justify-center gap-16 lg:max-w-4xl lg:grid-cols-2">
    <MiniLeaderboard title="most wins" data={data.balance} tags={data.tags} limit={100} />
    <MiniLeaderboard title="fastest wins" data={data.prestige} tags={data.tags} limit={100} />
  </div>
</div>
