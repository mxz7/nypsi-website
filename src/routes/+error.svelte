<script>
  import { page } from "$app/stores";
</script>

<svelte:head>
  <title>{$page.status} - {$page.error.message} / nypsi</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
  <h1 class="text-9xl font-extrabold text-primary">{$page.status}</h1>
  <p class="text-lg text-slate-400">{$page.error.message}</p>
  <p class="font-mono text-xs text-slate-600">{$page.error.errorId}</p>
</div>
