<script lang="ts">
  import { dev } from "$app/environment";
  import { page } from "$app/stores";
  import Loadbar from "$lib/components/Loadbar.svelte";
  import Navigation from "$lib/components/Navigation.svelte";
  import { auth, getClientAuth } from "$lib/functions/auth";
  import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";
  import { onMount } from "svelte";
  import toast, { Toaster } from "svelte-french-toast";
  import "../app.css";

  if (!dev) {
    injectSpeedInsights();
  }

  onMount(async () => {
    await getClientAuth();

    if ($page.url.searchParams.get("loggedin")) {
      if (!$auth || !$auth.authenticated) return;
      setTimeout(async () => {
        toast.success(`logged in as ${$auth.user.username}`, {
          position: "bottom-center",
          style:
            "--tw-bg-opacity: 1; background-color: var(--fallback-b3,oklch(var(--b3)/var(--tw-bg-opacity))); color: oklch(0.841536 0.007965 265.755);",
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
  <link rel="manifest" href="/site.webmanifest" />
  <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />

  <meta
    name="keywords"
    content="nypsi, discord, bot, server, economy, gambling, moderation, reaction roles, wholesome"
  />

  <meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)" />
  <meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: light)" />
  <meta name="theme-color" content="#8b5cf6" />

  {#if !dev}
    <script defer data-domain="nypsi.xyz" src="https://analytics.maxz.dev/js/script.js"></script>
  {/if}
</svelte:head>

<Toaster />

<Navigation />

<Loadbar />

<slot />

<div class="mt-24" />
