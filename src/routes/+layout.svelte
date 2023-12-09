<script lang="ts">
  import { dev } from "$app/environment";
  import { page } from "$app/stores";
  import Loadbar from "$lib/components/Loadbar.svelte";
  import Navigation from "$lib/components/Navigation.svelte";
  import { inject } from "@vercel/analytics";
  import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";
  import { onMount } from "svelte";
  import toast, { Toaster } from "svelte-french-toast";
  import "../app.css";

  export let data;

  if (!dev) inject({ mode: "production" });
  if (!dev) injectSpeedInsights();

  onMount(() => {
    if ($page.url.searchParams.get("loggedin") && data.user.authenticated) {
      setTimeout(() => {
        toast.success(`logged in as ${data.user.authenticated ? data.user.username : "null"}`, {
          position: "bottom-center",
          style: "background: #4c1d95; color: #fff;",
          duration: 5000,
        });
      }, 250);
      $page.url.searchParams.delete("loggedin");

      history.replaceState({}, "", $page.url); // remove search params without reloading page
    }
  });
</script>

<svelte:head>
  <meta name="og:url" content={$page.url.toString()} />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
  <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
</svelte:head>

<Toaster />

<Navigation user={data.user} />

<Loadbar />

<slot />

<div class="mt-24" />
