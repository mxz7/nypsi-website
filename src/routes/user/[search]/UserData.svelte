<script lang="ts">
  import { replaceState } from "$app/navigation";
  import { page } from "$app/stores";
  import { MStoTime, daysAgo } from "$lib/functions/time";
  import type Game from "$lib/types/Game";
  import type { Item } from "$lib/types/Item";
  import type { UserApiResponsexd } from "$lib/types/User";
  import dayjs from "dayjs";
  import { inPlaceSort } from "fast-sort";
  import { onMount, tick } from "svelte";
  import { fly } from "svelte/transition";
  import Loading from "../../../lib/components/Loading.svelte";
  import Profile from "./Profile.svelte";
  import Punishment from "./Punishment.svelte";
  import SmallInfo from "./SmallInfo.svelte";

  interface Props {
    baseData: {
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
    userData: UserApiResponsexd | Promise<UserApiResponsexd>;
    items: Item[];
    gamesPromise: Promise<{
      ok: boolean;
      games: Game[];
    }>;
    gamesBefore: number;
  }

  let { baseData, userData, items, gamesPromise, gamesBefore }: Props = $props();

  let games: Game[] = $state([]);
  let gamesStatus: "more" | "loading" | "complete" | "error" = $state("more");

  async function loadMore() {
    const id = await Promise.resolve(userData).then((r) => r.id);
    gamesStatus = "loading";
    console.log("fetching more");

    const response = await fetch(
      `/api/game?before=${gamesBefore}&take=100&skip=${games.length}&user=${id}`,
    );
    const json = await response.json();

    if (json.games.length > 0) {
      games.push(...json.games);
      gamesStatus = "more";
    } else if (json.ok && json.games.length === 0) {
      gamesStatus = "complete";
    } else {
      gamesStatus = "error";
    }
  }

  onMount(async () => {
    if ($page.params.search.match(/^\d{17,19}$/)) {
      tick().then(() => replaceState(`/user/${baseData.lastKnownUsername}`, {}));
    }

    const resolved = await Promise.resolve(gamesPromise);
    if (resolved.ok) {
      games.push(...resolved.games);
    }
  });
</script>

<div class="mx-3 mb-10 mt-7 flex flex-col sm:mx-auto md:w-full md:max-w-3xl">
  <Profile {baseData} {userData} {items} />

  <div in:fly|global={{ delay: 400, duration: 500, y: 30 }}>
    {#if baseData.blacklisted}
      <Punishment>
        {baseData.lastKnownUsername} is blacklisted from nypsi
      </Punishment>
    {:else}
      {#await userData then userData}
        {#if userData.Economy?.banned && new Date(userData.Economy.banned).getTime() > Date.now()}
          <Punishment>
            {userData.lastKnownUsername} is economy banned until {new Date(
              userData.Economy.banned,
            ).toLocaleDateString()}
          </Punishment>
        {/if}
      {/await}
    {/if}
  </div>

  {#if userData}
    {#await userData}
      <div class="mt-14">
        <Loading fadeInSettings={{ delay: 500, duration: 300 }} />
      </div>
    {:then userData}
      {#if userData.Economy}
        <div
          class="mt-4 flex w-full flex-row gap-4"
          in:fly|global={{ delay: 500, duration: 500, y: 75 }}
        >
          <SmallInfo>
            <h2>favourite command</h2>
            <p class="line-clamp-1 text-sm lg:text-base">
              ${userData.CommandUse[0]?.command}
              ({userData.CommandUse[0]?.uses.toLocaleString()} uses)
            </p>
          </SmallInfo>

          <SmallInfo>
            <h2>daily streak</h2>
            <p class="text-sm text-slate-300 lg:text-base">
              {(userData.Economy?.dailyStreak || 0).toLocaleString()}
            </p>
          </SmallInfo>
        </div>

        <div in:fly|global={{ delay: 600, duration: 500, y: 75 }}>
          {#if userData.Economy.EconomyGuildMember?.guild}
            <div
              class="ho mt-4 flex w-full flex-col rounded-lg border border-primary border-opacity-5 bg-base-200 p-4 duration-300 hover:border-opacity-20"
            >
              <h2 class="text-center">
                <a
                  href="/guild/{userData.Economy.EconomyGuildMember.guild.guildName.replaceAll(
                    ' ',
                    '-',
                  )}"
                  class="link-hover text-lg text-white lg:text-2xl"
                >
                  {userData.Economy.EconomyGuildMember.guild.guildName} [{userData.Economy
                    .EconomyGuildMember.guild.level}]
                </a>
              </h2>

              <div class="mt-2 flex w-full flex-row">
                <div class="flex grow flex-col text-center">
                  <h3 class="text-white lg:text-xl">balance</h3>
                  <p class="text-sm lg:text-base">
                    ${userData.Economy.EconomyGuildMember.guild.balance.toLocaleString()}
                  </p>
                </div>
                <div class="flex grow flex-col text-center">
                  <h3 class="text-white lg:text-xl">xp</h3>
                  <p class="text-sm lg:text-base">
                    {userData.Economy.EconomyGuildMember.guild.xp.toLocaleString()}xp
                  </p>
                </div>
              </div>

              <div class="mt-4 flex w-full flex-row flex-wrap justify-center gap-2">
                {#each userData.Economy.EconomyGuildMember.guild.members as member}
                  <a
                    class="rounded-lg border border-primary border-opacity-5 bg-base-300 p-2 text-xs shadow duration-300 hover:border-opacity-25 hover:text-primary lg:text-sm"
                    href="/user/{member.economy.user.id}">{member.economy.user.lastKnownUsername}</a
                  >
                {/each}
              </div>
            </div>
          {/if}
        </div>

        <div in:fly|global={{ delay: 700, duration: 500, y: 75 }}>
          {#if userData.Economy.Inventory.length > 1}
            <div
              class="mt-4 flex w-full flex-col justify-center rounded-lg border border-primary border-opacity-5 bg-base-200 p-4 duration-300 hover:border-opacity-20"
              id="inventory"
            >
              <h2 class="mb-3 w-full text-center">inventory</h2>
              <div
                class="lg:max-h-84 mt-3 grid max-h-64 grid-flow-row grid-cols-2 gap-2 overflow-y-auto"
              >
                {#each inPlaceSort(userData.Economy.Inventory).asc((i) => i.item) as item}
                  {#if items.find((i) => i.id === item.item)}
                    <a
                      href="/item/{item.item}"
                      class="hover:bg-opacity- mx-2 flex flex-col items-center justify-center rounded-lg border border-primary border-opacity-5 bg-base-300 py-2 align-middle text-xs shadow duration-300 hover:border-opacity-25 lg:text-sm"
                    >
                      <div
                        class="flex h-6 w-6 items-center justify-center align-middle lg:h-8 lg:w-8"
                      >
                        <img
                          loading="lazy"
                          class="h-auto max-h-full w-auto max-w-full object-contain"
                          src={items.find((i) => i.id === item.item)?.emoji}
                          alt=""
                          decoding="async"
                        />
                      </div>
                      <p class="my-1">{items.find((i) => i.id === item.item)?.name}</p>
                      <p>{item.amount.toLocaleString()}</p>
                    </a>
                  {/if}
                {/each}
              </div>
            </div>
          {/if}
        </div>

        <div
          class="mt-4 flex w-full flex-row gap-4"
          in:fly|global={{ delay: 800, duration: 500, y: 75 }}
        >
          <SmallInfo>
            <h2>last seen</h2>

            <p class="text-sm lg:text-base">
              {#if dayjs(userData.lastCommand).isBefore(dayjs().subtract(3, "months"))}
                {new Date(userData.lastCommand).toLocaleDateString()}
              {:else if daysAgo(userData.lastCommand) < 1}
                {@const hours = (dayjs().unix() - dayjs(userData.lastCommand).unix()) / 3600}
                {#if hours < 1}
                  just now
                {:else}
                  {Math.floor(hours)} hour{Math.floor(hours) > 1 ? "s" : ""} ago
                {/if}
              {:else}
                {daysAgo(userData.lastCommand).toLocaleString()} day{daysAgo(userData.lastCommand) >
                1
                  ? "s"
                  : ""} ago
              {/if}
            </p>
          </SmallInfo>

          <SmallInfo>
            <h2>completion</h2>
            <p class="text-sm lg:text-base">
              {#await fetch("https://raw.githubusercontent.com/mxz7/nypsi/main/data/achievements.json").then( (r) => r.json(), )}
                calculating...
              {:then achievementData}
                {(
                  (userData.Achievements.length / Object.keys(achievementData).length) *
                  100
                ).toPrecision(3)}%
              {/await}
            </p>
          </SmallInfo>
        </div>

        <div in:fly|global={{ delay: 900, duration: 500, y: 75 }}>
          {#if userData.Leaderboards.length > 0}
            <div
              class="mt-4 flex w-full flex-col justify-center rounded-lg border border-primary border-opacity-5 bg-base-200 p-4 duration-300 hover:border-opacity-20"
              id="leaderboards"
            >
              <h2 class="mb-3 w-full text-center">leaderboards</h2>
              <div
                class="lg:max-h-84 mt-3 grid max-h-64 grid-flow-row grid-cols-2 gap-2 overflow-y-auto"
              >
                {#each inPlaceSort(userData.Leaderboards).asc((i) => i.position) as lb}
                  <a
                    href="/item/{lb.leaderboard.replace('item-', '')}"
                    class="mx-2 flex flex-col items-center justify-center rounded-lg border border-primary border-opacity-5 bg-base-300 py-2 align-middle text-xs shadow duration-300 hover:border-opacity-25 lg:text-sm"
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
                          decoding="async"
                        />
                      </div>
                      <p class="my-1 {lb.position === 1 ? 'text-primary' : ''}">
                        {items.find((i) => i.id === lb.leaderboard.split("-")[1])?.name}
                      </p>
                    {:else}
                      <p class="my-1">
                        {lb.leaderboard}
                      </p>
                    {/if}

                    <p class={lb.position === 1 ? "text-primary" : ""}>
                      #{lb.position}
                    </p>
                  </a>
                {/each}
              </div>
            </div>
          {/if}
        </div>

        <div in:fly|global={{ delay: 1000, duration: 500, y: 75 }}>
          {#if games.length > 0}
            <div
              class="mx-auto mt-4 rounded-lg border border-primary border-opacity-5 bg-base-200 p-4 duration-300 hover:border-opacity-20 lg:w-full"
            >
              <h2 class="text-center">recent games</h2>
              <div class="max-h-64 overflow-y-auto">
                <div
                  class="mx-4 mt-4 flex flex-col gap-2 px-2 lg:grid lg:grid-cols-2 lg:gap-x-6 lg:px-0"
                >
                  {#each games as game}
                    <a
                      href="/game/{game.id.toString(36)}"
                      class=" w-full justify-center rounded-lg border border-primary border-opacity-10 bg-base-300 p-2 px-4 align-middle shadow duration-300 hover:border-opacity-25 lg:mt-0
                    {game.win === 0
                        ? 'text-error'
                        : game.win === 1
                          ? 'text-success'
                          : 'text-warning'}"
                    >
                      <h3 class="text-center lg:text-lg">{game.game.replaceAll("_", " ")}</h3>

                      {#if !game.game.includes("scratch")}
                        <p class="mt-2 text-center text-sm font-semibold lg:text-base">
                          {game.win == 1
                            ? `+$${game.earned.toLocaleString()}`
                            : game.win == 0
                              ? `-$${game.bet.toLocaleString()}`
                              : `$${game.bet.toLocaleString()}`}
                        </p>
                      {/if}

                      <p class="mt-2 text-center text-xs text-slate-500">
                        {game.id.toString(36)} | {new Date(game.date).toLocaleDateString()}
                      </p>
                    </a>
                  {/each}
                </div>
                <div class="mt-4 flex w-full justify-center">
                  {#if gamesStatus === "more"}
                    <button class="btn" onclick={() => loadMore()}>load more</button>
                  {:else if gamesStatus === "loading"}
                    <button class="btn btn-disabled" aria-label="loading"
                      ><span class="loading loading-spinner"></span></button
                    >
                  {:else if gamesStatus === "error"}
                    <button class="btn btn-disabled btn-error">error</button>
                  {/if}
                </div>
              </div>
            </div>
          {/if}
        </div>

        <div in:fly|global={{ delay: 1100, duration: 500, y: 75 }} class="w-full">
          {#if userData.WordleStats}
            <div
              class="mx-auto mt-4 flex w-fit flex-col rounded-lg border border-primary border-opacity-5 bg-base-200 p-4 duration-300 hover:border-opacity-20"
              id="wordle"
            >
              <h2 class="mb-2 text-center lg:mb-4">wordle</h2>

              <div class="flex w-full flex-col justify-center text-lg text-success">
                {#if userData.WordleStats.win1}
                  <div
                    class="flex max-w-fit flex-row items-center align-middle [&>img]:h-6 [&>img]:w-6 lg:[&>img]:h-8 lg:[&>img]:w-8"
                  >
                    <img
                      loading="lazy"
                      src="https://cdn.discordapp.com/emojis/1118558624197902347.png"
                      alt=""
                      decoding="async"
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
                      decoding="async"
                    />
                    <img
                      loading="lazy"
                      src="https://cdn.discordapp.com/emojis/1118558624197902347.png"
                      alt=""
                      decoding="async"
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
                      decoding="async"
                    />
                    <img
                      loading="lazy"
                      src="https://cdn.discordapp.com/emojis/987046773157691452.png"
                      alt=""
                      decoding="async"
                    />
                    <img
                      loading="lazy"
                      src="https://cdn.discordapp.com/emojis/1118558624197902347.png"
                      alt=""
                      decoding="async"
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
                      decoding="async"
                    />
                    <img
                      loading="lazy"
                      src="https://cdn.discordapp.com/emojis/987046773157691452.png"
                      alt=""
                      decoding="async"
                    />
                    <img
                      loading="lazy"
                      src="https://cdn.discordapp.com/emojis/987046773157691452.png"
                      alt=""
                      decoding="async"
                    />
                    <img
                      loading="lazy"
                      src="https://cdn.discordapp.com/emojis/1118558624197902347.png"
                      alt=""
                      decoding="async"
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
                      decoding="async"
                    />
                    <img
                      loading="lazy"
                      src="https://cdn.discordapp.com/emojis/987046773157691452.png"
                      alt=""
                      decoding="async"
                    />
                    <img
                      loading="lazy"
                      src="https://cdn.discordapp.com/emojis/987046773157691452.png"
                      alt=""
                      decoding="async"
                    />
                    <img
                      loading="lazy"
                      src="https://cdn.discordapp.com/emojis/987046773157691452.png"
                      alt=""
                      decoding="async"
                    />
                    <img
                      loading="lazy"
                      src="https://cdn.discordapp.com/emojis/1118558624197902347.png"
                      alt=""
                      decoding="async"
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
                      decoding="async"
                    />
                    <img
                      loading="lazy"
                      src="https://cdn.discordapp.com/emojis/987046773157691452.png"
                      alt=""
                      decoding="async"
                    />
                    <img
                      loading="lazy"
                      src="https://cdn.discordapp.com/emojis/987046773157691452.png"
                      alt=""
                      decoding="async"
                    />
                    <img
                      loading="lazy"
                      src="https://cdn.discordapp.com/emojis/987046773157691452.png"
                      alt=""
                      decoding="async"
                    />
                    <img
                      loading="lazy"
                      src="https://cdn.discordapp.com/emojis/987046773157691452.png"
                      alt=""
                      decoding="async"
                    />
                    <img
                      loading="lazy"
                      src="https://cdn.discordapp.com/emojis/1118558624197902347.png"
                      alt=""
                      decoding="async"
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
                      decoding="async"
                    />
                    <p class="ml-2 text-error">
                      {userData.WordleStats.lose.toLocaleString()}
                    </p>
                  </div>
                {/if}

                {#if userData.WordleStats.history.length > 1}
                  <p class="mt-2 text-center text-xs text-base-content lg:text-sm">
                    average winning game takes {MStoTime(
                      userData.WordleStats.history.reduce((a, b) => a + b) /
                        userData.WordleStats.history.length,
                    )}
                  </p>
                {/if}
              </div>
            </div>
          {/if}
        </div>
      {/if}
    {/await}
  {/if}
</div>

<style>
  h2 {
    @apply font-semibold text-white lg:text-lg;
  }

  h3 {
    @apply font-medium;
  }
</style>
