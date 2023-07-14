<script lang="ts">
  import Loading from "$lib/components/Loading.svelte";
  import UserData from "$lib/components/users/UserData.svelte";
  import { userSearchTerm } from "$lib/data/stores.js";
  import type { UserApiResponse } from "$lib/types/User.js";
  import { fade, fly } from "svelte/transition";

  export let data;
  let title = "nypsi profile";

  async function updateTags(userData: Promise<UserApiResponse> | UserApiResponse) {
    const data = await Promise.resolve(userData);
    if (data.message !== "success") return;

    title = `${data.lastKnownUsername}'s profile`;
    $userSearchTerm = data.lastKnownUsername;
  }

  $: updateTags(data.streamed.userData);
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

{#await data.streamed.userData}
  <Loading fadeInSettings={{ delay: 100, duration: 150 }} fadeOutSettings={{ duration: 300 }} />
{:then userData}
  <div in:fade={{ delay: 300, duration: 200 }} out:fly={{ y: 15, duration: 250 }}>
    {#if userData.message !== "success"}
      <div class="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 transform">
        <p class="text-xl font-bold text-gray-300">{userData.message}</p>
      </div>
    {:else}
      {#await data.streamed.items then items}
        <UserData {userData} {items} />
      {/await}
    {/if}
  </div>
{/await}
<!-- https://cdn.discordapp.com/emojis/1118558624197902347.png
https://cdn.discordapp.com/emojis/987046773157691452.png
https://cdn.discordapp.com/emojis/1118563689008734258.png -->
