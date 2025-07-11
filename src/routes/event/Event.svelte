<script lang="ts">
  import { invalidate } from "$app/navigation";
  import Card from "$lib/components/Card.svelte";
  import type { getEventData } from "$lib/functions/items";
  import sleep from "$lib/functions/sleep";
  import { daysUntil } from "$lib/functions/time";
  import type { CurrentEvent } from "$lib/server/functions/event";
  import { auth } from "$lib/state.svelte";
  import ms from "ms";
  import { onDestroy, onMount } from "svelte";
  import { cubicOut } from "svelte/easing";
  import { Tween } from "svelte/motion";

  interface Props {
    event: CurrentEvent;
    userPosition?: number;
    eventsData: Awaited<ReturnType<typeof getEventData>>;
  }

  let { event, userPosition, eventsData }: Props = $props();

  let progress = new Tween(0, { easing: cubicOut, duration: 1000 });
  let progressBar = $state<Tween<number> | undefined>(new Tween(0));

  let timeout: ReturnType<typeof setTimeout>;

  function setValues() {
    const contributions = event.contributions
      .map((i) => i.contribution)
      .reduce((a, b) => a + b, 0n);

    progress.set(Number(contributions));
    progressBar = new Tween(0, { easing: cubicOut, duration: 1000 });
    progressBar.set(Number(contributions) / Number(event.target));
  }

  async function update() {
    console.log("updating data");
    progressBar = undefined;
    await Promise.all([sleep(3000), invalidate("event")]);
    setValues();
    timeout = setTimeout(() => {
      update();
    }, 30000);
  }

  onMount(() => {
    setValues();

    timeout = setTimeout(() => {
      update();
    }, 30000);
  });

  onDestroy(() => {
    clearTimeout(timeout);
  });
</script>

<Card class="flex flex-col text-center" mode="main">
  <header class="text-3xl font-bold">
    <span class="text-slate-400">#{event.id}</span>
    <h1 class="inline text-white">
      {eventsData[event.type].name}
    </h1>
  </header>

  <p class="flex justify-center gap-1">
    hosted by <a
      class="link link-primary flex items-center gap-1 underline-offset-2"
      href="/user/{event.owner.id}"
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
      <p>this event was completed at {event.completedAt.toLocaleTimeString()}</p>
    {:else if event.expiresAt.getTime() - Date.now() < 0}
      <p>this event expired at {event.completedAt.toLocaleTimeString()}</p>
    {:else}
      <p>
        ends {#if event.expiresAt.getTime() - Date.now() > ms("1 day")}
          in {daysUntil(event.expiresAt)} days
        {:else}
          at {event.expiresAt.toLocaleTimeString()}
        {/if}
      </p>
    {/if}
  </footer>
</Card>

<Card mode="section" class="flex flex-col gap-3">
  <h2 class="w-full text-center text-xl font-bold text-white">leaderboard</h2>

  {#if userPosition && userPosition > 0}
    <p class="text-center text-sm">
      you are <span class="text-primary">#{userPosition}</span>
    </p>
  {/if}

  <ol class="flex flex-col gap-2">
    {#each event.contributions as user, i}
      <li class="bg-base-300 flex w-full items-center gap-3 rounded-lg p-3">
        <span class="w-8 text-right text-slate-400">#{i + 1}</span>
        <a
          href="/user/{user.user.id}"
          class="link-hover flex items-center gap-2 {i === 0
            ? 'text-primary text-lg font-semibold'
            : ''}"
        >
          <img
            src={user.user.avatar}
            class="{i === 0 ? 'h-9 w-9' : 'h-6 w-6'} h-6 w-6 rounded-full"
            alt=""
          />
          <span
            class={user.user.id === (auth.value.authenticated && auth.value.user.id)
              ? "text-primary"
              : ""}>{user.user.lastKnownUsername}</span
          >
        </a>

        <span class="grow text-right">
          {user.contribution.toLocaleString()}
        </span>
      </li>
    {/each}
  </ol>
</Card>
