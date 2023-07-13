<script>
  export let data;
</script>

<svelte:head>
  <title>item history</title>
</svelte:head>

{#if data.premium}
  <slot />
{:else}
  <h1 class="mt-10 text-center text-xl font-bold text-white">
    you need <a href="https://ko-fi.com/tekoh/tiers" target="_blank" class="text-red-500 underline"
      >premium membership</a
    > to view item history
  </h1>
{/if}
