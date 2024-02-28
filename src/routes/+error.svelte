<script>
  import { page } from "$app/stores";
</script>

<svelte:head>
  <title>{$page.status} - {$page.error.message} / nypsi</title>
</svelte:head>

<div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
  <h1 class="text-9xl font-bold text-accent">{$page.status}</h1>
  <p class="text-lg text-slate-400">{$page.error.message}</p>
</div>
