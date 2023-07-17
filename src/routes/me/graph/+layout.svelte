<script>
  export let data;
</script>

<svelte:head>
  <title>graphs | nypsi</title>
</svelte:head>

{#if data.premium}
  <slot />
{:else}
  <h1 class="mt-10 text-center text-xl font-bold text-white">
    you need a <a href="https://ko-fi.com/tekoh/tiers" target="_blank" class="text-accent underline"
      >premium membership</a
    > to view your graphs
  </h1>
{/if}
