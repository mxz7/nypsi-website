<script lang="ts">
  import type { GuildSuccess } from "$lib/types/Guild";
  import { inPlaceSort } from "fast-sort";
  import { fly } from "svelte/transition";

  interface Props {
    guildData: GuildSuccess;
  }

  let { guildData }: Props = $props();

  const { guild } = guildData;

  const avatars: HTMLImageElement[] = $state([]);

  const handleFallbackImage = (el) =>
    (el.target.src = "https://cdn.discordapp.com/embed/avatars/0.png");
</script>

<div class="mx-3 mb-10 mt-7 flex flex-col gap-4 sm:mx-auto md:w-full md:max-w-3xl">
  <div
    class="w-full rounded-lg border border-primary border-opacity-5 bg-base-200 p-4 duration-300 hover:border-primary hover:border-opacity-20"
    in:fly|global={{ delay: 300, duration: 500, y: 75 }}
  >
    <h1 class="text-center text-2xl font-bold text-white">{guild.guildName} [{guild.level}]</h1>

    <p class="mt-2 flex w-full flex-row items-center justify-center gap-2 md:text-sm">
      owned by
      <a
        class="link-hover flex gap-1 font-medium text-primary"
        href="/user/{guild.owner.user.lastKnownUsername}"
        ><img
          class="m-0 h-5 rounded-full"
          alt="owner pfp"
          src={guild.owner.user.avatar}
          onerror={handleFallbackImage}
          decoding="async"
          loading="lazy"
        />
        {guild.owner.user.lastKnownUsername}</a
      >
    </p>

    <div class="mt-6 flex w-full justify-center">
      <p class="w-fit whitespace-pre-line">
        {guild.motd}
      </p>
    </div>
  </div>

  <div
    class="w-full rounded-lg border border-primary border-opacity-5 bg-base-200 p-4 duration-300 hover:border-primary hover:border-opacity-20"
    in:fly|global={{ delay: 400, duration: 500, y: 75 }}
  >
    <div class="flex flex-col justify-center gap-4 sm:flex-row">
      <div class="grow text-center">
        <h2 class="text-lg text-white">xp</h2>
        <p class="font-semibold text-primary">{guild.xp.toLocaleString()}</p>
      </div>
      <div class="grow text-center">
        <h2 class="text-lg text-white">money</h2>
        <p class="font-semibold text-primary">${guild.balance.toLocaleString()}</p>
      </div>
      <div class="grow text-center">
        <h2 class="text-lg text-white">tokens</h2>
        <p class="font-semibold text-primary">{guild.tokens.toLocaleString()}</p>
      </div>
    </div>
  </div>

  <div
    class="w-full rounded-lg border border-primary border-opacity-5 bg-base-200 p-4 duration-300 hover:border-primary hover:border-opacity-20"
    in:fly|global={{ delay: 500, duration: 500, y: 75 }}
  >
    <div
      class="flex flex-col justify-center gap-2 [&>*:nth-child(1)]:font-semibold [&>*:nth-child(1)]:text-primary"
    >
      {#each inPlaceSort(guild.members).desc( [(i) => i.contributedXp, (i) => i.contributedMoney], ) as member, index}
        <div class="flex items-center gap-3 rounded-lg bg-base-300 p-3">
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
            class="link-hover line-clamp-1 w-fit break-all text-lg font-medium"
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
  </div>
</div>

<style>
  h2 {
    @apply font-semibold;
  }
</style>
