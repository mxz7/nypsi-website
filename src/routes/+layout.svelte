<script>
  import { dev } from "$app/environment";
  import { page } from "$app/stores";
  import GAnalytics from "$lib/components/GAnalytics.svelte";
  import Navigation from "$lib/components/Navigation.svelte";
  import { inject } from "@vercel/analytics";
  import "../app.css";

  export let data;

  inject({ mode: dev ? "development" : "production" });
</script>

<svelte:head>
  <meta name="og:url" content={$page.url.toString()} />
</svelte:head>

<GAnalytics />

<Navigation user={data.streamed.user} />

<slot />
