<script lang="ts">
  import { invalidate } from "$app/navigation";
  import Card from "$lib/components/Card.svelte";
  import type { getEventData } from "$lib/functions/items";
  import { pluralize } from "$lib/functions/string";
  import { daysUntil } from "$lib/functions/time";
  import type { NypsiEvent } from "$lib/server/functions/event";
  import ms from "ms";
  import { onDestroy, onMount } from "svelte";
  import { cubicOut } from "svelte/easing";
  import { Tween } from "svelte/motion";
  import EventUser from "./EventUser.svelte";

  interface Props {
    event: NypsiEvent;
    totalContribution: number;
    userPosition?: number;
    totalUsers?: Promise<number>;
    eventsData: Awaited<ReturnType<typeof getEventData>>;
  }

  let { event, userPosition, eventsData, totalUsers, totalContribution }: Props = $props();

  const progress = new Tween(totalContribution, { easing: cubicOut, duration: 3000 });
  const progressBar = new Tween(totalContribution / Number(event.target), {
    easing: cubicOut,
    duration: 3000,
  });

  let timeout: ReturnType<typeof setTimeout>;

  function setValues() {
    progress.set(totalContribution);
    progressBar.set(totalContribution / Number(event.target));
  }

  async function update() {
    console.log("updating data");
    await invalidate("event");
    setValues();

    timeout = setTimeout(() => {
      update();
    }, 10000);
  }

  onMount(() => {
    timeout = setTimeout(() => {
      update();
    }, 10000);
  });

  onDestroy(() => {
    clearTimeout(timeout);
  });
</script>

<Card class="flex flex-col text-center" mode="main">
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
    {eventsData[event.type].description.replace("{target}", event.target.toLocaleString())}
  </p>

  <div class=" my-4 flex flex-col gap-1">
    <span class="text-xs">
      {Math.round(progress.current).toLocaleString()} / {event.target.toLocaleString()}
    </span>

    {#if progressBar?.current}
      <progress class="progress progress-primary w-full" value={progressBar?.current}></progress>
    {:else}
      <progress class="progress progress-primary w-full"></progress>
    {/if}
  </div>

  <footer class="text-sm opacity-75">
    {#if event.completed}
      <p>this event was completed at {new Date(event.completedAt).toLocaleTimeString()}</p>
    {:else if new Date(event.expiresAt).getTime() - Date.now() < 0}
      <p>this event expired at {new Date(event.completedAt).toLocaleTimeString()}</p>
    {:else}
      <p>
        ends {#if new Date(event.expiresAt).getTime() - Date.now() > ms("1 day")}
          in {daysUntil(event.expiresAt)} {pluralize("day", daysUntil(event.expiresAt))}
        {:else}
          at {new Date(event.expiresAt).toLocaleTimeString()}
        {/if}
      </p>
    {/if}
  </footer>
</Card>

<Card mode="section" class="flex flex-col gap-3">
  <h2 class="w-full text-center text-xl font-bold text-white">leaderboard</h2>

  {#if userPosition && userPosition > 0 && totalUsers}
    {@const word =
      event.completed || new Date(event.expiresAt).getTime() < Date.now() ? "were" : "are"}
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
    {#each event.contributions as user, i}
      <EventUser position={i + 1} {user} />
    {/each}
  </ol>
</Card>
