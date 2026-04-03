<script lang="ts">
  import { getTagsRemote } from "$lib/api/tags.remote";
  import type { LeaderboardData } from "$lib/types/LeaderboardData";
  import { Crown, LoaderCircle } from "@lucide/svelte";
  import { fade } from "svelte/transition";
  import { twMerge } from "tailwind-merge";

  interface LeaderboardProps {
    title: string;
    data: LeaderboardData;
    userPosition?: unknown;
    userRoute: string;
    descriptor?: string;
    loading: boolean;
  }

  const tags = await getTagsRemote();

  let { title, data, userRoute, descriptor = "", loading }: LeaderboardProps = $props();
</script>

<h1 class="text-2xl font-bold md:text-4xl">{title}</h1>

{#key data}
  <div class="mt-4 px-0">
    {#if loading}
      <div class="flex justify-center py-12" transition:fade={{ duration: 100 }}>
        <LoaderCircle class="text-primary animate-spin" size={32} strokeWidth={2.5} />
      </div>
    {:else}
      {@const tableClasses = "table table-sm md:table-md w-full"}
      {@const tableModifiers =
        "[&_tbody_tr:nth-child(odd)]:bg-base-200 [&_tbody_td]:border-b-0 [&_tbody_tr:nth-child(even)]:bg-transparent"}

      <table
        class={twMerge(tableClasses, tableModifiers)}
        in:fade={{ duration: 200, delay: 100 }}
        out:fade={{ duration: 100 }}
      >
        <thead class="sr-only">
          <tr class="text-sm uppercase">
            <th>rank</th>
            <th>user</th>
            <th class="text-right">value</th>
          </tr>
        </thead>

        <tbody>
          {#each data as { position, user, value }, i}
            <tr>
              <td
                class="w-14 rounded-l-lg py-3 pr-1 pl-1 text-center font-mono text-sm whitespace-nowrap md:py-5 md:pl-3 {i ===
                0
                  ? 'text-primary font-semibold'
                  : 'text-base-content/75'}"
              >
                {#if position === 1}
                  <Crown size={20} class="inline" />
                {:else}
                  {position}
                {/if}
              </td>

              <td class="max-w-48 min-w-0 truncate py-3 pl-2 sm:max-w-full md:py-5">
                <span class="flex items-center gap-1">
                  {#if user.id}
                    {#if user.tag}
                      <span
                        class="tooltip tooltip-top flex flex-none items-center"
                        data-tip={tags[user.tag]?.name}
                      >
                        [
                        <img
                          class="h-5 w-5 object-contain"
                          height="32"
                          width="32"
                          src={tags[user.tag]?.emoji}
                          alt=""
                          decoding="async"
                        />
                        ]
                      </span>
                    {/if}
                    <a
                      href={`${userRoute}/${user.id.replaceAll(" ", "-")}`}
                      class="{i === 0
                        ? 'text-primary font-semibold'
                        : ''} link-hover min-w-0 overflow-hidden text-sm text-ellipsis whitespace-nowrap underline-offset-2 md:text-base"
                    >
                      {user.username}
                    </a>
                  {:else}
                    <a
                      href="/wiki/economy/user-settings/hidden"
                      class="{i === 0
                        ? 'text-primary font-semibold'
                        : ''} link-hover min-w-0 overflow-hidden text-sm text-ellipsis whitespace-nowrap underline-offset-2 md:text-base"
                    >
                      {user.username}
                    </a>
                  {/if}
                </span>
              </td>

              <td
                class="rounded-r-lg py-3 pr-2 text-right text-sm md:py-5 md:pr-3 md:text-base {i ===
                0
                  ? 'text-primary font-semibold'
                  : ''}"
              >
                <span class="whitespace-nowrap">{value}</span>
                {#if descriptor}
                  <span class="hidden lg:inline"> {descriptor}</span>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
{/key}
