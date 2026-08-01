<script lang="ts">
  import GuildSettings from "./guild-settings.svelte";
  import { getRecentModlogs } from "./modlogs.remote";
  import Table from "./modlogs/table.svelte";

  let { data } = $props();

  const settings = [{ name: "chat filter", href: "chatfilter" }];

  const modlogs = $derived(data.hasPermission ? await getRecentModlogs(data.guild.id) : []);
</script>

<svelte:head>
  <title>{data.guild.name} settings | nypsi</title>
</svelte:head>

<h1 class="flex items-center gap-3 text-3xl font-bold text-white">
  <img
    src={data.guild.icon
      ? `https://cdn.discordapp.com/icons/${data.guild.id}/${data.guild.icon}`
      : "https://cdn.discordapp.com/avatars/678711738845102087/cb2dcd61010f2b89ceb1cd5ff15816cf.png?size=256"}
    alt=""
    class="h-12 w-12 rounded-xl"
  />
  <span>{data.guild.name}</span>
</h1>

{#if data.hasPermission}
  <h2 class="mt-4 text-xl font-semibold text-white">settings</h2>
  <div class="mt-1 flex gap-4">
    {#each settings as setting (setting.href)}
      <a href="/me/guilds/{data.guild.id}/{setting.href}" class="btn">
        {setting.name}
      </a>
    {/each}
  </div>

  {#if data.dashboard}
    <h2 class="mt-8 text-xl font-semibold text-white">server settings</h2>
    {#key data.guild.id}
      <GuildSettings guildId={data.guild.id} dashboard={data.dashboard} />
    {/key}
  {/if}

  {#if modlogs.length > 0}
    <h2 class="mt-8 text-xl font-semibold text-white">recent modlogs</h2>

    {#key data.guild.id}
      <Table tableData={modlogs} />
    {/key}
  {/if}
{:else}
  <p class="text-error mt-4">you do not have the 'manage server' permission in {data.guild.name}</p>
{/if}
