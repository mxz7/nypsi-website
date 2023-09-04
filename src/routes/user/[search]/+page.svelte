<script lang="ts">
  import UserData from "$lib/components/users/UserData.svelte";
  import { userSearchTerm } from "$lib/data/stores.js";
  import { fade, fly } from "svelte/transition";

  export let data;

  $: title = `${data.baseUserData.lastKnownUsername} / nypsi`;
  $userSearchTerm = data.baseUserData.lastKnownUsername;
</script>

<svelte:head>
  <title>{title || `${data.baseUserData.lastKnownUsername} / nypsi`}</title>
  <meta name="og:title" content="{data.baseUserData.lastKnownUsername}'s nypsi profile" />

  <meta name="description" content="view {data.baseUserData.lastKnownUsername}'s nypsi profile" />
  <meta
    name="og:description"
    content="view {data.baseUserData.lastKnownUsername}'s nypsi profile"
  />

  <meta name="og:site_name" content="nypsi" />
  <meta name="og:image" content={data.baseUserData.avatar} />
  <meta property="og:image:width" content="128" />
  <meta property="og:image:height" content="128" />
</svelte:head>

<div in:fade={{ delay: 0, duration: 200 }} out:fly={{ y: 15, duration: 250 }}>
  <UserData baseData={data.baseUserData} userData={data.streamed.allUserData} items={data.items} />
</div>
