<script lang="ts">
  import { getEventsPageData } from "$lib/api/events.remote";
  import Card from "$lib/components/ui/card.svelte";
  import Main from "$lib/components/ui/main.svelte";
  import { History } from "@lucide/svelte";
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
      <h2 class="mb-3 flex items-center gap-2 text-xl font-bold">
        <span class="rounded-box bg-base-300 p-2">
          <History class="text-primary size-5" aria-hidden={true} />
        </span>
        past events
      </h2>

      <ol class="grid grid-cols-2 gap-3">
        {#each data.pastEvents as event (event.id)}
          <Card mode="anchor" href="/events/{event.id}">
            <header class="text-lg font-semibold">
              <span class="text-base-content/50">#{event.id}</span>
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
