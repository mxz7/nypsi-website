<script lang="ts">
  import { page } from "$app/state";
  import { items } from "$lib/state.svelte";
  import { onMount } from "svelte";
  import BigLeaderboard from "./BigLeaderboard.svelte";

  let { data } = $props();

  onMount(() => {
    if (data.items && !items.value) items.value = data.items;
  });
</script>

<svelte:head>
  <title>{data.title} | nypsi</title>
  <meta name="og:title" content="{data.title} | nypsi" />
</svelte:head>

<div class="mt-10 flex w-full justify-center">
  <BigLeaderboard
    tags={data.tags}
    data={data.leaderboardData}
    title={data.title}
    userRoute={page.url.pathname.endsWith("guilds") ? "/guilds" : "/users"}
    descriptor={data.descriptor}
  />
</div>
