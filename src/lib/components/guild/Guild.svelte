<script lang="ts">
  import type { GuildSuccess } from "$lib/types/Guild";
  import { inPlaceSort } from "fast-sort";
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";

  export let guildData: GuildSuccess;

  const { guild } = guildData;

  const avatars: HTMLImageElement[] = [];

  const handleFallbackImage = (el) =>
    (el.target.src = "https://cdn.discordapp.com/embed/avatars/0.png");

  onMount(async () => {
    for (const avatar of avatars) {
      if (avatar.src.endsWith("avatars/0.png")) continue;
      const res = await fetch(avatar.src);

      if (!res.ok) avatar.src = "https://cdn.discordapp.com/embed/avatars/0.png";
    }
  });
</script>

<div class="mx-3 mb-10 mt-7 flex flex-col gap-4 sm:mx-auto sm:w-[50vw]">
  <div
    class="w-full rounded border border-slate-300 border-opacity-5 bg-slate-950 bg-opacity-25 p-4 duration-300 hover:border-accent hover:border-opacity-20 hover:bg-opacity-40"
    in:fly|global={{ delay: 300, duration: 500, y: 75 }}
  >
    <h1 class="text-bold text-center text-2xl">{guild.guildName} [{guild.level}]</h1>

    <h2 class="mt-2 flex w-full flex-row items-center justify-center gap-2 md:text-sm">
      owned by
      <a class="flex gap-1 text-accent" href="/user/{guild.owner.user.lastKnownUsername}"
        ><img
          class="m-0 h-5 rounded-full"
          alt="owner pfp"
          src={guild.owner.user.avatar}
          on:error={handleFallbackImage}
        />
        {guild.owner.user.lastKnownUsername}</a
      >
    </h2>

    <div class="mt-6 flex w-full justify-center">
      <h3 class="w-fit whitespace-pre-line">
        {guild.motd}
      </h3>
    </div>
  </div>

  <div
    class="w-full rounded border border-slate-300 border-opacity-5 bg-slate-950 bg-opacity-25 p-4 duration-300 hover:border-accent hover:border-opacity-20 hover:bg-opacity-40"
    in:fly|global={{ delay: 400, duration: 500, y: 75 }}
  >
    <div class="flex flex-col justify-center gap-4 sm:flex-row">
      <div class="grow text-center">
        <h2 class="text-lg">xp</h2>
        <p class="font-semibold text-accent">{guild.xp.toLocaleString()}</p>
      </div>
      <div class="grow text-center">
        <h2 class="text-lg">money</h2>
        <p class="font-semibold text-accent">${guild.balance.toLocaleString()}</p>
      </div>
      <div class="grow text-center">
        <h2 class="text-lg">tokens</h2>
        <p class="font-semibold text-accent">{guild.tokens.toLocaleString()}</p>
      </div>
    </div>
  </div>

  <div
    class="w-full rounded border border-slate-300 border-opacity-5 bg-slate-950 bg-opacity-25 p-4 duration-300 hover:border-accent hover:border-opacity-20 hover:bg-opacity-40"
    in:fly|global={{ delay: 500, duration: 500, y: 75 }}
  >
    <div
      class="flex flex-col justify-center gap-2 [&>*:nth-child(1)]:font-semibold [&>*:nth-child(1)]:text-accent"
    >
      {#each inPlaceSort(guild.members).desc( [(i) => i.contributedXp, (i) => i.contributedMoney], ) as member, index}
        <div class="flex items-center gap-3 rounded bg-slate-950 bg-opacity-50 p-3">
          <img
            bind:this={avatars[index]}
            class="h-10 w-10 rounded-full"
            src={member.economy.user.avatar}
            alt="{member.economy.user.lastKnownUsername}'s avatar"
            on:error={handleFallbackImage}
          />
          <a
            class="line-clamp-1 w-fit break-all text-lg"
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
