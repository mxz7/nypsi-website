<script lang="ts">
  import { initialLoad } from "$lib/state.svelte";
  import type { GuildSuccess } from "$lib/types/Guild";
  import { inPlaceSort } from "fast-sort";
  import { cubicOut } from "svelte/easing";
  import { fly } from "svelte/transition";

  interface Props {
    guildData: GuildSuccess;
  }

  let { guildData }: Props = $props();

  const avatars: HTMLImageElement[] = $state([]);

  const handleFallbackImage = (el) =>
    (el.target.src = "https://cdn.discordapp.com/embed/avatars/0.png");
</script>

{#snippet guildStats()}
  <div class="flex flex-col justify-center gap-4 sm:flex-row">
    <div class="grow text-center">
      <h2 class="text-lg text-white">xp</h2>
      <p class="text-primary font-semibold">{guildData.guild.xp.toLocaleString()}</p>
    </div>
    <div class="grow text-center">
      <h2 class="text-lg text-white">money</h2>
      <p class="text-primary font-semibold">${guildData.guild.balance.toLocaleString()}</p>
    </div>
    <div class="grow text-center">
      <h2 class="text-lg text-white">tokens</h2>
      <p class="text-primary font-semibold">{guildData.guild.tokens.toLocaleString()}</p>
    </div>
  </div>
{/snippet}

{#snippet userStats()}
  <div
    class="[&>*:nth-child(1)]:text-primary flex flex-col justify-center gap-2 [&>*:nth-child(1)]:font-semibold"
  >
    {#each inPlaceSort(guildData.guild.members).desc( [(i) => i.contributedXp, (i) => i.contributedMoney], ) as member, index}
      <div class="bg-base-300 flex items-center gap-3 rounded-lg p-3">
        <img
          bind:this={avatars[index]}
          class="h-10 w-10 rounded-full"
          src={member.economy.user.avatar}
          alt="{member.economy.user.lastKnownUsername}'s avatar"
          onerror={handleFallbackImage}
          decoding="async"
          loading="lazy"
        />
        <a
          class="link-hover line-clamp-1 w-fit text-lg font-medium break-all"
          href="/user/{member.economy.user.lastKnownUsername}"
          >{member.economy.user.lastKnownUsername}</a
        >
        <p class="min-w-fit grow text-right text-sm md:text-base">
          {member.contributedXp.toLocaleString()}xp
          <br class="md:hidden" />${member.contributedMoney.toLocaleString()}
        </p>
      </div>
    {/each}
  </div>
{/snippet}

<div class="mx-3 mt-7 mb-10 flex flex-col gap-4 sm:mx-auto md:w-full md:max-w-3xl">
  <div
    class="border-primary/15 bg-base-200 hover:border-primary/30 flex w-full gap-2 rounded-lg border p-4 duration-300"
  >
    <div class="h-24 w-24 sm:h-36 sm:w-36">
      <img
        src={guildData.guild.avatarId
          ? `https://cdn.nypsi.xyz/${guildData.guild.avatarId}`
          : guildData.guild.owner.user.avatar}
        alt=""
        class="h-full w-full rounded-full"
        loading="eager"
        decoding="async"
        width="256"
        height="256"
      />
    </div>
    <div class="w-fit">
      <h1 class="line-clamp-1 text-3xl font-extrabold text-white sm:text-4xl">
        {guildData.guild.guildName}
      </h1>
      <p class="text-sm text-slate-200 sm:text-base">
        owned by <a
          href="/user/{guildData.guild.owner.user.lastKnownUsername}"
          class="link-hover link-primary font-medium"
          >{guildData.guild.owner.user.lastKnownUsername}</a
        >
      </p>
      <p class="text-xs text-slate-400 sm:text-sm">level {guildData.guild.level}</p>
      <p class="mt-3 text-sm md:text-base">{guildData.guild.motd}</p>
    </div>
  </div>

  {#key guildData}
    <div
      class="border-primary/5 bg-base-200 hover:border-primary/20 w-full rounded-lg border p-4 duration-300"
      in:fly|global={{ duration: initialLoad.value ? 0 : 300, y: 25, easing: cubicOut }}
    >
      {@render guildStats()}
    </div>

    <div
      class="border-primary/5 bg-base-200 hover:border-primary/20 w-full rounded-lg border p-4 duration-300"
      in:fly|global={{ duration: initialLoad.value ? 0 : 300, delay: 100, y: 25, easing: cubicOut }}
    >
      {@render userStats()}
    </div>
  {/key}
</div>

<style>
  @reference "../../../app.css";

  h2 {
    @apply font-semibold;
  }
</style>
