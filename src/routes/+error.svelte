<script>
  import { page } from "$app/state";
</script>

<svelte:head>
  <title>{page.status} - {page.error.message} | nypsi</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<div class="mt-24 flex w-full justify-center">
  <div class="text-center">
    <h1 class="text-primary text-9xl font-bold">{page.status}</h1>
    {#if page.error}
      <p class="text-lg text-slate-400">{page.error.message}</p>
      <p class="font-mono text-xs text-slate-600">{page.error.errorId}</p>
    {/if}
  </div>
</div>
