<script>
  import { dev } from "$app/environment";
  import Navigation from "$lib/components/Navigation.svelte";
  import { inject } from "@vercel/analytics";
  import "../app.css";

  inject({ mode: dev ? "development" : "production" });
</script>

<Navigation />

<slot />
