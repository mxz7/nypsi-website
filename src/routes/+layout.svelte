<script lang="ts">
  import { dev } from "$app/environment";
  import { onNavigate, replaceState } from "$app/navigation";
  import { page } from "$app/state";
  import Footer from "$lib/components/layout/Footer.svelte";
  import LoadBar from "$lib/components/layout/LoadBar.svelte";
  import Navbar from "$lib/components/layout/nav/NavBar.svelte";
  import { getClientAuth } from "$lib/functions/auth";
  import { auth, initialLoad } from "$lib/state.svelte";
  import "@fontsource-variable/inter";
  import { onMount, tick } from "svelte";
  import toast, { Toaster } from "svelte-french-toast";
  import "../app.css";

  interface Props {
    children?: import("svelte").Snippet;
  }

  let { children }: Props = $props();

  onMount(async () => {
    await tick();
    if (!auth.value) {
      const authData = await getClientAuth();

      auth.value = authData;
    }

    setTimeout(() => {
      const params = new URLSearchParams(page.url.searchParams.toString());

      if (page.url.searchParams.get("loggedin")) {
        if (!auth.value || !auth.value.authenticated) return;
        params.delete("loggedin");
        setTimeout(async () => {
          if (!auth.value || !auth.value.authenticated) return;
          toast(`logged in as ${auth.value.user.username}`, {
            position: "bottom-center",
            icon: "✅",
            style:
              "background-color: oklch(0.15 0.0299 262.929993); color: oklch(0.8936 0.0076 260.730011);",
            duration: 5000,
          });
        }, 250);
      }

      if (page.url.searchParams.has("ref")) {
        params.delete("ref");
      }

      if (params.toString() !== page.url.searchParams.toString()) {
        if (params.size === 0) {
          replaceState(page.url.pathname, {});
        } else {
          replaceState(`?${params.toString()}`, {});
        }
      }
    }, 2000);
  });

  onNavigate(() => {
    initialLoad.value = false;
  });
</script>

<svelte:head>
  <link rel="apple-touch-icon" sizes="57x57" href="/favicon-57x57.png" type="image/png" />
  <link rel="apple-touch-icon" sizes="60x60" href="/favicon-60x60.png" type="image/png" />
  <link rel="apple-touch-icon" sizes="72x72" href="/favicon-72x72.png" type="image/png" />
  <link rel="apple-touch-icon" sizes="114x114" href="/favicon-114x114.png" type="image/png" />
  <link rel="apple-touch-icon" sizes="120x120" href="/favicon-120x120.png" type="image/png" />
  <link rel="apple-touch-icon" sizes="144x144" href="/favicon-144x144.png" type="image/png" />
  <link rel="apple-touch-icon" sizes="152x152" href="/favicon-152x152.png" type="image/png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/favicon-180x180.png" type="image/png" />
  <link rel="icon" sizes="16x16" href="/favicon-16x16.png" type="image/png" />
  <link rel="icon" sizes="32x32" href="/favicon-32x32.png" type="image/png" />
  <link rel="icon" sizes="96x96" href="/favicon-96x96.png" type="image/png" />
  <link rel="icon" sizes="192x192" href="/favicon-192x192.png" type="image/png" />
  <link rel="icon" sizes="512x512" href="/favicon-512x512.png" type="image/png" />
  <link rel="manifest" href="/manifest.json" />
  <meta name="msapplication-TileColor" content="#0f172a" />
  <meta name="msapplication-TileImage" content="/favicon-512x512.png" />

  <meta
    name="keywords"
    content="nypsi, discord, bot, server, economy, gambling, moderation, reaction roles, wholesome"
  />

  <meta name="og:url" content={page.url.toString()} />
  <meta name="og:site_name" content="nypsi" />

  <meta name="theme-color" content="#081121" media="(prefers-color-scheme: dark)" />
  <meta name="theme-color" content="#081121" media="(prefers-color-scheme: light)" />
  <meta name="theme-color" content="#8b5cf6" />

  {#if !dev}
    <script
      defer
      src="https://analytics.maxz.dev/script.js"
      data-website-id="d0bd590b-cc67-4315-b725-0105ada8ce61"
    ></script>
  {/if}
</svelte:head>

<div class="min-h-[100vh]">
  <LoadBar />

  <!-- <ProgressBar class="text-primary" /> -->

  <Toaster />

  <Navbar />

  {@render children?.()}
</div>

<Footer />
