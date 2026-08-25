<script lang="ts">
  import {
    getLeaderboardUpdates,
    type LeaderboardStreamMessage,
  } from "$lib/api/leaderboards/updates.remote";
  import { compareLeaderboardValues, formatTime } from "$lib/api/leaderboards/shared";
  import { handleFallbackImage } from "$lib/functions/image";
  import { pluralize } from "$lib/functions/string";
  import { Crown, LoaderCircle } from "@lucide/svelte";
  import { onMount, untrack } from "svelte";
  import { flip } from "svelte/animate";
  import { fade, scale } from "svelte/transition";
  import { twMerge } from "tailwind-merge";
  import type { getData } from "./page.remote";

  interface LeaderboardProps {
    title: string;
    leaderboardType: string;
    data: Awaited<ReturnType<typeof getData>>;
    userRoute: string;
    descriptor?: string;
    descriptorPlural?: string;
    loading: boolean;
  }

  let {
    title,
    leaderboardType,
    data,
    userRoute,
    descriptor,
    descriptorPlural,
    loading,
  }: LeaderboardProps = $props();

  const leaderboardUpdates = getLeaderboardUpdates(untrack(() => leaderboardType));
  await leaderboardUpdates;

  let rows = $state(untrack(() => data.data));
  // The live query can coalesce increment events; retain the last stream total
  // so the next received event can include all missed increments.
  const incrementStates = new Map<string, { streamId: string; total: bigint }>();

  function formatValue(value: string) {
    if (leaderboardType === "level") return value;
    if (["balance", "net-worth"].includes(leaderboardType)) {
      return `$${BigInt(value).toLocaleString()}`;
    }
    if (leaderboardType === "guilds") return `level ${BigInt(value).toLocaleString()}`;
    if (
      [
        "wordle-time",
        "chess-fastest",
        "chatreaction-daily",
        "chatreaction-alltime",
        "flag-time",
        "sudoku-fastest",
      ].includes(leaderboardType)
    ) {
      return formatTime(Number(value));
    }
    if (leaderboardType === "chess-rating") return Number(value).toFixed(0);
    return BigInt(value).toLocaleString();
  }

  function applyUpdate(update: LeaderboardStreamMessage) {
    if (update.type === "ready") {
      incrementStates.clear();
      return;
    }

    const { event } = update;
    let increment = 0n;

    if (event.increment) {
      increment = BigInt(event.value);

      if (event.incrementTotal !== undefined && event.streamId !== undefined) {
        const total = BigInt(event.incrementTotal);
        const previous = incrementStates.get(event.entityId);
        const previousTotal = previous?.streamId === event.streamId ? previous.total : 0n;
        increment = total - previousTotal;
        incrementStates.set(event.entityId, { streamId: event.streamId, total });
      }
    } else {
      incrementStates.delete(event.entityId);
    }

    const existing = rows.find((row) => row.user?.id === event.entityId);
    if (!existing) return;

    const value = event.increment
      ? (
          BigInt(existing.value.replaceAll(",", "").replace("$", "").replace("level ", "")) +
          increment
        ).toString()
      : event.value;
    const nextRows = rows.filter((row) => row.user?.id !== event.entityId);
    nextRows.push({ ...existing, value: formatValue(value) });

    rows = nextRows
      .toSorted((a, b) => compareLeaderboardValues(leaderboardType, a.value, b.value))
      .slice(0, 100)
      .map((row, index) => ({ ...row, position: index + 1 }));
  }

  onMount(() => {
    const iterator = leaderboardUpdates[Symbol.asyncIterator]();
    let active = true;

    const consumeUpdates = async () => {
      while (active) {
        const { value, done } = await iterator.next();
        if (done || !active) break;
        applyUpdate(value);
      }
    };

    void consumeUpdates().catch(() => {});

    return () => {
      active = false;
      void iterator.return?.();
    };
  });
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

{#snippet cells(
  position: number,
  value: string,
  user?: { id: string; username: string; avatar?: string },
)}
  <td
    class="text-base-content/50 w-14 rounded-l-lg py-4 pr-1 pl-1 text-center whitespace-nowrap md:pl-3 {position ===
    1
      ? 'text-primary'
      : ''}"
  >
    {#if position === 1}
      <Crown size={20} class="inline" />
    {:else}
      #{position.toLocaleString()}
    {/if}
  </td>

  <td class="w-full min-w-0 py-4 pl-2">
    <div class="flex min-w-0 items-center gap-3">
      {#if user?.id}
        {#if user.avatar}
          <div class="avatar flex-none">
            <div class="{position === 1 ? 'size-10' : 'size-9'} rounded-full">
              <img
                src={user.avatar}
                width={position === 1 ? 40 : 36}
                height={position === 1 ? 40 : 36}
                onerror={handleFallbackImage}
                alt=""
                decoding="async"
                loading={position <= 10 ? "eager" : "lazy"}
              />
            </div>
          </div>
        {/if}
        <a
          href={`${userRoute}/${user.id.replaceAll(" ", "-")}`}
          class="{position === 1
            ? 'text-primary text-lg'
            : 'text-base'} link-hover block min-w-0 overflow-hidden font-semibold text-ellipsis whitespace-nowrap"
        >
          {user.username}
        </a>
      {:else}
        <a
          href="/wiki/economy/user-settings/hidden"
          class="{position === 1
            ? 'text-primary text-lg'
            : 'text-base'} link-hover block min-w-0 overflow-hidden font-semibold text-ellipsis whitespace-nowrap"
        >
          [hidden]
        </a>
      {/if}
    </div>
  </td>

  <td
    class="rounded-r-lg py-4 pr-2 text-right text-base font-medium whitespace-nowrap tabular-nums md:pr-3 {position ===
    1
      ? 'text-primary'
      : ''}"
  >
    {#key value}
      <span class="inline-block whitespace-nowrap" in:scale={{ duration: 180, start: 0.8 }}
        >{value}</span
      >
    {/key}
    {#if descriptor}
      <span class="hidden lg:inline">
        {["solved", "wins"].includes(descriptor)
          ? descriptor
          : pluralize(descriptor, Number(value.replaceAll(",", "")) || 1, descriptorPlural)}</span
      >
    {/if}
  </td>
{/snippet}

<h1 class="text-3xl font-bold text-white">{title}</h1>

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
              <tr>
                {@render cells(pos.position, pos.value, data.userData)}
              </tr>
            </tbody>
          </table>

          <div class="divider"></div>
        {/if}

        <table class={twMerge(tableClasses, tableModifiers)}>
          {@render columns()}
          {@render head()}

          <tbody>
            {#each rows as { position, user, value } (user?.id ?? position)}
              <tr animate:flip={{ duration: 180 }}>
                {@render cells(
                  position,
                  value,
                  user?.id ? { id: user.id, username: user.username, avatar: user.avatar } : null,
                )}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
{/key}
