<script lang="ts">
  import { page } from "$app/stores";
  import { getTags } from "$lib/functions/tags";
  import { items } from "$lib/state.svelte";
  import { onMount } from "svelte";
  import BigLeaderboard from "./BigLeaderboard.svelte";

  let { data } = $props();

  onMount(() => {
    if (data.items && !items.value) items.value = data.items;
  });
</script>

<svelte:head>
  <title>{data.title} / nypsi</title>
</svelte:head>

<div class="mt-10 flex w-full justify-center">
  <BigLeaderboard
    tags={getTags()}
    data={data.leaderboardData}
    title={data.title}
    userRoute={$page.url.pathname.endsWith("guilds") ? "/guild" : "/user"}
    descriptor={data.descriptor}
  />
</div>
