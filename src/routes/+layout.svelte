<script lang="ts">
  import { dev } from "$app/environment";
  import { navigating, page } from "$app/stores";
  import GAnalytics from "$lib/components/GAnalytics.svelte";
  import Navigation from "$lib/components/Navigation.svelte";
  import { inject } from "@vercel/analytics";
  import { fade } from "svelte/transition";
  import "../app.css";

  export let data;

  let loadingSize = 0;
  let interval: number | undefined;

  $: if (
    $navigating &&
    !interval &&
    $navigating.to?.params?.userId &&
    $navigating.from?.route.id?.startsWith("/user")
  ) {
    loadingSize = 0;
    interval = setInterval(() => {
      loadingSize += Math.floor(Math.random() * 10) + 5;
      if (loadingSize > 85) loadingSize = 85;
    }, 100);
  } else if (interval && !$navigating) {
    loadingSize = 100;
    setTimeout(() => {
      clearInterval(interval);
      interval = undefined;
    }, 100);
  }

  console.log(data);

  inject({ mode: dev ? "development" : "production" });
</script>

<svelte:head>
  <meta name="og:url" content={$page.url.toString()} />
</svelte:head>

<GAnalytics />

<Navigation user={data.user} />

{#if interval}
  <div
    out:fade={{ duration: 500 }}
    style="width: {loadingSize}%;"
    class="absolute top-[64px] h-[2px] w-0 rounded bg-red-500 duration-100"
  />
{/if}

<slot />

<div class="mt-24" />
