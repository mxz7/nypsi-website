<script lang="ts">
  import type { Tag } from "$lib/functions/tags";
  import { daysAgo } from "$lib/functions/time";
  import type Game from "$lib/types/Game";
  import type { Item } from "$lib/types/Item";
  import type { UserApiResponsexd } from "$lib/types/User";
  import dayjs from "dayjs";
  import { inPlaceSort } from "fast-sort";
  import { onMount } from "svelte";
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
        embedColor: string;
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
    tagData: { [key: string]: Tag };
  }

  let { baseData, userData, items, gamesPromise, gamesBefore, tagData }: Props = $props();

  let games: Game[] = $state([]);
  let gamesStatus: "more" | "loading" | "complete" | "error" = $state("more");

  async function loadMore() {
    const id = await Promise.resolve(userData).then((r) => r.id);
    gamesStatus = "loading";
    console.log("fetching more");

    const response = await fetch(
      `/api/games?before=${gamesBefore}&take=100&skip=${games.length}&user=${id}`,
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
    const resolved = await Promise.resolve(gamesPromise);
    if (resolved.ok) {
      games.push(...resolved.games);
    }
  });
</script>

<div class="mx-3 mt-7 mb-10 flex flex-col sm:mx-auto md:w-full md:max-w-3xl">
  <Profile {baseData} {userData} {items} {tagData} />

  {#if baseData.blacklisted}
    <Punishment>
      {baseData.lastKnownUsername} is blacklisted from nypsi
    </Punishment>
  {:else}
    {#await userData then userData}
      {#if userData.Economy?.banned && new Date(userData.Economy.banned).getTime() > Date.now()}
        <div in:fly|global={{ delay: 400, duration: 500, y: 30 }}>
          <Punishment>
            {userData.lastKnownUsername} is economy banned until {new Date(
              userData.Economy.banned,
            ).toLocaleDateString()}
          </Punishment>
        </div>
      {/if}
    {/await}
  {/if}

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
        </div>

        <div in:fly|global={{ delay: 600, duration: 500, y: 75 }}>
          {#if userData.Economy.EconomyGuildMember?.guild}
            <section
              class="border-primary/5 bg-base-200 hover:border-primary/20 mt-4 flex w-full flex-col rounded-lg border p-4 duration-300"
            >
              <h2 class="text-center">
                <a
                  href="/guilds/{userData.Economy.EconomyGuildMember.guild.guildName.replaceAll(
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
                    class="border-primary/5 bg-base-200 hover:border-primary/20 hover:text-primary rounded-lg border p-2 text-xs shadow-sm duration-300 lg:text-sm"
                    href="/user/{member.economy.user.id}">{member.economy.user.lastKnownUsername}</a
                  >
                {/each}
              </div>
            </section>
          {/if}
        </div>

        <div in:fly|global={{ delay: 700, duration: 500, y: 75 }}>
          {#if userData.Economy.Inventory.length > 1}
            <section
              class="border-primary/5 bg-base-200 hover:border-primary/20 mt-4 flex w-full flex-col justify-center rounded-lg border p-4 duration-300"
              id="inventory"
            >
              <h2 class="mb-3 w-full text-center">inventory</h2>
              <div
                class="mt-3 grid max-h-64 grid-flow-row grid-cols-2 gap-2 overflow-y-auto lg:max-h-84"
              >
                {#each inPlaceSort(userData.Economy.Inventory).asc((i) => i.item) as item}
                  {@const itemData = items.find((i) => i.id === item.item)}
                  {#if itemData}
                    <a
                      href="/items/{item.item}"
                      class="border-primary/5 bg-base-200 hover:border-primary/20 mx-2 flex flex-col items-center justify-center rounded-lg border py-2 align-middle text-xs shadow-sm duration-300 lg:text-sm"
                    >
                      <div
                        class="flex h-6 w-6 items-center justify-center align-middle lg:h-8 lg:w-8"
                      >
                        <img
                          loading="lazy"
                          class="h-auto max-h-full w-auto max-w-full object-contain"
                          src={itemData.emoji}
                          alt=""
                          decoding="async"
                        />
                      </div>
                      <p class="my-1">{itemData.name}</p>
                      <p>{item.amount.toLocaleString()}</p>
                    </a>
                  {/if}
                {/each}
              </div>
            </section>
          {/if}
        </div>

        <div
          class="mt-4 flex w-full flex-row gap-4"
          in:fly|global={{ delay: 800, duration: 500, y: 75 }}
        >
          <SmallInfo>
            <h2>daily streak</h2>
            <p class="text-sm text-slate-300 lg:text-base">
              {(userData.Economy?.dailyStreak || 0).toLocaleString()}
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
            <section
              class="border-primary/5 bg-base-200 hover:border-primary/20 mt-4 flex w-full flex-col justify-center rounded-lg border p-4 duration-300"
              id="leaderboards"
            >
              <h2 class="mb-3 w-full text-center">leaderboards</h2>
              <div
                class="mt-3 grid max-h-64 grid-flow-row grid-cols-2 gap-2 overflow-y-auto lg:max-h-84"
              >
                {#each inPlaceSort(userData.Leaderboards).asc((i) => i.position) as lb}
                  <a
                    href="/leaderboard/{lb.leaderboard.replace('item-', '')}"
                    class="border-primary/5 bg-base-200 hover:border-primary/20 mx-2 flex flex-col items-center justify-center rounded-lg border py-2 align-middle text-xs shadow-sm duration-300 lg:text-sm"
                  >
                    {#if lb.leaderboard.startsWith("item-")}
                      {@const itemData = items.find((i) => i.id === lb.leaderboard.split("-")[1])}
                      <div
                        class="flex h-6 w-6 items-center justify-center align-middle lg:h-8 lg:w-8"
                      >
                        <img
                          loading="lazy"
                          class="h-auto max-h-full w-auto max-w-full object-contain"
                          src={itemData.emoji}
                          alt=""
                          decoding="async"
                        />
                      </div>
                      <p class="my-1 {lb.position === 1 ? 'text-primary' : ''}">
                        {itemData.name}
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
            </section>
          {/if}
        </div>

        <div in:fly|global={{ delay: 1000, duration: 500, y: 75 }}>
          {#if games.length > 0}
            <section
              class="border-primary/5 bg-base-200 hover:border-primary/20 mx-auto mt-4 rounded-lg border p-4 duration-300 lg:w-full"
            >
              <h2 class="text-center">recent games</h2>
              <div class="max-h-64 overflow-y-auto">
                <div
                  class="mx-4 mt-4 flex flex-col gap-2 px-2 lg:grid lg:grid-cols-2 lg:gap-x-6 lg:px-0"
                >
                  {#each games as game}
                    <a
                      href="/games/{game.id.toString(36)}"
                      class=" border-primary/10 bg-base-300 hover:border-primary/25 w-full justify-center rounded-lg border p-2 px-4 align-middle shadow duration-300 lg:mt-0
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
            </section>
          {/if}
        </div>
      {/if}
    {/await}
  {/if}
</div>

<style>
  @reference "../../../app.css";

  h2 {
    @apply font-semibold text-white lg:text-lg;
  }

  h3 {
    @apply font-medium;
  }
</style>
