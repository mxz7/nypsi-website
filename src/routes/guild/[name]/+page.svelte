<script lang="ts">
  import { page } from "$app/stores";
  import Loading from "$lib/components/Loading.svelte";
  import Guild from "$lib/components/guild/Guild.svelte";
  import { userSearchTerm } from "$lib/data/stores.js";
  import type { ApiGuildResponse } from "$lib/types/Guild.js";
  import { fade, fly } from "svelte/transition";

  export let data;
  let title = `${$page.params.name} | nypsi`;

  async function updateTags(userData: Promise<ApiGuildResponse> | ApiGuildResponse) {
    const data = await Promise.resolve(userData);
    if (!data.success) return;

    title = `${data.guild.guildName} | nypsi`;
    $userSearchTerm = data.guild.guildName;
  }

  $: updateTags(data.streamed.data);
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="og:title" content={title} />
</svelte:head>

{#await data.streamed.data}
  <div class="relative mt-16 w-full">
    <Loading fadeInSettings={{ delay: 100, duration: 200 }} fadeOutSettings={{ duration: 300 }} />
  </div>
{:then guildData}
  <div in:fade={{ delay: 0, duration: 200 }} out:fly={{ y: 15, duration: 250 }}>
    {#if !guildData.success}
      <div class="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 transform">
        <p class="text-xl font-bold text-slate-300">unknown guild</p>
      </div>
    {:else}
      <Guild {guildData}></Guild>
    {/if}
  </div>
{/await}
<!-- https://cdn.discordapp.com/emojis/1118558624197902347.png
https://cdn.discordapp.com/emojis/987046773157691452.png
https://cdn.discordapp.com/emojis/1118563689008734258.png -->
