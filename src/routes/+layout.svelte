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
</svelte:head>

<Toaster />

<GAnalytics />

<Navigation user={data.user} />

<Loadbar />

<slot />

<div class="mt-24" />
