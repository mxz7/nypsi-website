<script lang="ts">
  import type { LeaderboardData } from "$lib/types/LeaderboardData";
  import User from "./user.svelte";
  import Guild from "./guild.svelte";

  interface Props {
    data: LeaderboardData;
    title: string;
    type: "user" | "guild";
    valueSuffix?: string;
  }

  let { data, title, type }: Props = $props();
</script>

<div class="w-full max-w-md">
  <h2 class="text-center text-lg font-bold text-white md:text-2xl">{title}</h2>
  <div class="bg-primary m-auto mt-1 h-1 w-1/2 rounded-full"></div>
  {#if data}
    <div class="mt-4 px-4 sm:px-0 md:text-lg">
      <div class="flex flex-col gap-2">
        {#each data.slice(0, 10) as { position, user, guild, value }, i}
          <div
            class="bg-base-200 hover:border-primary/20 flex w-full items-center gap-2 rounded-lg border px-2 py-2 duration-200
              ease-in hover:scale-105 {i === 0
              ? 'border-primary/40 hover:border-primary/60 md:hover:scale-110 lg:scale-105'
              : ' border-slate-400/5 hover:border-slate-400/20 '}"
          >
            <div class="text-slate-400 {i === 0 ? 'font-semibold' : ''}">#{position}</div>

            {#if type === "user" && user}
              <div class="flex w-full items-center overflow-hidden">
                <User {user} pos={position} />
              </div>
            {/if}

            {#if type === "guild" && guild}
              <div class="flex w-full items-center overflow-hidden text-white">
                <Guild {guild} pos={position} />
              </div>
            {/if}

            <div
              class="{i === 0
                ? 'text-primary font-semibold'
                : 'text-slate-300'} w-fit pl-2 text-right whitespace-nowrap"
            >
              {value}
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
