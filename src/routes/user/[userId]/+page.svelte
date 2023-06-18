<script lang="ts">
  import badges from "$lib/data/bages.js";
  import seasons from "$lib/data/seasons.js";
  import { MStoTime, daysAgo } from "$lib/functions/time.js";
  import dayjs from "dayjs";
  import { inPlaceSort } from "fast-sort";
  import Tooltip from "sv-tooltip";
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";

  export let data;
  let title = "nypsi profile";
  let description = "view nypsi profile";

  let premiumEmoji = "";
  let premiumText = "";
  let premiumColour = "";

  onMount(async () => {
    const userData = await Promise.resolve(data.streamed.userData);

    if (userData?.message) return;

    console.log(userData);

    title = `${userData.lastKnownUsername}'s profile`;
    description = `view ${userData.lastKnownUsername}'s nypsi profile`;

    switch (userData.Premium?.level) {
      case 1:
        premiumEmoji =
          "https://cdn.discordapp.com/emojis/1108083689478443058.webp?size=240&quality=lossless";
        premiumColour = "#ffaa57";
        premiumText = "bronze";
        break;
      case 2:
        premiumEmoji =
          "https://cdn.discordapp.com/emojis/1108083725813686334.webp?size=240&quality=lossless";
        premiumColour = "#d1e2ee";
        premiumText = "silver";
        break;
      case 3:
        premiumEmoji =
          "https://cdn.discordapp.com/emojis/1108083767236640818.webp?size=240&quality=lossless";
        premiumColour = "#ffd479";
        premiumText = "gold";
        break;
      case 4:
        premiumEmoji =
          "https://cdn.discordapp.com/emojis/1108083805841002678.webp?size=240&quality=lossless";
        premiumColour = "#a3dbf0";
        premiumText = "platinum";
        break;
    }
  });
</script>

