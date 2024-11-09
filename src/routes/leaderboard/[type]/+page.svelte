<script lang="ts">
  import { page } from "$app/stores";
  import { getTags } from "$lib/functions/tags";
  import { onMount } from "svelte";
  import BigLeaderboard from "./BigLeaderboard.svelte";

  let { data } = $props();

  onMount(() => {
    console.log(data);
  });
</script>

<div class="mt-10 flex w-full justify-center">
  <BigLeaderboard
    tags={getTags()}
    data={data.leaderboardData}
    title={"meow"}
    userRoute={$page.url.pathname.endsWith("guilds") ? "/guild" : "/user"}
    descriptor={"meow"}
  />
</div>
