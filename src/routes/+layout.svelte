<script>
  import { dev } from "$app/environment";
  import { page } from "$app/stores";
  import GAnalytics from "$lib/components/GAnalytics.svelte";
  import Navigation from "$lib/components/Navigation.svelte";
  import { inject } from "@vercel/analytics";
  import { onMount } from "svelte";
  import "../app.css";

  export let data;

  inject({ mode: dev ? "development" : "production" });

  onMount(() => {
    console.log($page.url.toString());
  });
</script>

<svelte:head>
  <meta name="og:url" content={$page.url.toString()} />
</svelte:head>

<GAnalytics />

<Navigation user={data.user} />

<slot />
