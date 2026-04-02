<script lang="ts">
  import { page } from "$app/state";
  import {
    getItemLeaderboard,
    getLeaderboard,
    getLeaderboardMetadata,
    type LeaderboardType,
  } from "$lib/api/leaderboards.remote";
  import { getTagsRemote } from "$lib/api/tags.remote";
  import BigLeaderboard from "./BigLeaderboard.svelte";

  const type = $derived(page.params.type);
  const meta = $derived(await getLeaderboardMetadata(type));
  const tags = $derived(await getTagsRemote());
  const leaderboardData = $derived.by(() => {
    if (meta.typeKind === "known") {
      return getLeaderboard(type as LeaderboardType);
    }
    return getItemLeaderboard(meta.itemId);
  });
</script>

<svelte:head>
  <title>{meta.title} | nypsi</title>
  <meta name="og:title" content="{meta.title} | nypsi" />
  <link rel="canonical" href="https://nypsi.xyz/leaderboards/{page.params.type}" />
</svelte:head>

<BigLeaderboard
  {tags}
  data={leaderboardData}
  title={meta.title}
  userRoute={meta.typeKind === "known" && type === "guilds" ? "/guilds" : "/users"}
  descriptor={meta.descriptor}
/>
