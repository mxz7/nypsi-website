<script lang="ts">
  import type { LeaderboardData } from "$lib/types/LeaderboardData";
  import User from "./user.svelte";

  interface Props {
    data: LeaderboardData;
    title: string;
    valueSuffix?: string;
  }

  let { data, title }: Props = $props();
</script>

<div class="w-full max-w-md">
  <h2 class="text-center text-lg font-bold text-white md:text-2xl">{title}</h2>
  <div class="m-auto mt-1 h-1 w-1/2 rounded-full bg-primary"></div>
  {#if data}
    <div class="mt-4 px-4 sm:px-0 md:text-lg">
      <div class="flex flex-col gap-2">
        {#each data.slice(0, 10) as { position, user, value }, i}
          <div
            class="flex w-full items-center gap-2 rounded-lg border bg-base-200 px-2 py-2 duration-200 ease-in
              hover:scale-105 hover:border-primary hover:border-opacity-20 {i === 0
              ? 'border-primary border-opacity-40 hover:border-opacity-60 md:hover:scale-110 lg:scale-105'
              : 'border-slate-400 border-opacity-5 hover:border-opacity-20 '}"
          >
            <div class="text-slate-400 {i === 0 ? 'font-semibold' : ''}">#{position}</div>

            <div class="flex w-full items-center overflow-hidden">
              <User {user} pos={position} />
            </div>
            <div
              class="{i === 0
                ? 'font-semibold text-primary'
                : 'text-slate-300'} w-fit whitespace-nowrap pl-2 text-right"
            >
              {value}
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
