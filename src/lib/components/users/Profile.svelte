<script lang="ts">
  import tooltip from "$lib/Tooltips";
  import badges from "$lib/data/badges";
  import seasons from "$lib/data/seasons";
  import parseEmoji from "$lib/functions/parseEmoji";
  import { daysAgo } from "$lib/functions/time";
  import { getTags } from "$lib/stores";
  import type { Item } from "$lib/types/Item";
  import type { UserApiResponsexd } from "$lib/types/User";
  import dayjs from "dayjs";
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";

  export let baseData: {
    id: string;
    blacklisted: boolean;
    lastKnownUsername: string;
    lastCommand: Date;
    avatar: string;
    Premium: {
      level: number;
    };
    Tags: {
      tagId: string;
      selected: boolean;
    }[];
  } | null;
  export let userData: UserApiResponsexd | Promise<UserApiResponsexd>;
  export let items: Item[];

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

  let avatar: HTMLImageElement;

  const handleFallbackImage = (el) => {
    el.target.src = "https://cdn.discordapp.com/embed/avatars/0.png";
  };

  onMount(async () => {
    if (avatar.src.endsWith("avatars/0.png")) return;
    const res = await fetch(avatar.src);

    if (!res.ok) avatar.src = "https://cdn.discordapp.com/embed/avatars/0.png";
  });
</script>

<div
  class="flex w-full flex-col rounded-lg border border-primary border-opacity-5 bg-base-200 p-4 duration-300 hover:border-opacity-20"
  in:fly={{ delay: 300, duration: 500, y: 75 }}
