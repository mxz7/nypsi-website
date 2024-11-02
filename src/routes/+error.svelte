<script>
  import { page } from "$app/stores";
</script>

<svelte:head>
  <title>{$page.status} - {$page.error.message} / nypsi</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<div class="mt-24 flex w-full justify-center">
  <div class="text-center">
    <h1 class="text-9xl font-extrabold text-primary">{$page.status}</h1>
    <p class="text-lg text-slate-400">{$page.error.message}</p>
  </div>
</div>
