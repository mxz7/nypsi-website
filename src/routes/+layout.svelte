<script lang="ts">
  import { dev } from "$app/environment";
  import { page } from "$app/stores";
  import Footer from "$lib/components/Footer.svelte";
  import Loadbar from "$lib/components/Loadbar.svelte";
  import Navigation from "$lib/components/Navigation.svelte";
  import { getClientAuth } from "$lib/functions/auth";
  import { auth } from "$lib/state.svelte";
  import { onMount } from "svelte";
  import toast, { Toaster } from "svelte-french-toast";
  import "../app.css";

  interface Props {
    children?: import("svelte").Snippet;
  }

  let { children }: Props = $props();

  onMount(async () => {
    const authData = await getClientAuth();

    auth.value = authData;

    if ($page.url.searchParams.get("loggedin")) {
      if (!auth.value || !auth.value.authenticated) return;
      setTimeout(async () => {
        if (!auth.value || !auth.value.authenticated) return;
        toast.success(`logged in as ${auth.value.user.username}`, {
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
    <script
      defer
      data-domain="nypsi.xyz"
      src="https://analytics.maxz.dev/js/script.tagged-events.js"
    ></script>
  {/if}

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="min-h-[100vh]">
  <Toaster />

  <Loadbar />

  <Navigation />

  {@render children?.()}
</div>

<Footer />
