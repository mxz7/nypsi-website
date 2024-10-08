<script lang="ts">
  import logo from "$lib/assets/hero.webp?as=run:0";
  import Discord from "$lib/assets/svg/discord.svelte";
  import Features from "$lib/components/features/Features.svelte";
  import Img from "@zerodevx/svelte-img";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  let serverCount: number;

  onMount(async () => {
    const res = await fetch("/api/server-count").then(async (r) => r.json());

    serverCount = res.server_count;
  });
</script>

<svelte:head>
  <title>nypsi discord bot</title>

  <meta
    property="description"
    name="description"
    content="
  the best discord bot. includes gambling, economy, items, fake cryptocurrency, moderation, reaction roles, channel stats"
  />

  <meta name="og:title" content="nypsi discord bot" />
  <meta
    name="og:description"
    content="the best discord bot. includes gambling, economy, items, fake cryptocurrency, moderation, reaction roles, channel stats"
  />
  <meta name="og:site_name" content="nypsi" />

  <meta
    name="og:image"
    content="https://cdn.discordapp.com/avatars/678711738845102087/cb2dcd61010f2b89ceb1cd5ff15816cf.webp?size=128"
  />
  <meta property="og:image:width" content="128" />
  <meta property="og:image:height" content="128" />
</svelte:head>

{#if serverCount}
  <div in:fade={{ duration: 2500 }}>
    <div class="absolute bottom-2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
      <p class="text-slate-400">
        used by
        <span class="font-semibold text-primary">{serverCount.toLocaleString()}</span> servers
      </p>
    </div>
  </div>
{/if}

<div class="absolute bottom-7 right-5 h-10 w-10">
  <a
    class="block animate-pulse rounded-full bg-base-300 p-2 shadow-lg duration-500 sm:hover:scale-125"
    href="#features"
  >
    <svg
      class="h-6 w-6 text-primary text-opacity-75"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  </a>
</div>

<div class="hero min-h-screen">
  <div class="hero-content flex-col lg:-mt-64 lg:flex-row-reverse lg:gap-32">
    <div class="fly-up">
      <Img src={logo} class=" hidden max-w-sm lg:block" />
    </div>

    <div class="-mt-64 text-center lg:mt-0 lg:text-left">
      <h1 class="animation-1 text-8xl font-black text-white lg:text-9xl">nypsi</h1>
      <p class="animation-2 py-6 text-lg font-medium">the best discord bot</p>
      <a
        href="https://discord.com/oauth2/authorize?client_id=678711738845102087&permissions=1377879583830&scope=bot%20applications.commands"
        class="animation-3 btn btn-primary flex w-fit gap-3 bg-gradient-to-r from-violet-600 to-purple-600 fill-white text-lg text-white"
        target="_blank"
      >
        <Discord class="h-6 w-6 lg:h-7 lg:w-7" />
        <span class="lg:text-2xl">add to discord</span>
      </a>
    </div>
  </div>
</div>

<Features />

<style>
  @keyframes fly-up {
    0% {
      transform: translateY(175px);
      opacity: 0%;
    }

    100% {
      opacity: 100%;
      transform: translateY(0px);
    }
  }

  @keyframes fly-right {
    0% {
      transform: translateX(-50px);
      opacity: 0%;
    }

    100% {
      opacity: 100%;
      transform: translateX(0px);
    }
  }

  @keyframes fly-right2 {
    0% {
      transform: translateX(-25px);
      opacity: 0%;
    }

    100% {
      opacity: 100%;
      transform: translateX(0px);
    }
  }

  .animation-1 {
    animation: fly-up-mobile 500ms ease-out 0ms;
  }

  .animation-2 {
    animation: fly-up-mobile 400ms ease-out 300ms forwards;
    opacity: 0%;
  }

  .animation-3 {
    animation: fly-up-mobile 400ms ease-out 400ms forwards;
    opacity: 0%;
  }

  @media (min-width: 1024px) {
    .animation-1 {
      animation: fly-right 750ms ease 200ms normal forwards;
      opacity: 0%;
    }

    .animation-2 {
      animation: fly-right2 750ms ease 400ms normal forwards;
      opacity: 0%;
    }

    .animation-3 {
      animation: fly-right2 750ms ease 600ms normal forwards;
      opacity: 0%;
    }
  }

  .fly-up {
    animation: fly-up 1250ms ease normal forwards;
  }

  /* mobile animations */

  @keyframes fly-up-mobile {
    from {
      transform: translateY(50px);
      opacity: 0%;
    }
    to {
      transform: translateY(0px);
      opacity: 100%;
    }
  }
</style>
