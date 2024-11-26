<script lang="ts">
  import { userSearchTerm } from "$lib/state.svelte";
  import { fade } from "svelte/transition";
  import UserData from "./UserData.svelte";

  let { data } = $props();

  let title = $derived(`${data.baseUserData.lastKnownUsername} / nypsi`);

  $effect(() => {
    userSearchTerm.value = data.baseUserData.lastKnownUsername;
  });
</script>

<svelte:head>
  <title>{title || `${data.baseUserData.lastKnownUsername} / nypsi`}</title>
  <meta name="og:title" content="{data.baseUserData.lastKnownUsername}'s nypsi profile" />

  <meta name="og:image" content={data.baseUserData.avatar} />
  <meta property="og:image:width" content="128" />
  <meta property="og:image:height" content="128" />

  <link rel="canonical" href="https://nypsi.xyz/user/{data.baseUserData.id}" />
</svelte:head>

<div in:fade={{ delay: 0, duration: 200 }}>
  {#key data}
    <UserData
      baseData={data.baseUserData}
      userData={data.allUserData}
      items={data.items}
      gamesPromise={data.games}
      gamesBefore={data.gamesBefore}
    />
  {/key}
</div>
