<script lang="ts">
  import {
    Backpack,
    Bell,
    Book,
    Car,
    Coins,
    Dice5,
    DollarSign,
    Gavel,
    Hammer,
    Sparkle,
    Sparkles,
  } from "lucide-svelte";
  import { fade } from "svelte/transition";

  export let data;
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

{#await data.streamed.topgg}
  <div />
{:then data}
  <div in:fade={{ duration: 2500 }}>
    {#if data.server_count}
      <div class="absolute bottom-2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
        <p class="text-slate-400">
          used by
          <span class="font-semibold text-accent">{data.server_count.toLocaleString()}</span> servers
        </p>
      </div>
    {/if}
  </div>
{/await}

<div class="absolute bottom-7 right-5 h-10 w-10">
  <a
    class="block animate-pulse rounded-full bg-slate-950 bg-opacity-25 p-2 shadow-lg ring-1 ring-slate-950 ring-opacity-25 duration-500 hover:ring-slate-800 sm:hover:scale-125"
    href="#features"
  >
    <svg
      class="h-6 w-6 text-accent text-opacity-75"
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

<div class="flex h-screen items-center justify-center">
  <div
    class="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 transform text-center md:hidden"
  >
    <h1 class="text-8xl font-bold text-white md:text-9xl">nypsi</h1>
    <p class="mt-6 text-xl font-bold text-slate-400">the best discord bot</p>

    <!-- <div class="m-auto mt-3 h-1 w-full rounded-full bg-accent" /> -->

    <div class="flex justify-center">
      <a
        href="https://discord.com/oauth2/authorize?client_id=678711738845102087&permissions=1377879583830&scope=bot%20applications.commands"
        target="_blank"
        class="mt-5 flex w-fit flex-row items-center justify-center gap-3 rounded-lg
        bg-gradient-to-r from-violet-600 to-purple-600
        p-3 text-xl font-semibold text-white shadow-lg shadow-slate-950 duration-150 hover:scale-95 md:text-2xl"
      >
        <div class="flex h-5 items-center justify-center md:h-6">
          <img src="/discord-white.webp" alt="" class="h-5 w-5 object-contain md:h-6 md:w-6" />
        </div>
        <p>add to discord</p>
      </a>
    </div>
  </div>

  <div class="hidden h-1/2 w-full justify-center md:flex">
    <div class="flex w-full max-w-4xl -translate-y-10 px-4">
      <div class="grow">
        <h1 class="fly-right text-8xl font-bold text-white md:text-9xl">nypsi</h1>
        <p class="fly-right2 mt-6 text-xl font-bold text-slate-400">the best discord bot</p>

        <a
          href="https://discord.com/oauth2/authorize?client_id=678711738845102087&permissions=1377879583830&scope=bot%20applications.commands"
          target="_blank"
          class="fly-right3 mt-5 flex w-fit flex-row items-center justify-center gap-3 rounded-lg
        bg-gradient-to-r from-violet-600 to-purple-600
        p-3 text-xl font-semibold text-white shadow-lg shadow-slate-950 duration-150 hover:scale-95 md:text-2xl"
        >
          <div class="flex h-5 items-center justify-center md:h-6">
            <img src="/discord-white.webp" alt="" class="h-5 w-5 object-contain md:h-6 md:w-6" />
          </div>
          <p>add to discord</p>
        </a>
      </div>

      <img
        src="/hero.webp"
        class="fly-up md:h-72 md:w-72 lg:h-96 lg:w-96 lg:-translate-y-10"
        alt="hero imaage nypsi icon"
      />
    </div>
  </div>
</div>

<section id="features" class="bg-slate-900 py-12">
  <div class="mx-auto px-4 sm:px-6 lg:px-8">
    <h2 class="mb-12 text-4xl font-bold text-white">features</h2>

    <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      <div class=" rounded-lg bg-slate-800 p-6 shadow-md">
        <div class="mb-4 flex flex-row items-center gap-2">
          <DollarSign color="#8b5cf6" size="20" strokeWidth="2.5" />

          <h3 class="text-2xl font-bold text-white">seasonal economy</h3>
        </div>
        <p class="text-slate-400">
          every few months a new season will start, (real money) rewards are given to top players
          from the last season
          <br />
          <a class="text-sky-300 underline" href="/seasons">view season history here</a>
        </p>
      </div>

      <div class="rounded-lg bg-slate-800 p-6 shadow-md">
        <div class="mb-4 flex flex-row items-center gap-2">
          <Gavel color="#8b5cf6" size="20" strokeWidth="2.5" />

          <h3 class="text-2xl font-bold text-white">auctions</h3>
        </div>
        <p class="text-slate-400">
          sell and buy items from other people by the price they set. depends on supply and demand
          of the item.
        </p>
      </div>

      <div class="rounded-lg bg-slate-800 p-6 shadow-md">
        <div class="mb-4 flex flex-row items-center gap-2">
          <Bell color="#8b5cf6" size="20" strokeWidth="2.5" />

          <h3 class="text-2xl font-bold text-white">mention history</h3>
        </div>
        <p class="text-slate-400">
          keep track of your pings, check who ghost pinged you, can store up to 15 mentions
        </p>
      </div>

      <div class="rounded-lg bg-slate-800 p-6 shadow-md">
        <div class="mb-4 flex flex-row items-center gap-2">
          <Book color="#8b5cf6" size="20" strokeWidth="2.5" />

          <h3 class="text-2xl font-bold text-white">wordle</h3>
        </div>
        <p class="text-slate-400">
          play the popular wordle game on discord. guess the word and test your smarts.
        </p>
      </div>

      <div class="rounded-lg bg-slate-800 p-6 shadow-md">
        <div class="mb-4 flex flex-row items-center gap-2">
          <Car color="#8b5cf6" size="20" strokeWidth="2.5" />

          <h3 class="text-2xl font-bold text-white">street racing</h3>
        </div>
        <p class="text-slate-400">
          start and race in races with cars to earn money. contains a lot of cars: toyota supra m4,
          tesla model x, corsa 2003, skyline gtr.
        </p>
      </div>

      <div class="rounded-lg bg-slate-800 p-6 shadow-md">
        <div class="mb-4 flex flex-row items-center gap-2">
          <Coins color="#8b5cf6" size="20" strokeWidth="2.5" />

          <h3 class="text-2xl font-bold text-white">cryptocurrency</h3>
        </div>
        <p class="text-slate-400">
          buy and sell fake cryptocurrency, updates to real cryptocurrency value, contains ethereum
          and bitcoin. lose money simulator.
        </p>
      </div>

      <div class="rounded-lg bg-slate-800 p-6 shadow-md">
        <div class="mb-4 flex flex-row items-center gap-2">
          <Sparkle color="#8b5cf6" size="20" strokeWidth="2.5" />

          <h3 class="text-2xl font-bold text-white">prestige system</h3>
        </div>
        <p class="text-slate-400">
          gain xp through gambling to prestige, unlocking rewards and increasing your vote rewards
        </p>
      </div>

      <div class="rounded-lg bg-slate-800 p-6 shadow-md">
        <div class="mb-4 flex flex-row items-center gap-2">
          <Backpack color="#8b5cf6" size="20" strokeWidth="2.5" />

          <h3 class="text-2xl font-bold text-white">inventory</h3>
        </div>
        <p class="text-slate-400">
          get items, sell them, keep em' and be greedy, use them to bully others and flex. contains
          a lot of items with more being added.
        </p>
      </div>

      <div class="rounded-lg bg-slate-800 p-6 shadow-md">
        <div class="mb-4 flex flex-row items-center gap-2">
          <Dice5 color="#8b5cf6" size="20" strokeWidth="2.5" />

          <h3 class="text-2xl font-bold text-white">gambling</h3>
        </div>
        <p class="text-slate-400">
          gamble all of your money away, or win big. contains the most popular games: blackjack,
          mines, slots, dragon tower & more.
        </p>
      </div>

      <div class="rounded-lg bg-slate-800 p-6 shadow-md">
        <div class="mb-4 flex flex-row items-center gap-2">
          <Hammer color="#8b5cf6" size="20" strokeWidth="2.5" />

          <h3 class="text-2xl font-bold text-white">workers</h3>
        </div>
        <p class="text-slate-400">
          earn easy money by buying workers and upgrading them. this is the easiest way to earn
          money, just sit back and relax.
        </p>
      </div>

      <div class="rounded-lg bg-slate-800 p-6 shadow-md">
        <div class="mb-4 flex flex-row items-center gap-2">
          <Sparkles color="#8b5cf6" size="20" strokeWidth="2.5" />

          <h3 class="text-2xl font-bold text-white">karma system</h3>
        </div>
        <p class="text-slate-400">
          earn karma from interacting with the bot, spend it in the karma shop on premium membership
          & rare items
        </p>
      </div>

      <div class="rounded-lg bg-slate-800 p-6 shadow-md">
        <div class="mb-4 flex flex-row items-center gap-2">
          <Gavel color="#8b5cf6" size="20" strokeWidth="2.5" />

          <h3 class="text-2xl font-bold text-white">moderation</h3>
        </div>
        <p class="text-slate-400">
          fully fledged & capable moderation system. case tracking, chat filter, mass kick (owner
          only) etc.
        </p>
      </div>
    </div>
  </div>
</section>

<style>
  @keyframes fly-up {
    0% {
      transform: translateY(60px);
      opacity: 0%;
    }

    100% {
      opacity: 100%;
      transform: translateY(-40px);
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

  .fly-up {
    animation-name: fly-up;
    animation-timing-function: ease;
    animation-duration: 750ms;
  }

  .fly-right {
    animation: fly-right 750ms ease 200ms normal forwards;
    opacity: 0%;
  }

  .fly-right2 {
    animation: fly-right2 750ms ease 400ms normal forwards;
    opacity: 0%;
  }

  .fly-right3 {
    animation: fly-right2 750ms ease 600ms normal forwards;
    opacity: 0%;
  }
</style>
