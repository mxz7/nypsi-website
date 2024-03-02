<script lang="ts">
  import tooltip from "$lib/Tooltips";
  import parseEmoji from "$lib/functions/parseEmoji";
  import type { LeaderboardData } from "$lib/types/LeaderboardData";
  import { fade } from "svelte/transition";

  export let title: string;
  export let data: LeaderboardData | Promise<LeaderboardData>;
  export let tags: Promise<{ [key: string]: { tagId: string; emoji: string; name: string } }>;
</script>

<div class="max-w-sm">
  <h2 class="text-center text-lg font-semibold md:text-xl">{title}</h2>
  <div class="m-auto mt-1 h-1 w-1/2 rounded-full bg-accent" />
  {#if data}
    <div class="mt-4 px-4 sm:px-0 md:text-lg">
      {#await data}
        <div out:fade={{ duration: 100 }} class="flex flex-col gap-2">
          {#each new Array(10) as _, i}
            <div
              class="flex w-full items-center gap-2 rounded-lg border border-slate-400 border-opacity-5 bg-slate-950 bg-opacity-20 px-2 py-2 duration-200 ease-in hover:scale-105 hover:border-accent hover:border-opacity-20"
            >
              <div class="my-1 h-4 w-8 animate-pulse rounded-xl bg-slate-600" />
              <div
                style="width: {Math.floor(Math.random() * 13) + 4}rem"
                class="my-1 h-4 animate-pulse rounded-xl md:h-5 {i === 0
                  ? 'bg-accent'
                  : 'bg-slate-400'}"
              />
              <div class="grow"></div>
              <div
                style="width: {Math.floor(Math.random() * 4) + 4}rem"
                class="h-4 animate-pulse rounded-xl {i === 0 ? 'bg-accent' : 'bg-slate-500'}"
              />
            </div>
          {/each}
        </div>
      {:then data}
        <div in:fade={{ delay: 100, duration: 100 }} class="flex flex-col gap-2">
          {#each data.slice(0, 10) as { position, user, value }, i}
            <div
              class="flex w-full items-center gap-2 rounded-lg border border-slate-400 border-opacity-5 bg-slate-950 bg-opacity-20 px-2 py-2 duration-200 ease-in hover:scale-105 hover:border-accent hover:border-opacity-20"
            >
              <div class="text-slate-400 {i === 0 ? 'font-semibold' : ''}">#{position}</div>

              <div class="flex w-full items-center overflow-hidden">
                {#if user.id}
                  {#if user.tag}
                    {#await tags then tags}
                      <p>[</p>
                      <img
                        class="h-5 sm:h-6"
                        src={parseEmoji(tags[user.tag]?.emoji)}
                        alt=""
                        use:tooltip={{
                          placement: "top",
                          content: tags[user.tag]?.name,
                          followCursor: true,
                        }}
                      />
                      <p class="mr-1">]</p>
                    {/await}
                  {/if}
                  <a
                    class="{i === 0
                      ? 'font-semibold text-accent'
                      : 'text-slate-300'} min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap"
                    href="/user/{user.id}"
                  >
                    {user.username}
                  </a>
                {:else}
                  <a
                    href={user.username === "[hidden]"
                      ? "https://docs.nypsi.xyz/economy/hidden"
                      : `/user/${user.id}`}
                    class="{i === 0
                      ? 'font-semibold text-accent'
                      : 'text-slate-300'} min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap"
                  >
                    {user.username}
                  </a>
                {/if}
              </div>

              <div
                class="{i === 0
                  ? 'font-semibold text-accent'
                  : 'text-slate-300'} w-fit whitespace-nowrap pl-2 text-right"
              >
                {value}
              </div>
            </div>
          {/each}
        </div>
      {/await}
    </div>
  {/if}
</div>
