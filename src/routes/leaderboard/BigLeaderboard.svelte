<script lang="ts">
  import tooltip from "$lib/Tooltips";
  import parseEmoji from "$lib/functions/parseEmoji";
  import type { LeaderboardData } from "$lib/types/LeaderboardData";
  import { fade } from "svelte/transition";

  export let title: string;
  export let data: LeaderboardData | Promise<LeaderboardData>;
  export let tags:
    | Promise<{ [key: string]: { tagId: string; emoji: string; name: string } }>
    | { [key: string]: { tagId: string; emoji: string; name: string } };
  export let userRoute: string;
</script>

<div class="w-full md:max-w-3xl">
  <h2 class="text-center text-xl font-semibold text-white md:text-2xl">{title}</h2>
  <div class="m-auto mt-1 h-1 w-1/4 rounded-full bg-primary" />
  {#if data}
    <div class="mt-4 px-4 sm:px-0 md:text-xl">
      {#await data}
        <div
          out:fade={{ duration: 100 }}
          in:fade|global={{ delay: 100, duration: 100 }}
          class="flex flex-col gap-2"
        >
          {#each new Array(20) as _, i}
            <div
              class="flex w-full items-center gap-2 rounded-lg border border-slate-400 border-opacity-5 bg-base-200 px-2 py-2 duration-200 ease-in hover:scale-105 hover:border-primary hover:border-opacity-20
              {i === 0
                ? 'border-primary border-opacity-40 hover:border-opacity-60 md:hover:scale-110 lg:scale-105'
                : 'border-slate-400 border-opacity-5 hover:border-opacity-20'}"
            >
              <div class="my-1 h-4 w-8 animate-pulse rounded-xl bg-slate-600" />
              <div
                style="width: {Math.floor(Math.random() * 13) + 4}rem"
                class="my-1 h-4 animate-pulse rounded-xl md:h-5 {i === 0
                  ? 'bg-primary'
                  : 'bg-slate-400'}"
              />
              <div class="grow"></div>
              <div
                style="width: {Math.floor(Math.random() * 4) + 4}rem"
                class="h-4 animate-pulse rounded-xl {i === 0 ? 'bg-primary' : 'bg-slate-500'}"
              />
            </div>
          {/each}
        </div>
      {:then data}
        <div
          in:fade={{ delay: 100, duration: 100 }}
          out:fade|global={{ duration: 100 }}
          class="flex flex-col gap-2"
        >
          {#each data as { position, user, value }, i}
            <div
              class="flex w-full items-center gap-2 rounded-lg border bg-base-200 px-2 py-2 duration-200 ease-in
              hover:scale-105 hover:border-primary {i === 0
                ? 'border-primary border-opacity-40 hover:border-opacity-60 md:hover:scale-110 lg:scale-105'
                : 'border-slate-400 border-opacity-5 hover:border-opacity-20'}"
            >
              <div class="text-slate-400 {i === 0 ? 'font-semibold' : ''}">#{position}</div>

              <div
                class="{i === 0
                  ? 'font-semibold text-primary'
                  : 'text-slate-300'} flex w-full items-center overflow-hidden"
              >
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
                    href="{userRoute}/{user.id}"
                    class="min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap"
                    >{user.username}</a
                  >
                {:else}
                  {user.username}
                {/if}
              </div>

              <div
                class="{i === 0
                  ? 'font-semibold text-primary'
                  : 'text-slate-300'} w-fit whitespace-nowrap pl-4 text-right"
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
