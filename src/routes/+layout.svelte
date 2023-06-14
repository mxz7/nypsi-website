<script>
  import { dev } from "$app/environment";
  import GAnalytics from "$lib/components/GAnalytics.svelte";
  import Navigation from "$lib/components/Navigation.svelte";
  import { inject } from "@vercel/analytics";
  import "../app.css";

  export let data;

  inject({ mode: dev ? "development" : "production" });
</script>

<GAnalytics />

<Navigation user={data.user} />

<slot />
