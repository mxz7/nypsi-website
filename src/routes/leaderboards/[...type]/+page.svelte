<script lang="ts">
  import { onNavigate } from "$app/navigation";
  import { page } from "$app/state";
  import { getLeaderboardMetadata } from "$lib/api/leaderboards/leaderboards.remote";
  import Leaderboard from "./leaderboard.svelte";
  import { getData } from "./page.remote";

  let loading = $state(false);
  let currentNavigation: number | null = null;

  onNavigate((nav) => {
    if (nav.from.url.toString() === nav.to.url.toString()) return;
    if (!nav.to.url.pathname.startsWith("/leaderboards")) return;

    const id = Math.random();
    currentNavigation = id;

    let showTimeout: ReturnType<typeof setTimeout> | null = null;
    let shown = false;

    window.scrollTo({ top: 0, behavior: "smooth" });

    showTimeout = setTimeout(() => {
      shown = true;
      loading = true;
    }, 100);

    return () => {
      if (currentNavigation !== id) return;

      clearTimeout(showTimeout);

      if (!shown) {
        currentNavigation = null;
        return;
      }

      loading = false;
      currentNavigation = null;
    };
  });

  const normalizedType = $derived(page.params.type.replaceAll("/", "-"));
  const meta = $derived(await getLeaderboardMetadata(normalizedType));
  const leaderboardData = $derived(await getData(normalizedType));
</script>

<svelte:head>
  <title>{meta.title} | nypsi</title>
  <meta name="og:title" content="{meta.title} | nypsi" />
  <link rel="canonical" href="https://nypsi.xyz{page.url.pathname}" />
</svelte:head>

{#if !loading && leaderboardData.userPosition}
  <div class="bg-base-200 mt-4 mb-4 flex items-center justify-between rounded-lg px-4 py-3">
    <span class="text-base-content/75 text-sm uppercase">your position</span>
    <span class="font-mono text-sm md:text-base">
      #{leaderboardData.userPosition.position} <span class="text-base-content/75">•</span>
      {leaderboardData.userPosition.value}
      {#if meta.descriptor}
        <span class="text-base-content/75"> {meta.descriptor}</span>
      {/if}
    </span>
  </div>
{/if}

<Leaderboard
  title={meta.title}
  data={leaderboardData.data}
  userPosition={leaderboardData.userPosition}
  userRoute={meta.typeKind === "known" && normalizedType.includes("guilds") ? "/guilds" : "/users"}
  descriptor={meta.descriptor}
  {loading}
/>
