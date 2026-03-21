<script lang="ts">
  import { getTagsRemote } from "$lib/api/tags.remote";
  import Card from "$lib/components/ui/Card.svelte";
  import badges from "$lib/data/badges";
  import toast from "svelte-french-toast";
  import type { getBaseData } from "./page.remote";

  type Props = {
    baseData: Awaited<ReturnType<typeof getBaseData>>;
    lastSeen: string;
  };

  let { baseData, lastSeen }: Props = $props();

  const tagData = await getTagsRemote();

  const premiumMap = new Map([
    [
      1,
      {
        emoji:
          "https://cdn.discordapp.com/emojis/1108083689478443058.webp?size=240&quality=lossless",
        text: "bronze",
        colour: "#ffaa57",
      },
    ],
    [
      2,
      {
        emoji:
          "https://cdn.discordapp.com/emojis/1108083725813686334.webp?size=240&quality=lossless",
        colour: "#d1e2ee",
        text: "silver",
      },
    ],
    [
      3,
      {
        emoji:
          "https://cdn.discordapp.com/emojis/1108083767236640818.webp?size=240&quality=lossless",
        colour: "#ffd479",
        text: "gold",
      },
    ],
    [
      4,

      {
        emoji:
          "https://cdn.discordapp.com/emojis/1108083805841002678.webp?size=240&quality=lossless",
        colour: "#a3dbf0",
        text: "platinum",
      },
    ],
  ]);

  const usernameColor = $derived(
    `${
      baseData?.Premium?.embedColor === "default"
        ? premiumMap.get(baseData?.Premium?.level || 0)?.colour || ""
        : baseData?.Premium?.embedColor
    }; !important`,
  );

  const tags = $derived.by(() => {
    const activeTag = baseData.Tags.find((i) => i.selected);
    const userBadges = baseData.Tags.filter((i) => badges.has(i.tagId));
    const premium = baseData.Premium;

    const tags: { label: string; src: string }[] = [];

    if (activeTag) {
      tags.push({ label: tagData[activeTag.tagId].name, src: tagData[activeTag.tagId].emoji });
    }

    if (premium && premium.level > 0) {
      tags.push({
        label: premiumMap.get(premium.level).text,
        src: premiumMap.get(premium.level).emoji,
      });
    }

    for (const badge of userBadges) {
      const label = tagData[badge.tagId].name;

      if (tags.find((i) => i.label === label)) continue;
      tags.push({ label: label, src: tagData[badge.tagId].emoji });
    }

    return tags;
  });

  function copyUsername() {
    navigator.clipboard.writeText(baseData.id);

    toast("user id copied", {
      position: "top-center",
      icon: "✅",
      style:
        "background-color: oklch(0.15 0.0299 262.929993); color: oklch(0.8936 0.0076 260.730011);",
    });
  }
</script>

<Card mode="section" class="flex gap-4 shadow">
  <img
    class="size-20 rounded-full lg:size-32"
    src={baseData.avatar}
    alt=""
    loading="eager"
    onerror={handleFallbackImage}
  />

  <div class="flex min-w-0 grow flex-col py-2">
    <h1 style="color: {usernameColor}" class="text-2xl font-extrabold text-white lg:text-4xl">
      <button onclick={copyUsername} class="link-hover block max-w-full truncate text-left">
        {baseData.lastKnownUsername}
      </button>
    </h1>

    {#if baseData.Economy}
      {@const eco = baseData.Economy}
      <span class="text-base-content/75 font-mono text-sm">
        {#if eco.prestige}
          prestige {eco.prestige}
          {#if eco.level}
            ·
          {/if}
        {/if}
        {#if eco.level}
          level {eco.level.toLocaleString()}
        {/if}
      </span>
    {:else}
      <span class="text-base-content/75 text-sm">last seen {lastSeen}</span>
    {/if}

    {#if tags.length > 0}
      <ol class="mt-auto flex flex-wrap gap-2 pt-2">
        {#each tags as tag}
          <li
            class="bg-base-300 border-primary/15 text-base-content/75 hover:border-primary/25 flex items-center gap-1 rounded-lg border px-2 py-1.5 text-sm shadow duration-200"
          >
            <img src={tag.src} alt="" class="size-5" />
            {tag.label}
          </li>
        {/each}
      </ol>
    {/if}
  </div>
</Card>
