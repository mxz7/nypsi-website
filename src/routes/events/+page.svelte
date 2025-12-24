<script lang="ts">
  import Card from "$lib/components/ui/Card.svelte";
  import Main from "$lib/components/ui/Main.svelte";
  import { auth } from "$lib/state.svelte";
  import { onMount } from "svelte";
  import Event from "./Event.svelte";

  let { data } = $props();

  onMount(() => {
    if (data.auth) {
      auth.value = {
        ...data.auth,
        authenticated: true,
      };
    }
  });
</script>

<svelte:head>
  <title>events | nypsi</title>
  <meta name="og:title" content="events" />
</svelte:head>

<Main class="mx-auto mt-7 flex w-full flex-col gap-4 px-3 lg:max-w-2xl lg:px-0">
  {#if data.event}
    <Event
      event={data.event}
      userPosition={data.userPosition}
      eventsData={data.eventsData}
      totalUsers={data.totalUsers}
      totalContribution={data.totalContribution}
    />
  {:else}
    <h1 class="text-center text-3xl font-bold text-white">no active event</h1>
  {/if}

  {#await data.pastEvents then pastEvents}
    {#if pastEvents.length > 0}
      <section class="mt-3">
        <h2 class="text-2xl font-bold text-white">past events</h2>

        <ol class="mt-2 grid grid-cols-2 gap-3">
          {#each pastEvents as event}
            <Card mode="anchor" href="/events/{event.id}">
              <header class="text-lg font-semibold">
                <span class="text-slate-400">#{event.id}</span>
                <h3 class="inline text-white">
                  {data.eventsData[event.type].name}
                </h3>
              </header>

              {#if event.completed}
                <p class="text-sm opacity-75">
                  completed {new Date(event.completedAt).toLocaleDateString()}
                </p>
              {:else}
                <p class="text-sm opacity-75">
                  ended {new Date(event.expiresAt).toLocaleDateString()}
                </p>
              {/if}
            </Card>
          {/each}
        </ol>
      </section>
    {/if}
  {/await}
</Main>
