<script lang="ts">
  import { getTagsRemote } from "$lib/api/tags.remote";
  import type { LeaderboardData } from "$lib/types/LeaderboardData";
  import { Crown, LoaderCircle } from "@lucide/svelte";

  interface Props {
    title: string;
    data: LeaderboardData | Promise<LeaderboardData>;
    userRoute: string;
    descriptor?: string;
  }

  const tags = await getTagsRemote();

  let { title, data, userRoute, descriptor = "" }: Props = $props();
</script>

<h1 class="text-2xl font-bold md:text-4xl">{title}</h1>
{#if data}
  <div class="mt-4 px-0">
    {#await data}
      <div class="flex justify-center py-12">
        <LoaderCircle class="text-primary animate-spin" size={32} strokeWidth={2.5} />
      </div>
    {:then data}
      <table
        class="table-sm md:table-md [&_tbody_tr:nth-child(odd)]:bg-base-200/80 table w-full [&_tbody_td]:border-b-0 [&_tbody_td]:align-middle [&_tbody_td:first-child]:w-px [&_tbody_tr]:border-b-0 [&_tbody_tr:nth-child(even)]:bg-transparent [&_thead_th:first-child]:w-px"
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
                class="rounded-l-lg py-3 pr-0 pl-1 text-center text-sm whitespace-nowrap md:py-5 md:pl-3 md:text-base {i ===
                0
                  ? 'text-primary font-semibold'
                  : ''}"
              >
                {#if position === 1}
                  <Crown size={24} class="inline" />
                {:else}
                  {position}
                {/if}
              </td>

              <td class="min-w-0 py-3 md:py-5">
                <span class="flex w-full min-w-0 items-center gap-2 md:gap-3">
                  {#if user.id}
                    <span class="flex min-w-0 items-center gap-1">
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
                    </span>
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
                class="rounded-r-lg py-3 pr-1 text-right text-sm md:py-5 md:pr-3 md:text-base {i ===
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
    {/await}
  </div>
{/if}
