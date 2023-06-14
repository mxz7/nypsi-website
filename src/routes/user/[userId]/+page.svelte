<script lang="ts">
  import seasons from "$lib/data/seasons.js";
  import dayjs from "dayjs";
  import { inPlaceSort } from "fast-sort";
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";

  export let data;
  let title = "nypsi profile";

  let premiumEmoji = "";
  let premiumColour = "";

  onMount(async () => {
    const userData = await Promise.resolve(data.streamed.userData);

    if (userData?.message) return;

    title = `${userData.lastKnownTag}'s profile`;

    switch (userData.Premium?.level) {
      case 1:
        premiumEmoji =
          "https://cdn.discordapp.com/emojis/1108083689478443058.webp?size=240&quality=lossless";
        premiumColour = "#ffaa57";
        break;
      case 2:
        premiumEmoji =
          "https://cdn.discordapp.com/emojis/1108083725813686334.webp?size=240&quality=lossless";
        premiumColour = "#d1e2ee";
        break;
      case 3:
        premiumEmoji =
          "https://cdn.discordapp.com/emojis/1108083767236640818.webp?size=240&quality=lossless";
        premiumColour = "#ffd479";
        break;
      case 4:
        premiumEmoji =
          "https://cdn.discordapp.com/emojis/1108083805841002678.webp?size=240&quality=lossless";
        premiumColour = "#a3dbf0";
        break;
    }
  });
</script>

<svelte:head>
  <meta name="og:title" content={title} />
  <meta name="og:description" content="" />

  <title>{title}</title>
</svelte:head>

