<script lang="ts">
  import tooltip from "$lib/Tooltips";
  import badges from "$lib/data/badges";
  import seasons from "$lib/data/seasons";
  import parseEmoji from "$lib/functions/parseEmoji";
  import type { Item } from "$lib/types/Item";
  import type { UserApiResponsexd } from "$lib/types/User";
  import { fly } from "svelte/transition";

  export let userData: UserApiResponsexd;
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
</script>

<div
  class="flex w-full flex-col rounded border border-gray-300 border-opacity-5 bg-gray-950 bg-opacity-25 p-4 duration-300 hover:border-accent hover:border-opacity-20 hover:bg-opacity-40"
  in:fly={{ delay: 300, duration: 500, y: 75 }}
>
  <div class="flex w-full flex-row text-sm">
    <div class="flex w-20 flex-col lg:w-44">
      <img class="rounded-full" src={userData.avatar} alt="" />
      <div class="mt-2 flex flex-row flex-wrap">
        {#if userData.Economy}
          {#each ["crystal_heart", "white_gem", "pink_gem", "purple_gem", "blue_gem", "green_gem"] as gem}
            {#if userData.Economy.Inventory.find((i) => i.item === gem)}
              <img
                loading="lazy"
                class="h-4 lg:h-6"
                src={items.find((i) => i.id === gem)?.emoji}
                alt=""
              />
            {/if}
          {/each}
        {/if}
      </div>
    </div>
    <div class="ml-2 flex flex-col lg:text-lg">
      <div class="flex flex-row items-center text-xl font-bold text-white lg:text-3xl">
        <p
          style="color: {premiumMap.get(userData?.Premium?.level || 0)?.colour || ''}; !important"
          class="line-clamp-1"
        >
          {userData.lastKnownUsername}
        </p>
      </div>
      {#if userData.Economy}
        <p class="mb-2 text-xs text-gray-300 lg:text-base">
          {#if userData.Economy.prestige}
            prestige {userData.Economy.prestige.toLocaleString()}
          {:else}
            season {Array.from(Object.keys(seasons)[Object.keys(seasons).length - 1])}
          {/if}
        </p>
        <p class="flex items-center text-gray-200">
          <img
            loading="lazy"
            src="https://em-content.zobj.net/thumbs/120/twitter/322/money-bag_1f4b0.png"
            alt=""
            class="mr-1 inline h-4 lg:h-6"
          />
          <span class="font-semibold">${userData.Economy.money.toLocaleString()}</span>
        </p>
        <p class="flex items-center text-gray-200">
          <img
            loading="lazy"
            src="https://em-content.zobj.net/thumbs/240/twitter/322/credit-card_1f4b3.png"
            alt=""
            class="mr-1 inline h-4 lg:h-6"
          />
          <span class="font-semibold"
            >${userData.Economy.bank.toLocaleString()} / ${(
              userData.Economy.bankStorage +
              userData.Economy.xp * 1000 +
              15000
            ).toLocaleString()}</span
          >
        </p>
        <p class="mt-2 flex items-center text-gray-200">
          <img
            loading="lazy"
            src="https://em-content.zobj.net/thumbs/240/twitter/322/globe-showing-europe-africa_1f30d.png"
            alt=""
            class="mr-1 inline h-4 lg:h-6"
          />
          <span class="font-semibold">${userData.Economy.netWorth.toLocaleString()}</span>
        </p>
      {/if}
    </div>

    {#if userData.Tags.length > 0 || userData.Premium?.level > 0}
      <div class="grow" />

      <div class="flex h-fit flex-col rounded bg-gray-950 bg-opacity-20 p-2 pb-0">
        {#each userData.Tags as tag}
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
            <img class="mb-2 h-4 lg:h-6" src={badges.get(tag.tagId)?.icon} alt="" />
          </a>
          {:else}
          {#await fetch('https://raw.githubusercontent.com/tekoh/nypsi/main/data/tags.json')
          .then((r) => r.text())
          .then((r) => JSON.parse(r))}
            
          {:then tagData} 
            {#if tagData[tag.tagId] && tag.selected}
            <div
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
              alt=""
            />
          </div>
            {/if}
          {/await}
          {/if}
        {/each}
        {#if premiumMap.get(userData.Premium?.level || 0)}
          <div
            use:tooltip={{
              content: `${premiumMap.get(userData.Premium?.level || 0)?.text} membership`,
              theme: "tooltip",
              placement: "left",
            }}
          >
            <img
              loading="lazy"
              class="mb-2 h-4 lg:h-6"
              src={premiumMap.get(userData.Premium?.level || 0)?.emoji}
              alt=""
            />
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>
