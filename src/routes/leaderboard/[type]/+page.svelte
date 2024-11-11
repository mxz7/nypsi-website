<script lang="ts">
  import { page } from "$app/stores";
  import { getTags } from "$lib/functions/tags";
  import { items } from "$lib/state.svelte";
  import { getContext, onMount } from "svelte";
  import BigLeaderboard from "./BigLeaderboard.svelte";

  let { data } = $props();

  let options: {
    name: string;
    leaderboardName: string;
    selected: boolean;
    showItems: boolean;
    data?: string;
    descriptor?: string;
    path?: string;
  }[] = getContext("leaderboard-options");

  let selected = $derived(options.find((i) => i.selected));

  onMount(() => {
    if (data.items && !items.value) items.value = data.items;
  });
</script>

<svelte:head>
  <title>{data.item ? `top ${data.item.name}` : selected.leaderboardName} / nypsi</title>
</svelte:head>

<div class="mt-10 flex w-full justify-center">
  <BigLeaderboard
    tags={getTags()}
    data={data.leaderboardData}
    title={data.item ? `top ${data.item.name}` : selected.leaderboardName}
    userRoute={$page.url.pathname.endsWith("guilds") ? "/guild" : "/user"}
    descriptor={data.item ? data.item.plural || data.item.name + "s" : selected.descriptor}
  />
</div>
