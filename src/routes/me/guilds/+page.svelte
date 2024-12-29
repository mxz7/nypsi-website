<script lang="ts">
  import { guildsData } from "$lib/state.svelte.js";

  let { data } = $props();

  $effect(() => {
    guildsData.value = data.guilds;
  });
</script>

<svelte:head>
  <title>server management | nypsi</title>
</svelte:head>

<h1 class="text-3xl font-bold text-white">server management</h1>

<p>choose a server to continue. you must have the 'manage server' permission</p>

<div class="mt-4 grid w-full grid-cols-2 gap-4">
  {#each data.guilds as guild}
    <a
      href="/me/guilds/{guild.id}"
      class="flex items-center gap-4 rounded-lg bg-base-200 p-2 {(parseInt(guild.permissions) &
        0x20) ==
      0x20
        ? ''
        : 'cursor-not-allowed'}"
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
    </a>
  {/each}
</div>
