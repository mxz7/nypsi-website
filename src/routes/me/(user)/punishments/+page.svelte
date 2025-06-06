<script lang="ts">
  import Punishment from "./Punishment.svelte";

  let { data } = $props();
</script>

<svelte:head>
  <title>your punishments | nypsi</title>
</svelte:head>

<h1 class="text-center text-3xl font-bold text-white">your punishments</h1>

{#if data.mutes.length === 0 && data.bans.length === 0}
  <p>you have no active punishments. yay!</p>
{:else}
  {#if data.mutes.length > 0}
    <section class="mt-4">
      <h2 class="text-xl font-semibold text-white">mutes</h2>

      <div class="grid grid-cols-2 gap-4">
        {#each data.mutes as mute}
          <Punishment
            name={mute.guild.name ?? mute.guildId}
            icon={mute.guild.icon}
            expires={new Date(mute.expire)}
          />
        {/each}
      </div>
    </section>
  {/if}

  {#if data.bans.length > 0}
    <section class="mt-4">
      <h2 class="text-xl font-semibold text-white">bans</h2>

      <div class="grid grid-cols-2 gap-4">
        {#each data.bans as ban}
          <Punishment
            name={ban.guild.name ?? ban.guildId}
            icon={ban.guild.icon}
            expires={new Date(ban.expire)}
          />
        {/each}
      </div>
    </section>
  {/if}
{/if}
