<script>
  import { page } from "$app/stores";
</script>

<svelte:head>
  <title>{$page.error.message} / nypsi</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<div class="w-full text-center">
  <h1 class="text-8xl font-bold text-primary">{$page.status}</h1>
  <p class="text-lg text-slate-400">{$page.error.message}</p>
</div>
