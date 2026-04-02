<script lang="ts">
  import { getLeaderboard } from "$lib/api/leaderboards.remote";
  import { getTagsRemote } from "$lib/api/tags.remote";
  import BigLeaderboard from "../../[type]/BigLeaderboard.svelte";

  const title = "wordle wins";
  const descriptor = "wins";
  const tags = $derived(await getTagsRemote());
  const leaderboardData = $derived(getLeaderboard("wordle-wins"));
</script>

<svelte:head>
  <title>{title} | nypsi</title>
  <meta name="og:title" content="{title} | nypsi" />
  <link rel="canonical" href="https://nypsi.xyz/leaderboards/wordle/wins" />
</svelte:head>

<BigLeaderboard {tags} data={leaderboardData} {title} userRoute="/users" {descriptor} />
