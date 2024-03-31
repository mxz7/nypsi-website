<script>
  import { page } from "$app/stores";
  import { auth } from "$lib/data/stores";

  export let data;

  $auth = { authenticated: Boolean(data.user), user: data.user };
</script>

<svelte:head>
  {#if !data.premium}
    <title>item history data / nypsi</title>
  {/if}
</svelte:head>

{#if data.premium}
  <slot />
{:else if data.user}
  <h1 class="mt-10 text-center text-2xl font-bold text-white">
    you need a <a href="https://ko-fi.com/tekoh/tiers" target="_blank" class="text-accent underline"
      >premium membership</a
    > to view item history
  </h1>
{:else}
  <h1 class="mt-10 text-center text-2xl font-bold text-white">
    you must be logged in to view item history
  </h1>
  <div class="mt-4 flex w-full justify-center">
    <a
      class="rounded bg-slate-950 bg-opacity-50 p-2 px-3 text-lg font-semibold text-slate-200 duration-100 hover:bg-opacity-90"
      href="/login?next={encodeURIComponent($page.url.pathname)}">log in</a
    >
  </div>
{/if}
