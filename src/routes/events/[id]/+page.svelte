<script lang="ts">
  import { auth } from "$lib/state.svelte";
  import { onMount } from "svelte";
  import Event from "../Event.svelte";

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
  <title>event {data.event.id} {data.eventsData[data.event.type].name} | nypsi</title>
  <meta name="og:title" content="event {data.event.id} {data.eventsData[data.event.type].name} " />
  <link rel="canonical" href="https://nypsi.xyz/events/{data.event.id}" />
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
