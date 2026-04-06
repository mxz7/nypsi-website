<script lang="ts">
  import Card from "$lib/components/ui/Card.svelte";
  import { canModifyGuild } from "$lib/functions/discordapi/permissions.js";
  import { guildsData } from "$lib/state.svelte.js";
  import type { DiscordGuild } from "$lib/types/Discord.js";
  import { onMount } from "svelte";

  let { data } = $props();

  onMount(() => {
    guildsData.value = data.guilds;
  });

  const allowedGuilds = $derived(data.guilds.filter((g) => canModifyGuild(g)));
  const notAllowedGuilds = $derived(data.guilds.filter((g) => !canModifyGuild(g)));
</script>

<svelte:head>
  <title>server management | nypsi</title>
</svelte:head>

{#snippet guild(guild: DiscordGuild, allowed: boolean)}
  <li>
    <Card
      mode="anchor"
      href="/me/guilds/{guild.id}"
      class="bg-base-200 flex items-center gap-4 rounded-lg p-2 {allowed
        ? ''
        : 'cursor-not-allowed opacity-70'}"
    >
      <img
        src={guild.icon
          ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}`
          : "https://cdn.discordapp.com/avatars/678711738845102087/cb2dcd61010f2b89ceb1cd5ff15816cf.png?size=256"}
        alt=""
        height="256"
        width="256"
        class="h-16 w-16 rounded-xl"
      />
      <h2 class="text-lg font-semibold">{guild.name}</h2>
    </Card>
  </li>
{/snippet}

<h1 class="text-3xl font-bold text-white">server management</h1>

<ul class="mt-4 grid w-full grid-cols-2 gap-4">
  {#each allowedGuilds as guildData}
    {@render guild(guildData, true)}
  {/each}
</ul>

<h2 class="mt-6 text-2xl font-bold">unavailable servers</h2>
<p class="text-base-content/75 text-sm">
  you don't have the 'manage server' permission in these servers
</p>

<ul class="mt-4 grid w-full grid-cols-2 gap-4">
  {#each notAllowedGuilds as guildData}
    {@render guild(guildData, false)}
  {/each}
</ul>