{#await data.streamed.userData}
  <div class="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 transform">
    <div out:fade={{ duration: 300 }} class="flex items-center justify-center">
      <svg
        class="-ml-1 mr-3 h-10 w-10 animate-spin text-red-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  </div>
{:then userData}
  {#if userData.message}
    <div class="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 transform">
      <p class="text-xl font-bold text-gray-300">{userData.message}</p>
    </div>
  {:else if !userData.message}
    <div
      in:fly={{ y: 25, delay: 300, duration: 500 }}
      class=" xl:[20vw] mx-3 mb-10 mt-7 flex flex-col sm:mx-auto sm:w-[50vw] md:w-[40vw]"
    >
      <div class="flex w-full flex-col rounded bg-gray-950 bg-opacity-25 p-4">
        <div class="flex w-full flex-row text-sm">
          <div class="flex w-20 flex-col lg:w-44">
            <img class="rounded-full" src={userData.avatar} alt="" />
            <div class="mt-2 flex flex-row flex-wrap">
              {#if userData.Economy}
                {#await data.streamed.items then items}
                  {#each ["crystal_heart", "white_gem", "pink_gem", "purple_gem", "blue_gem", "green_gem"] as gem}
                    {#if userData.Economy.Inventory.find((i) => i.item === gem)}
                      <img class="h-4 lg:h-6" src={items.find((i) => i.id === gem)?.emoji} alt="" />
                    {/if}
                  {/each}
                {/await}
              {/if}
            </div>
          </div>
          <div class="ml-4 flex flex-col lg:text-lg">
            <div class="flex flex-row items-center text-xl font-bold text-white lg:text-3xl">
              {#if premiumEmoji}
                <img class="-ml-2 h-7" src={premiumEmoji} alt="" />
              {/if}

              <p style="color: {premiumColour}; !important" class="line-clamp-1">
                {userData.lastKnownTag}
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
                  src="https://em-content.zobj.net/thumbs/120/twitter/322/money-bag_1f4b0.png"
                  alt=""
                  class="mr-1 inline h-4 lg:h-6"
                />
                <span class="font-semibold">${userData.Economy.money.toLocaleString()}</span>
              </p>
              <p class="flex items-center text-gray-200">
                <img
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
                  src="https://em-content.zobj.net/thumbs/240/twitter/322/globe-showing-europe-africa_1f30d.png"
                  alt=""
                  class="mr-1 inline h-4 lg:h-6"
                />
                <span class="font-semibold">${userData.Economy.netWorth.toLocaleString()}</span>
              </p>
            {/if}
          </div>
        </div>
      </div>

      {#if userData.blacklisted}
        <div class="mt-4 rounded bg-gray-950 bg-opacity-25 p-4">
          <h1 class="text-center text-red-500 lg:text-lg">
            {userData.lastKnownTag.split("#")[0]} is blacklisted from nypsi
          </h1>
        </div>
      {:else if dayjs(userData?.Economy?.banned).isAfter(dayjs())}
        <div class="mt-4 rounded bg-gray-950 bg-opacity-25 p-4">
          <h1 class="text-center text-sm text-red-500 lg:text-lg">
            {userData.lastKnownTag.split("#")[0]} is economy banned until {new Date(
              userData.Economy.banned
            ).toLocaleDateString()}
          </h1>
        </div>
      {/if}

      <div class="mt-4 flex w-full flex-row">
        <div class="mr-2 flex grow flex-col rounded bg-gray-950 bg-opacity-25 p-4 text-center">
          <h1 class="text-white lg:text-xl">favourite command</h1>
          <p class="line-clamp-1 text-sm text-gray-300 lg:text-base">
            ${userData.CommandUse[0].command}
            ({userData.CommandUse[0].uses.toLocaleString()} uses)
          </p>
        </div>

        <div class="ml-2 flex grow flex-col rounded bg-gray-950 bg-opacity-25 p-4 text-center">
          <h1 class="text-white lg:text-xl">daily streak</h1>
          <p class="text-sm text-gray-300 lg:text-base">
            {(userData.Economy?.dailyStreak || 0).toLocaleString()}
          </p>
        </div>
      </div>

      {#if userData.Economy.EconomyGuildMember?.guild}
        <div class="mt-4 flex w-full flex-col rounded bg-gray-950 bg-opacity-25 p-4">
          <h1 class="w-full text-center text-lg text-gray-100 lg:text-2xl">
            {userData.Economy.EconomyGuildMember.guild.guildName} [{userData.Economy
              .EconomyGuildMember.guild.level}]
          </h1>

          <div class="mt-2 flex w-full flex-row">
            <div class="flex grow flex-col text-center">
              <h2 class="text-gray-200 lg:text-xl">balance</h2>
              <p class="text-sm text-gray-300 lg:text-base">
                ${userData.Economy.EconomyGuildMember.guild.balance.toLocaleString()}
              </p>
            </div>
            <div class="flex grow flex-col text-center">
              <h2 class="text-gray-200 lg:text-xl">xp</h2>
              <p class="text-sm text-gray-300 lg:text-base">
                {userData.Economy.EconomyGuildMember.guild.xp.toLocaleString()}xp
              </p>
            </div>
          </div>

          <div class="mt-4 flex w-full flex-row flex-wrap justify-center">
            {#each userData.Economy.EconomyGuildMember.guild.members as member}
              <a
                class="mb-2 mr-2 rounded bg-gray-950 bg-opacity-50 p-1 text-xs text-gray-300 duration-300 hover:text-red-500 lg:text-sm"
                href="/user/{member.economy.user.id}">{member.economy.user.lastKnownTag}</a
              >
            {/each}
          </div>
        </div>
      {/if}

      {#if userData.Economy.Inventory.length > 0}
        {#await data.streamed.items}
          <p>loading items...</p>
        {:then items}
          <div
            class="mt-4 flex w-full flex-col justify-center rounded bg-gray-950 bg-opacity-25 p-4"
          >
            <h1 class="mb-3 w-full text-center text-white lg:text-xl">inventory</h1>
            <div
              class="lg:max-h-84 mt-3 grid max-h-64 grid-flow-row grid-cols-2 gap-2 overflow-scroll"
            >
              {#each inPlaceSort(userData.Economy.Inventory).asc((i) => i.item) as item}
                <a
                  href="/leaderboard/{item.item}"
                  class="mx-2 flex flex-col items-center justify-center rounded border border-gray-500 border-opacity-25 bg-gray-700 bg-opacity-5 py-2 align-middle text-xs text-gray-300 lg:text-sm"
                >
                  <img
                    class="w-6 lg:w-8"
                    src={items.find((i) => i.id === item.item)?.emoji}
                    alt=""
                  />
                  <p class="my-1">{items.find((i) => i.id === item.item)?.name}</p>
                  <p>{item.amount.toLocaleString()}</p>
                </a>
              {/each}
            </div>
          </div>
        {/await}
      {/if}
    </div>
  {/if}
{/await}
