<script lang="ts">
  import { getEventUpdates, type EventProgressUpdate } from "$lib/api/events.remote";
  import Card from "$lib/components/ui/card.svelte";
  import type { getEventData } from "$lib/functions/items";
  import { pluralize } from "$lib/functions/string";
  import { daysUntil } from "$lib/functions/time";
  import type { NypsiEvent } from "$lib/server/functions/event";
  import { Trophy } from "@lucide/svelte";
  import ms from "ms";
  import { untrack } from "svelte";
  import { flip } from "svelte/animate";
  import { scale, slide } from "svelte/transition";
  import EventUser from "./event-user.svelte";

  interface Props {
    event: NypsiEvent;
    totalContribution: number;
    userPosition?: number;
    totalUsers?: number;
    eventsData: Awaited<ReturnType<typeof getEventData>>;
  }

  let { event, userPosition, eventsData, totalUsers, totalContribution }: Props = $props();

  const eventUpdates = $derived(event.endedAt ? undefined : getEventUpdates(event.id));
  const initialEventUpdate = $derived(eventUpdates ? await eventUpdates : undefined);

  const progress = $derived.by(() => {
    const currentEventUpdate = eventUpdates?.current;
    const total =
      currentEventUpdate?.type === "update"
        ? currentEventUpdate.totalProgress
        : (initialEventUpdate?.totalProgress ??
          currentEventUpdate?.totalProgress ??
          totalContribution);
    return event.target ? Math.min(total, Number(event.target)) : total;
  });
  let contributions = $derived(
    initialEventUpdate?.type === "snapshot"
      ? initialEventUpdate.contributions
      : event.contributions,
  );

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
    if (update?.type === "update")
      contributions = mergeContribution(
        untrack(() => contributions),
        update,
      );
  });
</script>

<Card class="relative flex flex-col gap-4" focused mode="section">
  <header class="pr-8">
    <p class="text-base-content/50 text-sm">event #{event.id}</p>
    <h1 class="text-3xl font-bold text-white">{eventsData[event.type].name}</h1>
  </header>

  <p class="text-base-content/80">
    {eventsData[event.type].description.replace("{target}", event.target?.toLocaleString() ?? "")}
  </p>

  <div class="border-base-300 border-y py-4">
    <p class="text-base-content/50 text-sm">
      {event.target ? "progress" : "total contributions"}
    </p>
    <div class="mt-1 flex items-end justify-between gap-3">
      <p class="text-3xl font-bold tracking-tight text-white tabular-nums">
        {#key progress}
          <span class="inline-block" in:scale={{ duration: 220, start: 0.65 }}>
            {progress.toLocaleString()}
          </span>
        {/key}
      </p>

      {#if event.target}
        <span class="text-base-content/60 pb-1 text-sm tabular-nums">
          / {event.target.toLocaleString()}
        </span>
      {/if}
    </div>

    {#if event.target}
      <progress
        class="progress progress-primary mt-3 block w-full"
        value={progress}
        max={Number(event.target)}
      ></progress>
    {/if}
  </div>

  <footer class="text-base-content/60 flex flex-wrap items-center justify-between gap-3 text-sm">
    <p class="flex items-center gap-1.5">
      hosted by
      <a class="link link-primary flex items-center gap-1" href="/users/{event.owner.id}">
        <img
          src={event.owner.avatar}
          class="size-5 rounded-full"
          alt=""
          onerror={(e) =>
            ((e.target as HTMLImageElement).src = "https://cdn.discordapp.com/embed/avatars/0.png")}
        />
        <span>{event.owner.lastKnownUsername}</span>
      </a>
    </p>

    {#if event.endedAt}
      {@const date = new Date(event.endedAt || event.expiresAt)}
      <p>completed <time datetime={date.toUTCString()}>{date.toLocaleDateString()}</time></p>
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
      class="tooltip tooltip-left tooltip-success absolute top-4 right-4 inline-grid *:[grid-area:1/1]"
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

<Card mode="section" class="overflow-hidden p-2">
  <div class="flex items-center justify-between gap-3 px-3 py-2">
    <h2 class="flex items-center gap-2 text-xl font-bold">
      <span class="rounded-box bg-base-300 p-2">
        <Trophy class="text-primary size-5" aria-hidden={true} />
      </span>
      leaderboard
    </h2>

    {#if userPosition && userPosition > 0 && totalUsers}
      {@const word = event.endedAt ? "were" : "are"}
      <p class="text-sm">
        you {word} <span class="text-primary">#{userPosition.toLocaleString()}</span><span
          class="text-base-content/50">/{totalUsers.toLocaleString()}</span
        >
      </p>
    {/if}
  </div>

  <ol class="list" aria-live="polite">
    {#each contributions as user, i (user.user.id)}
      <li
        class="list-row border-base-300 rounded-none border-b px-3 py-3 last:border-b-0"
        in:slide={{ duration: 180 }}
        animate:flip={{ duration: 180 }}
      >
        <EventUser position={i + 1} {user} />
      </li>
    {/each}
  </ol>
</Card>
