<script lang="ts">
  import { dev } from "$app/environment";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import GAnalytics from "$lib/components/GAnalytics.svelte";
  import Loadbar from "$lib/components/Loadbar.svelte";
  import Navigation from "$lib/components/Navigation.svelte";
  import { inject } from "@vercel/analytics";
  import { onMount } from "svelte";
  import toast, { Toaster } from "svelte-french-toast";
  import "../app.css";

  export let data;

  if (!dev) inject({ mode: "production" });

  onMount(() => {
    if ($page.url.searchParams.get("loggedin") === "true" && data.user.authenticated) {
      setTimeout(() => {
        toast.success(`logged in as ${data.user.authenticated ? data.user.username : "null"}`, {
          position: "bottom-center",
          style: "background: #4c1d95; color: #fff;",
          duration: 5000,
        });
      }, 250);
      $page.url.searchParams.delete("loggedin");
      goto(`?${$page.url.searchParams}`);
    } else if (!data.user.authenticated) {
      $page.url.searchParams.delete("loggedin");
      goto(`?${$page.url.searchParams}`);
    }
  });
</script>

<svelte:head>
  <meta name="og:url" content={$page.url.toString()} />

  <title>nypsi</title>
  <meta
    name="description"
    content="
  the best discord bot. includes gambling, economy, items, fake cryptocurrency, moderation, reaction roles, channel stats"
  />

  <meta name="og:title" content="nypsi" />
  <meta
    name="og:description"
    content="the best discord bot. includes gambling, economy, items, fake cryptocurrency, moderation, reaction roles, channel stats"
  />
  <meta name="og:site_name" content="nypsi" />

  <meta
    name="og:image"
    content="https://cdn.discordapp.com/avatars/678711738845102087/59759532c8ef1898f60d959b9b3ecaa7.png?size=128"
  />
  <meta property="og:image:width" content="128" />
  <meta property="og:image:height" content="128" />

  <meta property='theme-color' content='#111827'>
</svelte:head>

<Toaster />

<GAnalytics />

<Navigation user={data.user} />

<Loadbar />

<slot />

<div class="mt-24" />
