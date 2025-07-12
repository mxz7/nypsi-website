<script lang="ts">
  import Event from "../Event.svelte";

  let { data } = $props();
</script>

<svelte:head>
  <title>event {data.event.id} {data.eventsData[data.event.type].name} | nypsi</title>
  <meta name="og:title" content="event {data.event.id} {data.eventsData[data.event.type].name} " />
</svelte:head>

<div class="mx-auto mt-7 flex w-full flex-col gap-4 px-3 lg:max-w-2xl lg:px-0">
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
</div>
