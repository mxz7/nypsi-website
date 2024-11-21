<script lang="ts">
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

{#key guildData}
  <div class="mx-3 mb-10 mt-7 flex flex-col gap-4 sm:mx-auto md:w-full md:max-w-3xl">
    <div
      class="flex w-full gap-2 rounded-lg border border-primary border-opacity-15 bg-base-200 p-4 duration-300 hover:border-primary hover:border-opacity-30"
    >
      <div class="h-24 w-24 sm:h-36 sm:w-36">
        <img
          src={guildData.guild.avatarId
            ? `https://cdn.nypsi.xyz/${guildData.guild.avatarId}`
            : guildData.guild.owner.user.avatar}
          alt=""
          class="h-full w-full rounded-full"
          loading="eager"
          decoding="sync"
          fetchpriority="high"
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

    <div
      class="w-full rounded-lg border border-primary border-opacity-5 bg-base-200 p-4 duration-300 hover:border-primary hover:border-opacity-20"
      in:fly={{ duration: 300, y: 25, easing: cubicOut }}
    >
      <div class="flex flex-col justify-center gap-4 sm:flex-row">
        <div class="grow text-center">
          <h2 class="text-lg text-white">xp</h2>
          <p class="font-semibold text-primary">{guildData.guild.xp.toLocaleString()}</p>
        </div>
        <div class="grow text-center">
          <h2 class="text-lg text-white">money</h2>
          <p class="font-semibold text-primary">${guildData.guild.balance.toLocaleString()}</p>
        </div>
        <div class="grow text-center">
          <h2 class="text-lg text-white">tokens</h2>
          <p class="font-semibold text-primary">{guildData.guild.tokens.toLocaleString()}</p>
        </div>
      </div>
    </div>

    <div
      class="w-full rounded-lg border border-primary border-opacity-5 bg-base-200 p-4 duration-300 hover:border-primary hover:border-opacity-20"
      in:fly={{ duration: 300, delay: 100, y: 25, easing: cubicOut }}
    >
      <div
        class="flex flex-col justify-center gap-2 [&>*:nth-child(1)]:font-semibold [&>*:nth-child(1)]:text-primary"
      >
        {#each inPlaceSort(guildData.guild.members).desc( [(i) => i.contributedXp, (i) => i.contributedMoney], ) as member, index}
          <div
            class="flex items-center gap-3 rounded-lg bg-base-300 p-3"
            in:fly={{ delay: (index + 1) * 100, duration: 1250, y: 25, easing: cubicOut }}
          >
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
{/key}

<style>
  h2 {
    @apply font-semibold;
  }
</style>
