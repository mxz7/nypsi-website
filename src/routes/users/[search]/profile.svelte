<script lang="ts">
  import { getItemsRemote } from "$lib/api/items.remote";
  import { getTagsRemote } from "$lib/api/tags.remote";
  import type { getBaseData, getMarriagePartner } from "$lib/api/users.remote";
  import Card from "$lib/components/ui/Card.svelte";
  import badges from "$lib/data/badges";
  import { handleFallbackImage } from "$lib/functions/image";
  import { toast } from "svelte-sonner";

  type Props = {
    baseData: Awaited<ReturnType<typeof getBaseData>>;
    lastSeen: string;
    marriagePartner: Awaited<ReturnType<typeof getMarriagePartner>>;
    gems: string[];
  };

  let { baseData, lastSeen, marriagePartner, gems }: Props = $props();

  const tagData = await getTagsRemote();
  const itemsData = await getItemsRemote();

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

  const levelText = $derived.by(() => {
    const eco = baseData.Economy;

    if (!eco) return "";

    let out = "";

    if (eco.prestige) {
      out = `prestige ${eco.prestige}`;

      if (eco.level) {
        out += ` · level ${eco.level}`;
      }
    } else {
      out = `level ${eco.level}`;
    }

    return out;
  });

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

  const gemItems = $derived.by(() =>
    gems
      .map((gemId) => itemsData.find((item) => item.id === gemId))
      .filter((item) => item !== undefined),
  );

  const ringEmoji = $derived(itemsData.find((item) => item.id === "ring")?.emoji);

  function copyUsername() {
    navigator.clipboard.writeText(baseData.id);

    toast(`copied user id (${baseData.id})`, {
      position: "top-center",
    });
  }
</script>

{#snippet tagsSection()}
  {#if tags.length > 0}
    <ol class="mt-auto flex flex-wrap gap-1 pt-1 md:pt-2">
      {#each tags as tag}
        <li
          class="bg-base-300 border-primary/15 text-base-content/75 hover:border-primary/25 flex items-center gap-1 rounded-lg border px-1.5 py-1 text-xs shadow duration-200 md:px-2 md:py-1.5 md:text-sm"
        >
          <img src={tag.src} alt="" class="size-4 md:size-5" />
          {tag.label}
        </li>
      {/each}
    </ol>
  {/if}
{/snippet}

{#snippet gemsSection()}
  {#if gemItems.length > 0}
    <ol class="flex flex-col items-end justify-evenly self-stretch py-1">
      {#each gemItems as gem}
        <li class="tooltip tooltip-left shrink-0" data-tip={gem.name}>
          <img src={gem.emoji} alt="" class="aspect-square size-5 shrink-0 object-contain" />
        </li>
      {/each}
    </ol>
  {/if}
{/snippet}

<Card mode="section" class="flex items-stretch gap-1 shadow">
  <div class="flex grow flex-col gap-1">
    <div class="flex min-w-0 grow gap-2 md:gap-3">
      <img
        class="size-20 rounded-full lg:size-32"
        src={baseData.avatar}
        alt=""
        loading="eager"
        onerror={handleFallbackImage}
      />

      <div class="flex min-w-0 grow flex-col py-2">
        <h1 style="color: {usernameColor}" class="text-2xl font-extrabold text-white lg:text-4xl">
          <button
            onclick={copyUsername}
            class="link-hover block max-w-full cursor-pointer truncate text-left"
          >
            {baseData.lastKnownUsername}
          </button>
        </h1>

        {#if baseData.Economy}
          {#if levelText}
            <span class="text-base-content/75 text-sm">
              {levelText}
            </span>
          {/if}

          {#if marriagePartner}
            <div class="text-base-content/75 mt-2 flex items-center gap-0.5 text-xs md:text-sm">
              <img src={ringEmoji} alt="" class="size-4" />
              <span>
                married to
                <a class="link-primary link underline-offset-2" href="/users/{marriagePartner.id}"
                  >{marriagePartner.lastKnownUsername}</a
                >
              </span>
            </div>
          {/if}
        {:else}
          <span class="text-base-content/75 text-sm">last seen {lastSeen}</span>
        {/if}

        {#if !(marriagePartner && levelText)}
          {@render tagsSection()}
        {/if}
      </div>
    </div>

    {#if marriagePartner && levelText}
      {@render tagsSection()}
    {/if}
  </div>

  {@render gemsSection()}
</Card>
