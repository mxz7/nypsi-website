<script>
  import { page } from "$app/state";
</script>

<svelte:head>
  <title>unknown user | nypsi</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<h1 class="w-full text-center text-xl font-bold text-slate-200">
  {#if page.url.searchParams.get("user")}
    couldn't find a user matching <span class="font-mono opacity-80"
      >{page.url.searchParams.get("user")}</span
    >
  {:else}
    unknown user
  {/if}
</h1>
