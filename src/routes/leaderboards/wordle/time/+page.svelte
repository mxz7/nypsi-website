<script lang="ts">
  import { getLeaderboard } from "$lib/api/leaderboards.remote";
  import { getTagsRemote } from "$lib/api/tags.remote";
  import BigLeaderboard from "../../[type]/BigLeaderboard.svelte";

  const title = "wordle fastest wins";
  const tags = $derived(await getTagsRemote());
  const leaderboardData = $derived(getLeaderboard("wordle-time"));
</script>

<svelte:head>
  <title>{title} | nypsi</title>
  <meta name="og:title" content="{title} | nypsi" />
  <link rel="canonical" href="https://nypsi.xyz/leaderboards/wordle/time" />
</svelte:head>

<BigLeaderboard {tags} data={leaderboardData} {title} userRoute="/users" />
