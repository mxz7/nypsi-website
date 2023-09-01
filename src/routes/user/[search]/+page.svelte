<script lang="ts">
  import UserData from "$lib/components/users/UserData.svelte";
  import { fade, fly } from "svelte/transition";

  export let data;

  $: title = `${data.user.lastKnownUsername} | nypsi`;
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="og:title" content={title} />
</svelte:head>

<div in:fade={{ delay: 0, duration: 200 }} out:fly={{ y: 15, duration: 250 }}>
  <UserData baseData={data.user} userData={data.streamed.allUserData} items={data.items} />
</div>
