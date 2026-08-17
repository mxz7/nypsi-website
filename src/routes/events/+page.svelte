<script lang="ts">
  import { getEventsPageData } from "$lib/api/events.remote";
  import Card from "$lib/components/ui/card.svelte";
  import Main from "$lib/components/ui/main.svelte";
  import Event from "./event.svelte";

  const data = await getEventsPageData();
</script>

<svelte:head>
  <title>events | nypsi</title>
  <meta name="og:title" content="events" />
</svelte:head>

<Main class="mx-auto flex w-full flex-col gap-4 px-3 lg:max-w-2xl lg:px-0">
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

  {#if data.pastEvents.length > 0}
    <section class="mt-3">
      <h2 class="text-2xl font-bold text-white">past events</h2>

      <ol class="mt-2 grid grid-cols-2 gap-3">
        {#each data.pastEvents as event (event.id)}
          <Card mode="anchor" href="/events/{event.id}">
            <header class="text-lg font-semibold">
              <span class="text-slate-400">#{event.id}</span>
              <h3 class="inline text-white">
                {data.eventsData[event.type].name}
              </h3>
            </header>

            <p class="text-sm opacity-75">
              completed {new Date(event.endedAt!).toLocaleDateString()}
            </p>
          </Card>
        {/each}
      </ol>
    </section>
  {/if}
</Main>