<svelte:head>
  <meta name="og:title" content={title} />
  <meta name="description" content={description} />

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
      class="xl:[20vw] md:w-[40vw mx-3 mb-10 mt-7 flex flex-col sm:mx-auto sm:w-[50vw]"
    >
      <div
        class="flex w-full flex-col rounded border border-gray-300 border-opacity-5 bg-gray-950 bg-opacity-25 p-4 duration-300 hover:border-opacity-20 hover:bg-opacity-40"
      >
        <div class="flex w-full flex-row text-sm">
          <div class="flex w-20 flex-col lg:w-44">
            <img loading="lazy" class="rounded-full" src={userData.avatar} alt="" />
            <div class="mt-2 flex flex-row flex-wrap">
              {#if userData.Economy}
                {#await data.streamed.items then items}
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
                {/await}
              {/if}
            </div>
          </div>
          <div class="ml-2 flex flex-col lg:text-lg">
            <div class="flex flex-row items-center text-xl font-bold text-white lg:text-3xl">
              <p style="color: {premiumColour}; !important" class="line-clamp-1">
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

          {#if userData.badges.length > 0}
            <div class="grow" />
            <div class="flex h-fit flex-col rounded bg-gray-950 bg-opacity-20 p-2 pb-0">
              {#each userData.badges as badge}
                <Tooltip tip={badges.get(badge)?.text} left
                  ><img class="mb-2 h-4 lg:h-6" src={badges.get(badge)?.icon} alt="" /></Tooltip
                >
              {/each}
              {#if premiumEmoji}
                <Tooltip tip="{premiumText} membership" left>
                  <img loading="lazy" class="mb-2 h-4 lg:h-6" src={premiumEmoji} alt="" />
                </Tooltip>
              {/if}
            </div>
          {/if}
        </div>
      </div>

      {#if userData.blacklisted}
        <div
          class="mt-4 rounded border border-gray-300 border-opacity-5 bg-gray-950 bg-opacity-25 p-4 duration-300 hover:border-opacity-20 hover:bg-opacity-40"
        >
          <h1 class="text-center text-red-500 lg:text-lg">
            {userData.lastKnownUsername.split("#")[0]} is blacklisted from nypsi
          </h1>
        </div>
      {:else if dayjs(userData?.Economy?.banned).isAfter(dayjs())}
        <div
          class="mt-4 rounded border border-gray-300 border-opacity-5 bg-gray-950 bg-opacity-25 p-4 duration-300 hover:border-opacity-20 hover:bg-opacity-40"
        >
          <h1 class="text-center text-sm text-red-500 lg:text-lg">
            {userData.lastKnownUsername.split("#")[0]} is economy banned until {new Date(
              userData.Economy.banned
            ).toLocaleDateString()}
          </h1>
        </div>
      {/if}

      <div class="mt-4 flex w-full flex-row">
        <div
          class="mr-2 flex grow flex-col rounded border border-gray-300 border-opacity-5 bg-gray-950 bg-opacity-25 p-4 text-center duration-300 hover:border-opacity-20 hover:bg-opacity-40"
        >
          <h1 class="text-white lg:text-xl">favourite command</h1>
          <p class="line-clamp-1 text-sm text-gray-300 lg:text-base">
            ${userData.CommandUse[0].command}
            ({userData.CommandUse[0].uses.toLocaleString()} uses)
          </p>
        </div>

        <div
          class="ml-2 flex grow flex-col rounded border border-gray-300 border-opacity-5 bg-gray-950 bg-opacity-25 p-4 text-center duration-300 hover:border-opacity-20 hover:bg-opacity-40"
        >
          <h1 class="text-white lg:text-xl">daily streak</h1>
          <p class="text-sm text-gray-300 lg:text-base">
            {(userData.Economy?.dailyStreak || 0).toLocaleString()}
          </p>
        </div>
      </div>

      {#if userData.Economy.EconomyGuildMember?.guild}
        <div
          class="mt-4 flex w-full flex-col rounded border border-gray-300 border-opacity-5 bg-gray-950 bg-opacity-25 p-4 duration-300 hover:border-opacity-20 hover:bg-opacity-40"
        >
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
                class="mb-2 mr-2 rounded border border-gray-500 border-opacity-10 bg-gray-700 bg-opacity-5 p-1 text-xs text-gray-300 shadow duration-300 hover:border-opacity-25 hover:text-red-500 lg:text-sm"
                href="/user/{member.economy.user.id}">{member.economy.user.lastKnownUsername}</a
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
            class="mt-4 flex w-full flex-col justify-center rounded border border-gray-300 border-opacity-5 bg-gray-950 bg-opacity-25 p-4 duration-300 hover:border-opacity-20 hover:bg-opacity-40"
          >
            <h1 class="mb-3 w-full text-center text-white lg:text-xl">inventory</h1>
            <div
              class="lg:max-h-84 mt-3 grid max-h-64 grid-flow-row grid-cols-2 gap-2 overflow-y-auto"
            >
              {#each inPlaceSort(userData.Economy.Inventory).asc((i) => i.item) as item}
                <a
                  href="/leaderboard/{item.item}"
                  class="hover:bg-opacity- mx-2 flex flex-col items-center justify-center rounded border border-gray-500 border-opacity-10 bg-gray-700 bg-opacity-5 py-2 align-middle text-xs text-gray-300 shadow duration-300 hover:border-opacity-25 lg:text-sm"
                >
                  <div class="flex h-6 w-6 items-center justify-center align-middle lg:h-8 lg:w-8">
                    <img
                      loading="lazy"
                      class="h-auto max-h-full w-auto max-w-full object-contain"
                      src={items.find((i) => i.id === item.item)?.emoji}
                      alt=""
                    />
                  </div>
                  <p class="my-1">{items.find((i) => i.id === item.item)?.name}</p>
                  <p>{item.amount.toLocaleString()}</p>
                </a>
              {/each}
            </div>
          </div>
        {/await}
      {/if}

      <div class="mt-4 flex w-full flex-row">
        <div
          class="mr-2 flex grow flex-col rounded border border-gray-300 border-opacity-5 bg-gray-950 bg-opacity-25 p-4 text-center duration-300 hover:border-opacity-20 hover:bg-opacity-40"
        >
          <h1 class="text-white lg:text-xl">last seen</h1>
          <p class="text-sm text-gray-300 lg:text-base">
            {#if dayjs(userData.lastCommand).isBefore(dayjs().subtract(1, "year"))}
              {new Date(userData.lastCommand).toLocaleDateString()}
            {:else if daysAgo(userData.lastCommand) <= 1}
              today
            {:else}
              {daysAgo(userData.lastCommand).toLocaleString()} days ago
            {/if}
          </p>
        </div>

        <div
          class="ml-2 flex grow flex-col rounded border border-gray-300 border-opacity-5 bg-gray-950 bg-opacity-25 p-4 text-center duration-300 hover:border-opacity-20 hover:bg-opacity-40"
        >
          <h1 class="text-white lg:text-xl">completion</h1>
          <p class="text-sm text-gray-300 lg:text-base">
            {#await fetch("https://raw.githubusercontent.com/tekoh/nypsi/main/data/achievements.json").then( (r) => r.json() )}
              calculating...
            {:then achievementData}
              {(
                (userData.Achievements.length / Object.keys(achievementData).length) *
                100
              ).toPrecision(3)}%
            {/await}
          </p>
        </div>
      </div>

      {#if userData.Leaderboards.length > 0}
        {#await data.streamed.items}
          <p>loading items...</p>
        {:then items}
          <div
            class="mt-4 flex w-full flex-col justify-center rounded border border-gray-300 border-opacity-5 bg-gray-950 bg-opacity-25 p-4 duration-300 hover:border-opacity-20 hover:bg-opacity-40"
          >
            <h1 class="mb-3 w-full text-center text-white lg:text-xl">leaderboards</h1>
            <div
              class="lg:max-h-84 mt-3 grid max-h-64 grid-flow-row grid-cols-2 gap-2 overflow-y-auto"
            >
              {#each inPlaceSort(userData.Leaderboards).asc((i) => i.position) as lb}
                <a
                  href="/leaderboard/{lb.leaderboard.replace('item-', '')}"
                  class="hover:bg-opacity- mx-2 flex flex-col items-center justify-center rounded border border-gray-500 border-opacity-10 bg-gray-700 bg-opacity-5 py-2 align-middle text-xs text-gray-300 shadow duration-300 hover:border-opacity-25 lg:text-sm"
                >
                  {#if lb.leaderboard.startsWith("item-")}
                    <div
                      class="flex h-6 w-6 items-center justify-center align-middle lg:h-8 lg:w-8"
                    >
                      <img
                        loading="lazy"
                        class="h-auto max-h-full w-auto max-w-full object-contain"
                        src={items.find((i) => i.id === lb.leaderboard.split("-")[1])?.emoji}
                        alt=""
                      />
                    </div>
                    <p class="my-1 {lb.position === 1 ? 'text-red-500' : ''}">
                      {items.find((i) => i.id === lb.leaderboard.split("-")[1])?.name}
                    </p>
                  {:else}
                    <p class="my-1">
                      {lb.leaderboard}
                    </p>
                  {/if}

                  <p class={lb.position === 1 ? "text-red-500" : ""}>
                    #{lb.position}
                  </p>
                </a>
              {/each}
            </div>
          </div>
        {/await}
      {/if}

      {#if userData.Economy.Game.length > 0}
        <div
          class="mx-auto mt-4 flex flex-col rounded border border-gray-300 border-opacity-5 bg-gray-950 bg-opacity-25 p-4 duration-300 hover:border-opacity-20 hover:bg-opacity-40 lg:w-full"
        >
          <h1 class="text-center text-white lg:text-xl">recent games</h1>
          <div
            class="mx-4 mt-4 flex max-h-64 flex-col overflow-y-auto px-2 lg:grid lg:grid-cols-2 lg:gap-2 lg:gap-x-6 lg:px-0"
          >
            {#each userData.Economy.Game as game}
              <a
                href="/game/{game.id.toString(36)}"
                style="color: {game.win ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'};"
                class="mt-3 flex w-full flex-col items-center justify-center rounded border border-gray-500 border-opacity-10 bg-gray-700 bg-opacity-5 p-2 px-4 align-middle shadow duration-300 hover:border-opacity-25 lg:mt-0"
              >
                <h2 class="text-center lg:text-lg">{game.game.replaceAll("_", " ")}</h2>

                {#if !game.game.includes("scratch")}
                  <p class="mt-2 text-center text-sm font-semibold lg:text-base">
                    {game.win
                      ? `+$${game.earned.toLocaleString()}`
                      : `-$${game.bet.toLocaleString()}`}
                  </p>
                {/if}

                <p class="mt-2 text-center text-xs text-gray-500">
                  {game.id.toString(36)} | {new Date(game.date).toLocaleDateString()}
                </p>
              </a>
            {/each}
          </div>
        </div>
      {/if}

      {#if userData.WordleStats}
        <div
          class="mx-auto mt-4 flex flex-col rounded border border-gray-300 border-opacity-5 bg-gray-950 bg-opacity-25 p-4 duration-300 hover:border-opacity-20 hover:bg-opacity-40"
        >
          <h1 class="mb-2 text-center text-white lg:mb-4 lg:text-xl">wordle</h1>

          <div class="flex w-full grow flex-row">
            <div class="flex w-full flex-col justify-center">
              <div class="w-full text-green-500 lg:text-lg">
                {#if userData.WordleStats.win1}
                  <div
                    class="flex max-w-fit flex-row items-center align-middle [&>img]:h-6 [&>img]:w-6 lg:[&>img]:h-8 lg:[&>img]:w-8"
                  >
                    <img
                      loading="lazy"
                      src="https://cdn.discordapp.com/emojis/1118558624197902347.png"
                      alt=""
                    />
                    <p class="ml-2">{userData.WordleStats.win1.toLocaleString()}</p>
                  </div>
                {/if}
                {#if userData.WordleStats.win2}
                  <div
                    class="flex max-w-fit flex-row items-center align-middle [&>img]:h-6 [&>img]:w-6 lg:[&>img]:h-8 lg:[&>img]:w-8"
                  >
                    <img
                      loading="lazy"
                      src="https://cdn.discordapp.com/emojis/987046773157691452.png"
                      alt=""
                    />
                    <img
                      loading="lazy"
                      src="https://cdn.discordapp.com/emojis/1118558624197902347.png"
                      alt=""
                    />
                    <p class="ml-2">{userData.WordleStats.win2.toLocaleString()}</p>
                  </div>
                {/if}
                {#if userData.WordleStats.win3}
                  <div
                    class="flex max-w-fit flex-row items-center align-middle [&>img]:h-6 [&>img]:w-6 lg:[&>img]:h-8 lg:[&>img]:w-8"
                  >
                    <img
                      loading="lazy"
                      src="https://cdn.discordapp.com/emojis/987046773157691452.png"
                      alt=""
                    />
                    <img
                      loading="lazy"
                      src="https://cdn.discordapp.com/emojis/987046773157691452.png"
                      alt=""
                    />
                    <img
                      loading="lazy"
                      src="https://cdn.discordapp.com/emojis/1118558624197902347.png"
                      alt=""
                    />
                    <p class="ml-2">{userData.WordleStats.win3.toLocaleString()}</p>
                  </div>
                {/if}
                {#if userData.WordleStats.win4}
                  <div
                    class="flex max-w-fit flex-row items-center align-middle [&>img]:h-6 [&>img]:w-6 lg:[&>img]:h-8 lg:[&>img]:w-8"
                  >
                    <img
                      loading="lazy"
                      src="https://cdn.discordapp.com/emojis/987046773157691452.png"
                      alt=""
                    />
                    <img
                      loading="lazy"
                      src="https://cdn.discordapp.com/emojis/987046773157691452.png"
                      alt=""
                    />
                    <img
                      loading="lazy"
                      src="https://cdn.discordapp.com/emojis/987046773157691452.png"
                      alt=""
                    />
                    <img
                      loading="lazy"
                      src="https://cdn.discordapp.com/emojis/1118558624197902347.png"
                      alt=""
                    />
                    <p class="ml-2">{userData.WordleStats.win4.toLocaleString()}</p>
                  </div>
                {/if}
                {#if userData.WordleStats.win5}
                  <div
                    class="flex max-w-fit flex-row items-center align-middle [&>img]:h-6 [&>img]:w-6 lg:[&>img]:h-8 lg:[&>img]:w-8"
                  >
                    <img
                      loading="lazy"
                      src="https://cdn.discordapp.com/emojis/987046773157691452.png"
                      alt=""
                    />
                    <img
                      loading="lazy"
                      src="https://cdn.discordapp.com/emojis/987046773157691452.png"
                      alt=""
                    />
                    <img
                      loading="lazy"
                      src="https://cdn.discordapp.com/emojis/987046773157691452.png"
                      alt=""
                    />
                    <img
                      loading="lazy"
                      src="https://cdn.discordapp.com/emojis/987046773157691452.png"
                      alt=""
                    />
                    <img
                      loading="lazy"
                      src="https://cdn.discordapp.com/emojis/1118558624197902347.png"
                      alt=""
                    />
                    <p class="ml-2">{userData.WordleStats.win5.toLocaleString()}</p>
                  </div>
                {/if}
                {#if userData.WordleStats.win6}
                  <div
                    class="flex max-w-fit flex-row items-center align-middle [&>img]:h-6 [&>img]:w-6 lg:[&>img]:h-8 lg:[&>img]:w-8"
                  >
                    <img
                      loading="lazy"
                      src="https://cdn.discordapp.com/emojis/987046773157691452.png"
                      alt=""
                    />
                    <img
                      loading="lazy"
                      src="https://cdn.discordapp.com/emojis/987046773157691452.png"
                      alt=""
                    />
                    <img
                      loading="lazy"
                      src="https://cdn.discordapp.com/emojis/987046773157691452.png"
                      alt=""
                    />
                    <img
                      loading="lazy"
                      src="https://cdn.discordapp.com/emojis/987046773157691452.png"
                      alt=""
                    />
                    <img
                      loading="lazy"
                      src="https://cdn.discordapp.com/emojis/987046773157691452.png"
                      alt=""
                    />
                    <img
                      loading="lazy"
                      src="https://cdn.discordapp.com/emojis/1118558624197902347.png"
                      alt=""
                    />
                    <p class="ml-2">{userData.WordleStats.win6.toLocaleString()}</p>
                  </div>
                {/if}
                {#if userData.WordleStats.lose}
                  <div
                    class="flex max-w-fit flex-row items-center align-middle [&>img]:h-6 [&>img]:w-6 lg:[&>img]:h-8 lg:[&>img]:w-8"
                  >
                    <img
                      loading="lazy"
                      src="https://cdn.discordapp.com/emojis/1118563689008734258.png"
                      alt=""
                    />
                    <p class="ml-2 text-red-500">{userData.WordleStats.lose.toLocaleString()}</p>
                  </div>
                {/if}
              </div>
              {#if userData.WordleStats.history.length > 1}
                <p class="mt-2 text-center text-xs text-gray-300 lg:text-sm">
                  average winning game takes {MStoTime(
                    userData.WordleStats.history.reduce((a, b) => a + b) /
                      userData.WordleStats.history.length
                  )}
                </p>
              {/if}
            </div>
          </div>
        </div>
      {/if}
    </div>
  {/if}
{/await}
<!-- https://cdn.discordapp.com/emojis/1118558624197902347.png
https://cdn.discordapp.com/emojis/987046773157691452.png
https://cdn.discordapp.com/emojis/1118563689008734258.png -->
