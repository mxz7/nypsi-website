<script lang="ts">
  import tooltip from "$lib/Tooltips";
  import parseEmoji from "$lib/functions/parseEmoji";
  import type { LeaderboardData } from "$lib/types/LeaderboardData";
  import { fade } from "svelte/transition";

  interface Props {
    title: string;
    data: LeaderboardData | Promise<LeaderboardData>;
    tags: { [key: string]: { tagId: string; emoji: string; name: string } };
    href?: string;
    limit?: number;
  }

  let { title, data, tags, limit = 10, href = "/users/" }: Props = $props();
</script>

<div class="">
  <h2 class="text-center text-lg font-bold text-white md:text-2xl">{title}</h2>
  <div class="bg-primary m-auto mt-1 h-1 w-1/2 rounded-full"></div>
  {#if data}
    <div class="mt-4 px-4 sm:px-0 md:text-lg">
      {#await data}
        <div out:fade={{ duration: 100 }} class="flex flex-col gap-2">
          {#each new Array(10) as _, i}
            <div
              class="bg-base-200 hover:border-primary/20 flex w-full items-center gap-2 rounded-lg border border-slate-400/5 px-2 py-2 duration-200 ease-in hover:scale-105
              {i === 0
                ? 'border-primary/40 hover:border-primary/60 md:hover:scale-110 lg:scale-105'
                : 'border-slate-400/5 hover:border-slate-400/20 '}"
            >
              <div class="my-1 h-4 w-8 animate-pulse rounded-xl bg-slate-600"></div>
              <div
                style="width: {Math.floor(Math.random() * 13) + 4}rem"
                class="my-1 h-4 animate-pulse rounded-xl md:h-5 {i === 0
                  ? 'bg-primary'
                  : 'bg-slate-400'}"
              ></div>
              <div class="grow"></div>
              <div
                style="width: {Math.floor(Math.random() * 4) + 4}rem"
                class="h-4 animate-pulse rounded-xl {i === 0 ? 'bg-primary' : 'bg-slate-500'}"
              ></div>
            </div>
          {/each}
        </div>
      {:then data}
        <div in:fade={{ delay: 100, duration: 100 }} class="flex flex-col gap-2">
          {#each data.slice(0, limit) as { position, user, value }, i}
            <div
              class="bg-base-200 hover:border-primary/20 flex w-full items-center gap-2 rounded-lg border px-2 py-2
              duration-200 ease-in hover:scale-105 {i === 0
                ? 'border-primary/40 hover:border-primary/60 md:hover:scale-110 lg:scale-105'
                : 'border-slate-400/5 hover:border-slate-400/20 '}"
            >
              <div class="text-slate-400 {i === 0 ? 'font-semibold' : ''}">#{position}</div>

              <div class="flex w-full items-center overflow-hidden">
                {#if user.id}
                  {#if user.tag}
                    <span
                      class="user-tag"
                      use:tooltip={{
                        placement: "top",
                        content: tags[user.tag]?.name,
                        followCursor: true,
                      }}
                    >
                      <img
                        class="h-5 w-5 object-contain sm:h-6 sm:w-6"
                        height="32"
                        width="32"
                        src={parseEmoji(tags[user.tag]?.emoji)}
                        alt=""
                        decoding="async"
                      />
                    </span>
                  {/if}
                  <a
                    class="{i === 0
                      ? 'text-primary font-semibold'
                      : 'text-slate-300'} min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
                    href="{href}{user.id}"
                  >
                    {user.username}
                  </a>
                {:else}
                  <a
                    href={user.username === "[hidden]"
                      ? "/docs/economy/user-settings/hidden"
                      : `/users/${user.id}`}
                    class="{i === 0
                      ? 'text-primary font-semibold'
                      : 'text-slate-300'} min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
                  >
                    {user.username}
                  </a>
                {/if}
              </div>

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
      {/await}
    </div>
  {/if}
</div>

<style>
  @reference "../../app.css";

  .user-tag {
    @apply mr-1 flex items-center;
  }

  .user-tag::before {
    content: "[";
  }

  .user-tag::after {
    content: "]";
  }
</style>
