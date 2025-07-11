<script lang="ts">
  import { invalidate } from "$app/navigation";
  import Card from "$lib/components/Card.svelte";
  import sleep from "$lib/functions/sleep.js";
  import ms from "ms";
  import { onMount } from "svelte";
  import { cubicOut } from "svelte/easing";
  import { Tween } from "svelte/motion";

  let { data } = $props();

  let progress = new Tween(0, { easing: cubicOut, duration: 1000 });
  let progressBar = $state<Tween<number> | undefined>(new Tween(0));

  function setValues() {
    const contributions = data.event.contributions
      .map((i) => i.contribution)
      .reduce((a, b) => a + b, 0n);

    progress.set(Number(contributions));
    progressBar = new Tween(0, { easing: cubicOut, duration: 1000 });
    progressBar.set(Number(contributions) / Number(data.event.target));
  }

  async function update() {
    console.log("updating data");
    progressBar = undefined;
    await Promise.all([sleep(3000), invalidate("event")]);
    setValues();
    setTimeout(() => {
      update();
    }, 30000);
  }

  onMount(() => {
    setValues();

    setTimeout(() => {
      update();
    }, 30000);
  });
</script>

<svelte:head>
  <title>events | nypsi</title>
  <meta name="og:title" content="events" />
</svelte:head>

<div class="mx-auto mt-7 flex w-full flex-col gap-4 px-3 lg:max-w-2xl lg:px-0">
  {#if data.event}
    <Card class="flex flex-col text-center" mode="main">
      <header class="text-3xl font-bold">
        <span class="text-slate-400">#{data.event.id}</span>
        <h1 class="inline text-white">
          {data.eventsData[data.event.type].name}
        </h1>
      </header>

      <p class="flex justify-center gap-1">
        hosted by <a
          class="link link-primary flex items-center gap-1 underline-offset-2"
          href="/user/{data.event.owner.id}"
        >
          <img src={data.event.owner.avatar} class="h-4 rounded-full" alt="" />
          <span>{data.event.owner.lastKnownUsername}</span>
        </a>
      </p>

      <p>
        {data.eventsData[data.event.type].description.replace(
          "{target}",
          data.event.target.toLocaleString(),
        )}
      </p>

      <div class=" my-4 flex flex-col gap-1">
        <span class="text-xs">
          {Math.round(progress.current).toLocaleString()} / {data.event.target.toLocaleString()}
        </span>

        {#if progressBar?.current}
          <progress class="progress progress-primary w-full" value={progressBar?.current}
          ></progress>
        {:else}
          <progress class="progress progress-primary w-full"></progress>
        {/if}
      </div>

      <footer class="text-sm opacity-75">
        {#if data.event.completed}
          <p>this event was completed at {data.event.completedAt.toLocaleTimeString()}</p>
        {:else}
          <p>
            ends {#if data.event.expiresAt.getTime() - Date.now() > ms("1 day")}
              on {data.event.expiresAt.toLocaleDateString()}
            {:else}
              at {data.event.expiresAt.toLocaleTimeString()}
            {/if}
          </p>
        {/if}
      </footer>
    </Card>

    <Card mode="section" class="flex flex-col gap-3">
      <h2 class="w-full text-center text-xl font-bold text-white">leaderboards</h2>

      {#if data.userPosition}
        <p class="text-center text-sm">
          you are <span class="text-primary">#{data.userPosition}</span>
        </p>
      {/if}

      <ol class="flex flex-col gap-2">
        {#each data.event.contributions as user, i}
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
              <span>{user.user.lastKnownUsername}</span>
            </a>

            <span class="grow text-right">
              {user.contribution.toLocaleString()}
            </span>
          </li>
        {/each}
      </ol>
    </Card>
  {:else}
    <h1 class="text-center text-3xl font-bold text-white">no active event</h1>
  {/if}

  {#await data.pastEvents then pastEvents}
    {#if pastEvents.length > 0}
      <section class="mt-3">
        <h2 class="text-2xl font-bold text-white">past events</h2>

        <ol class="mt-2 grid grid-cols-2 gap-3">
          {#each pastEvents as event}
            <Card mode="anchor" href="/event/{event.id}">
              <header class="text-lg font-semibold">
                <span class="text-slate-400">#{data.event.id}</span>
                <h3 class="inline text-white">
                  {data.eventsData[data.event.type].name}
                </h3>
              </header>

              {#if event.completed}
                <p class="text-sm opacity-75">
                  completed at {new Date(event.completedAt).toLocaleDateString()}
                </p>
              {:else}
                <p class="text-sm opacity-75">
                  ended at {new Date(event.expiresAt).toLocaleDateString()}
                </p>
              {/if}
            </Card>
          {/each}
        </ol>
      </section>
    {/if}
  {/await}
</div>
