<script lang="ts">
  import { browser } from "$app/environment";
  import { page } from "$app/state";
  import {
    getItemLeaderboard,
    getLeaderboard,
    getLeaderboardMetadata,
    type LeaderboardType,
  } from "$lib/api/leaderboards.remote";
  import type { LeaderboardData } from "$lib/types/LeaderboardData";
  import type { RemoteQuery } from "@sveltejs/kit";
  import BigLeaderboard from "./BigLeaderboard.svelte";

  const meta = $derived(await getLeaderboardMetadata(page.params.type));

  const leaderboardData = $derived.by(async () => {
    let promise: RemoteQuery<LeaderboardData>;
    if (meta.typeKind === "known") {
      promise = getLeaderboard(page.params.type as LeaderboardType);
    } else {
      promise = getItemLeaderboard(page.params.type);
    }

    if (browser) {
      return promise;
    }

    return await promise;
  });
</script>

<svelte:head>
  <title>{meta.title} | nypsi</title>
  <meta name="og:title" content="{meta.title} | nypsi" />
  <link rel="canonical" href="https://nypsi.xyz/leaderboards/{page.params.type}" />
</svelte:head>

<BigLeaderboard
  data={leaderboardData}
  title={meta.title}
  userRoute={meta.typeKind === "known" && page.params.type === "guilds" ? "/guilds" : "/users"}
  descriptor={meta.descriptor}
/>
