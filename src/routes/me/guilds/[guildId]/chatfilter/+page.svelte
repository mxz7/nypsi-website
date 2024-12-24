<script lang="ts">
  import Table from "./Table.svelte";

  let { data } = $props();
</script>

<svelte:head>
  <title>{data.guild.name} chat filter | nypsi</title>
</svelte:head>

<h1 class="flex items-center gap-3 text-3xl font-bold text-white">
  <img
    src={data.guild.icon
      ? `https://cdn.discordapp.com/icons/${data.guild.id}/${data.guild.icon}`
      : "https://cdn.discordapp.com/avatars/678711738845102087/cb2dcd61010f2b89ceb1cd5ff15816cf.png?size=256"}
    alt=""
    class="h-12 w-12 rounded-xl"
  />
  <span>{data.guild.name} chat filter</span>
</h1>

<Table chatFilter={data.chatFilter} />
