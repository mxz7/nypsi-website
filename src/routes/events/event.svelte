<script lang="ts">
  import { getEventUpdates, type EventProgressUpdate } from "$lib/api/events.remote";
  import Card from "$lib/components/ui/card.svelte";
  import type { getEventData } from "$lib/functions/items";
  import { pluralize } from "$lib/functions/string";
  import { daysUntil } from "$lib/functions/time";
  import type { NypsiEvent } from "$lib/server/functions/event";
  import ms from "ms";
  import { untrack } from "svelte";
  import { flip } from "svelte/animate";
  import { slide } from "svelte/transition";
  import EventUser from "./event-user.svelte";

  interface Props {
    event: NypsiEvent;
    totalContribution: number;
    userPosition?: number;
    totalUsers?: Promise<number>;
    eventsData: Awaited<ReturnType<typeof getEventData>>;
  }

  let { event, userPosition, eventsData, totalUsers, totalContribution }: Props = $props();

  const eventUpdates = $derived(event.endedAt ? undefined : getEventUpdates(event.id));
  const progress = $derived.by(() => {
    const total = eventUpdates?.current?.totalProgress ?? totalContribution;
    return event.target ? Math.min(total, Number(event.target)) : total;
  });
  let contributions = $derived(event.contributions);

  function mergeContribution(current: NypsiEvent["contributions"], update: EventProgressUpdate) {
    const contribution = {
      contribution: BigInt(update.userProgress),
      user: update.user,
    };

    return [contribution, ...current.filter((entry) => entry.user.id !== update.userId)]
      .toSorted(
        (a, b) =>
          Number(b.contribution - a.contribution) ||
          a.user.lastKnownUsername.localeCompare(b.user.lastKnownUsername),
      )
      .slice(0, 10);
  }

  $effect(() => {
    const update = eventUpdates?.current;
    if (update)
      contributions = mergeContribution(
        untrack(() => contributions),
        update,
      );
  });
</script>

<Card class="relative flex flex-col text-center" focused mode="section">
  <header class="text-3xl font-bold">
    <span class="opacity-75">#{event.id}</span>
    <h1 class="inline text-white">
      {eventsData[event.type].name}
    </h1>
  </header>

  <p class="flex justify-center gap-1">
    hosted by <a
      class="link link-primary flex items-center gap-1 underline-offset-2"
      href="/users/{event.owner.id}"
    >
      <img src={event.owner.avatar} class="h-4 rounded-full" alt="" />
      <span>{event.owner.lastKnownUsername}</span>
    </a>
  </p>

  <p>
    {eventsData[event.type].description.replace("{target}", event.target?.toLocaleString() ?? "")}
  </p>

  <div class=" my-4 flex flex-col gap-1">
    {#if event.target}
      <span class="text-xs">
        {progress.toLocaleString()} / {event.target.toLocaleString()}
      </span>

      {#if progress}
        <progress class="progress progress-primary w-full" value={progress / Number(event.target)}
        ></progress>
      {:else}
        <progress class="progress progress-primary w-full"></progress>
      {/if}
    {:else}
      <span>
        total:
        {progress.toLocaleString()}
      </span>
    {/if}
  </div>

  <footer class="text-sm opacity-75">
    {#if event.endedAt}
      {@const date = new Date(event.endedAt || event.expiresAt)}
      <p>
        completed <time datetime={date.toUTCString()}
          >{date.toLocaleTimeString()}
          {date.toLocaleDateString()}</time
        >
      </p>
    {:else if event.expiresAt}
      <p>
        ends {#if new Date(event.expiresAt).getTime() - Date.now() > ms("1 day")}
          in {daysUntil(event.expiresAt)} {pluralize("day", daysUntil(event.expiresAt))}
        {:else}
          at {new Date(event.expiresAt).toLocaleTimeString()}
        {/if}
      </p>
    {/if}
  </footer>

  {#if !event.endedAt}
    <div
      class="tooltip tooltip-left tooltip-success absolute right-4 inline-grid *:[grid-area:1/1]"
      aria-label={eventUpdates?.connected ? "live updates" : "reconnecting"}
      data-tip={eventUpdates?.connected ? "live updates" : "reconnecting"}
    >
      {#if eventUpdates?.connected}
        <span class="status status-success animate-ping" aria-hidden={true}></span>
        <span class="status status-success" aria-hidden={true}></span>
      {:else}
        <span class="status status-warning" aria-hidden={true}></span>
      {/if}
    </div>
  {/if}
</Card>

<Card mode="section" class="flex flex-col gap-3">
  <h2 class="w-full text-center text-xl font-bold text-white">leaderboard</h2>

  {#if userPosition && userPosition > 0 && totalUsers}
    {@const word = event.endedAt ? "were" : "are"}

    <p class="text-center text-sm">
      {#await totalUsers}
        you {word} <span class="text-primary">#{userPosition.toLocaleString()}</span>
      {:then totalUsers}
        you {word} <span class="text-primary">#{userPosition.toLocaleString()}</span><span
          class="opacity-60">/{totalUsers.toLocaleString()}</span
        >
      {/await}
    </p>
  {/if}

  <ol class="flex flex-col gap-2">
    {#each contributions as user, i (user.user.id)}
      <li in:slide={{ duration: 180 }} animate:flip={{ duration: 180 }}>
        <EventUser position={i + 1} {user} />
      </li>
    {/each}
  </ol>
</Card>
