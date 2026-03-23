<script lang="ts">
  import { getGuildByName } from "$lib/api/guilds.remote";
  import Card from "$lib/components/ui/Card.svelte";

  type Props = {
    guildName: string;
  };

  let { guildName }: Props = $props();

  const guildData = $derived(await getGuildByName(guildName));

  const avatarSrc = $derived(
    guildData.avatarId
      ? `https://cdn.nypsi.xyz/${guildData.avatarId}`
      : guildData.owner.user.avatar,
  );

  const handleFallbackImage = (el) =>
    (el.target.src = "https://cdn.discordapp.com/embed/avatars/0.png");
</script>

<Card class="flex gap-3" mode="section">
  <img
    src={avatarSrc}
    alt=""
    class="size-20 rounded-full md:size-24"
    loading="eager"
    decoding="sync"
    onerror={handleFallbackImage}
  />

  <div class="min-w-0">
    <h2 class="line-clamp-1 text-2xl font-extrabold break-all text-white md:text-3xl">
      <a href="/guilds/{guildData.guildName}" class="link-hover">
        {guildData.guildName}
      </a>
    </h2>

    <p class="text-base-content/75 -mt-1 text-sm md:text-base">
      owned by
      <a
        href="/users/{guildData.owner.user.lastKnownUsername}"
        class="link-hover link-primary font-medium"
      >
        {guildData.owner.user.lastKnownUsername}
      </a>
    </p>
    <p class="text-base-content/75 text-xs md:text-sm">level {guildData.level}</p>
    <p class="mt-2 text-sm md:text-base">{guildData.motd}</p>
  </div>
</Card>

<Card mode="section">
  <ol class="space-y-2">
    {#each guildData.members as member}
      <li class="bg-base-300 flex items-center gap-3 rounded-lg p-2.5 md:p-3">
        <img
          src={member.economy.user.avatar}
          alt=""
          class="size-9 rounded-full md:size-10"
          loading="lazy"
          decoding="async"
          onerror={handleFallbackImage}
        />
        <a
          href="/users/{member.economy.user.lastKnownUsername}"
          class="link-hover line-clamp-1 text-sm font-medium break-all md:text-base"
        >
          {member.economy.user.lastKnownUsername}
        </a>
      </li>
    {/each}
  </ol>
</Card>
