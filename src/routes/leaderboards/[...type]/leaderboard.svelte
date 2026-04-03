<script lang="ts">
  import { getTagsRemote } from "$lib/api/tags.remote";
  import { pluralize } from "$lib/functions/string";
  import { Crown, LoaderCircle } from "@lucide/svelte";
  import { fade } from "svelte/transition";
  import { twMerge } from "tailwind-merge";
  import type { getData } from "./page.remote";

  interface LeaderboardProps {
    title: string;
    data: Awaited<ReturnType<typeof getData>>;
    userRoute: string;
    descriptor?: string;
    descriptorPlural?: string;
    loading: boolean;
  }

  const tags = await getTagsRemote();

  let { title, data, userRoute, descriptor, descriptorPlural, loading }: LeaderboardProps =
    $props();
</script>

{#snippet head()}
  <thead class="sr-only">
    <tr class="text-sm uppercase">
      <th>rank</th>
      <th>user</th>
      <th class="text-right">value</th>
    </tr>
  </thead>
{/snippet}

{#snippet columns()}
  <colgroup>
    <col class="w-14 md:w-16" />
    <col />
    <col class="w-36 md:w-44" />
  </colgroup>
{/snippet}

{#snippet row(
  position: number,
  value: string,
  user?: { id: string; username: string; tag?: string },
)}
  <tr>
    <td
      class="w-14 rounded-l-lg py-3 pr-1 pl-1 text-center font-mono text-sm whitespace-nowrap md:py-5 md:pl-3 {position ===
      1
        ? 'text-primary font-semibold'
        : 'text-base-content/75'}"
    >
      {#if position === 1}
        <Crown size={20} class="inline" />
      {:else}
        {position.toLocaleString()}
      {/if}
    </td>

    <td class="w-full min-w-0 py-3 pl-2 md:py-5">
      <span class="flex min-w-0 items-center gap-1">
        {#if user?.id}
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
            class="{position === 1
              ? 'text-primary font-semibold'
              : ''} link-hover block min-w-0 overflow-hidden text-sm text-ellipsis whitespace-nowrap underline-offset-2 md:text-base"
          >
            {user.username}
          </a>
        {:else}
          <a
            href="/wiki/economy/user-settings/hidden"
            class="{position === 1
              ? 'text-primary font-semibold'
              : ''} link-hover block min-w-0 overflow-hidden text-sm text-ellipsis whitespace-nowrap underline-offset-2 md:text-base"
          >
            {"[hidden]"}
          </a>
        {/if}
      </span>
    </td>

    <td
      class="rounded-r-lg py-3 pr-2 text-right text-sm md:py-5 md:pr-3 md:text-base {position === 1
        ? 'text-primary font-semibold'
        : ''}"
    >
      <span class="whitespace-nowrap">{value}</span>
      {#if descriptor}
        <span class="hidden lg:inline">
          {["solved", "wins"].includes(descriptor)
            ? descriptor
            : pluralize(descriptor, Number(value) || 1, descriptorPlural)}</span
        >
      {/if}
    </td>
  </tr>
{/snippet}

<h1 class="text-2xl font-bold md:text-4xl">{title}</h1>

{#key data}
  <div class="mt-4 px-0">
    {#if loading}
      <div class="flex justify-center py-12" transition:fade={{ duration: 100 }}>
        <LoaderCircle class="text-primary animate-spin" size={32} strokeWidth={2.5} />
      </div>
    {:else}
      {@const tableClasses = "table table-fixed table-sm md:table-md w-full"}
      {@const tableModifiers =
        "[&_tbody_tr:nth-child(odd)]:bg-base-200 [&_tbody_td]:border-b-0 [&_tbody_tr:nth-child(even)]:bg-transparent"}

      <div in:fade={{ duration: 200, delay: 100 }} out:fade={{ duration: 100 }}>
        {#if data.userPosition}
          {@const pos = data.userPosition}

          <h2 class="text-base-content/50 font-semibold">your position</h2>
          <table class={twMerge(tableClasses, tableModifiers, "mt-1")}>
            {@render columns()}
            {@render head()}

            <tbody>
              {@render row(pos.position, pos.value, data.userData)}
            </tbody>
          </table>

          <div class="divider"></div>
        {/if}

        <table class={twMerge(tableClasses, tableModifiers)}>
          {@render columns()}
          {@render head()}

          <tbody>
            {#each data.data as { position, user, value }, i}
              {@render row(
                position,
                value,
                user.id ? { id: user.id, username: user.username, tag: user.tag } : null,
              )}
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
{/key}
