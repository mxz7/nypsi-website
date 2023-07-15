<script lang="ts">
  import Chart from "$lib/components/Chart.svelte";
  import Loading from "$lib/components/Loading.svelte";

  import { fade } from "svelte/transition";

  export let data;
</script>

<svelte:head>
  <title>balance history</title>
  <meta
    name="description"
    content="showing balance history"
  />

  <meta name="og:title" content="balance history" />
  <meta
    name="og:description"
    content="showing balance history"
  />
  <meta name="og:site_name" content="nypsi" />
</svelte:head>


{#await data.streamed.graphData}
  <div class="relative mt-16 flex w-full justify-center">
    <Loading fadeInSettings={{ delay: 50, duration: 50 }} fadeOutSettings={{ duration: 150 }} />
  </div>
{:then graphData}

  {#if graphData === "invalid user"}
  <div class="mb-48 flex justify-center text-xl font-bold text-gray-300">
    <h1>invalid user</h1>
  </div>
  {:else if graphData == "private profile"}
  <div class="mb-48 flex justify-center text-xl font-bold text-gray-300">
    <h1>user has a private profile</h1>
  </div>
  {:else}
    <header class="mb-10 mt-5 text-center sm:mb-3 sm:w-full">
      <h1 class="text-4xl font-bold text-white sm:text-5xl">
        balance history
      </h1>
      <div class="m-auto mt-3 h-1 w-3/4 rounded-full bg-accent sm:w-1/2" />
    </header>

    <div in:fade={{ delay: 150, duration: 300 }}>
      {#if graphData === "not enough data"}
        <div class="mb-48 flex justify-center text-2xl font-semibold text-red-400">
          <h1>not enough data</h1>
        </div>
      {:else if typeof graphData !== "string"}
        <Chart chartData={graphData} user={data.user} />
      {/if}
    </div>
  {/if}
{/await}