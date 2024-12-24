<script lang="ts">
  import { preloadData } from "$app/navigation";
  import Table from "./modlogs/Table.svelte";

  let { data } = $props();

  const settings = [{ name: "chat filter", href: "/chat-filter" }];

  let modLogsData = $state<
    {
      user: string;
      caseId: number;
      type: string;
      moderator: string;
      command: string;
    }[]
  >([]);

  $effect(() => {
    modLogsData = [];
    preloadData(`/me/guilds/${data.guild.id}/modlogs`).then((result) => {
      if (result.type === "loaded" && result.status === 200) {
        modLogsData = result.data.modlogs;
      }
    });
  });
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
    {#each settings as setting}
      <a href={setting.href} class="btn">
        {setting.name}
      </a>
    {/each}
  </div>

  {#if modLogsData.length > 0}
    <h2 class="mt-4 text-xl font-semibold text-white">modlogs</h2>

    <Table tableData={modLogsData} />
  {/if}
{:else}
  <p class="mt-4 text-error">you do not have the 'manage server' permission in {data.guild.name}</p>
{/if}
