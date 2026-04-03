<script lang="ts">
  import { onNavigate } from "$app/navigation";
  import { page } from "$app/state";
  import { getLeaderboardMetadata } from "$lib/api/leaderboards.remote";
  import BigLeaderboard from "./BigLeaderboard.svelte";
  import { getData } from "./page.remote";

  let loading = $state(false);
  let currentNavigation: number | null = null;

  onNavigate((nav) => {
    if (nav.from.url.toString() === nav.to.url.toString()) return;

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

  const meta = $derived(await getLeaderboardMetadata(page.params.type));
</script>

<svelte:head>
  <title>{meta.title} | nypsi</title>
  <meta name="og:title" content="{meta.title} | nypsi" />
  <link rel="canonical" href="https://nypsi.xyz/leaderboards/{page.params.type}" />
</svelte:head>

<BigLeaderboard
  title={meta.title}
  data={await getData(page.params.type)}
  userRoute={meta.typeKind === "known" && page.params.type === "guilds" ? "/guilds" : "/users"}
  descriptor={meta.descriptor}
  {loading}
/>
