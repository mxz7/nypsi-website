<script>
  import { page } from "$app/stores";

  let { data, children } = $props();

   = { authenticated: Boolean(data.user), user: data.user };
</script>

<svelte:head>
  {#if !data.premium}
    <title>item history data / nypsi</title>
  {/if}
</svelte:head>

{#if data.premium}
  {@render children?.()}
{:else if data.user}
  <h1 class="mt-10 text-center text-2xl font-bold text-white">
    you need a <a
      href="https://ko-fi.com/tekoh/tiers"
      target="_blank"
      class="text-primary underline">premium membership</a
    > to view item history
  </h1>
{:else}
  <h1 class="mt-10 text-center text-2xl font-bold text-white">
    you must be logged in to view item history
  </h1>
  <div class="mt-4 flex w-full justify-center">
    <a class="btn" href="/login?next={encodeURIComponent($page.url.pathname)}">log in</a>
  </div>
{/if}