>
  <div class="flex w-full flex-row text-sm">
    <div class="flex w-20 flex-col lg:w-44">
      <img
        bind:this={avatar}
        class="rounded-full"
        height="256"
        width="256"
        src={baseData.avatar}
        alt="{baseData.lastKnownUsername}'s avatar"
        on:error={handleFallbackImage}
      />
      <div class="mt-2 flex flex-row flex-wrap">
        {#await userData then userData}
          {#if userData.Economy}
            {#each ["crystal_heart", "white_gem", "pink_gem", "purple_gem", "blue_gem", "green_gem"] as gem}
              {#if userData.Economy.Inventory.find((i) => i.item === gem)}
                <img
                  loading="lazy"
                  class="h-5 lg:h-7"
                  src={items.find((i) => i.id === gem)?.emoji}
                  alt="{gem} emoji"
                />
              {/if}
            {/each}
          {/if}
        {/await}
      </div>
    </div>
    <div class="ml-2 flex flex-col lg:text-lg">
      <div class="flex flex-row items-center text-2xl font-extrabold text-white lg:text-4xl">
        <h1
          style="color: {premiumMap.get(baseData?.Premium?.level || 0)?.colour || ''}; !important"
          class="line-clamp-1"
        >
          <a target="_blank" href="https://discord.com/users/{baseData.id}"
            >{baseData.lastKnownUsername}</a
          >
        </h1>
      </div>
      {#await userData then userData}
        {#if userData.Economy}
          <p in:fade|global={{ duration: 400 }} class="mb-2 text-xs text-slate-300 lg:text-base">
            {#if userData.Economy.level || userData.Economy.prestige}
              {#if userData.Economy.prestige}
                prestige {userData.Economy.prestige} |
              {/if}
              level {userData.Economy.level}
            {:else}
              season {Array.from(Object.keys(seasons)[Object.keys(seasons).length - 1])}
            {/if}
          </p>
          <p
            in:fade|global={{ duration: 400, delay: 200 }}
            class="flex items-center text-slate-200"
          >
            <img
              loading="lazy"
              src="https://em-content.zobj.net/thumbs/120/twitter/322/money-bag_1f4b0.png"
              alt="money emoji"
              class="mr-1 inline h-4 lg:h-6"
            />
            <span class="font-medium">${userData.Economy.money.toLocaleString()}</span>
          </p>
          <p
            in:fade|global={{ duration: 400, delay: 400 }}
            class="flex items-center text-slate-200"
          >
            <img
              loading="lazy"
              src="https://em-content.zobj.net/thumbs/240/twitter/322/credit-card_1f4b3.png"
              alt="credit card (bank) emoji"
              class="mr-1 inline h-4 lg:h-6"
            />
            <span class="font-medium"
              >${userData.Economy.bank.toLocaleString()}
              <!-- / ${(
                userData.Economy.bankStorage +
                userData.Economy.xp * 1000 +
                15000
              ).toLocaleString()} -->
            </span>
          </p>
          <p
            in:fade|global={{ duration: 400, delay: 600 }}
            class="mt-2 flex items-center text-slate-200"
          >
            <img
              loading="lazy"
              src="https://em-content.zobj.net/thumbs/240/twitter/322/globe-showing-europe-africa_1f30d.png"
              alt="globe (net worth) emoji"
              class="mr-1 inline h-4 lg:h-6"
            />
            <span class="font-medium">${userData.Economy.netWorth.toLocaleString()}</span>
          </p>
        {:else}
          <p class="mt-1 text-slate-300">
            last seen {#if dayjs(userData.lastCommand).isBefore(dayjs().subtract(3, "months"))}
              {new Date(userData.lastCommand).toLocaleDateString()}
            {:else if daysAgo(userData.lastCommand) < 1}
              {@const hours = (dayjs().unix() - dayjs(userData.lastCommand).unix()) / 3600}
              {#if hours < 1}
                just now
              {:else}
                {Math.floor(hours)} hour{Math.floor(hours) > 1 ? "s" : ""} ago
              {/if}
            {:else}
              {daysAgo(userData.lastCommand).toLocaleString()} day{daysAgo(userData.lastCommand) > 1
                ? "s"
                : ""} ago
            {/if}
          </p>
        {/if}
      {/await}
    </div>

    <div class="grow" />
    {#if baseData.Tags?.length > 0 || premiumMap.get(baseData.Premium?.level || 0)}
      <div class="flex h-fit flex-col rounded-lg bg-base-300 p-2 pb-0">
        {#if baseData.Tags?.length > 0}
          {#each baseData.Tags as tag, i}
            {#if badges.has(tag.tagId)}
              <a
                href="/badges#{badges.get(tag.tagId)?.name}"
                class="h-full w-full"
                use:tooltip={{
                  content: badges.get(tag.tagId).name,
                  theme: "tooltip",
                  placement: "left",
                }}
              >
                <img
                  class="mb-2 h-4 lg:h-6"
                  src={badges.get(tag.tagId)?.icon}
                  alt="{tag.tagId} emoji"
                />
              </a>
            {:else}
              {#await getTags() then tagData}
                {#if tagData[tag.tagId] && tag.selected}
                  <div
                    in:fade|global={{ duration: 400, delay: i * 200 }}
                    use:tooltip={{
                      content: tagData[tag.tagId].name,
                      theme: "tooltip",
                      placement: "left",
                    }}
                  >
                    <img
                      loading="lazy"
                      class="mb-2 h-4 lg:h-6"
                      src={parseEmoji(tagData[tag.tagId].emoji)}
                      alt="{tag.tagId} emoji"
                    />
                  </div>
                {/if}
              {/await}
            {/if}
          {/each}
        {/if}

        {#if premiumMap.get(baseData.Premium?.level || 0)}
          <div
            in:fade|global={{ duration: 400, delay: baseData.Tags?.length * 200 + 0 }}
            use:tooltip={{
              content: `${premiumMap.get(baseData.Premium?.level || 0)?.text} membership`,
              theme: "tooltip",
              placement: "left",
            }}
          >
            <img
              loading="lazy"
              class="mb-2 h-4 lg:h-6"
              src={premiumMap.get(baseData.Premium?.level || 0)?.emoji}
              alt="premium level {baseData.Premium?.level} emoji"
            />
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>
