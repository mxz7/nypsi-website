<script lang="ts">
  import { onMount } from "svelte";

  let commands = 0;

  onMount(() => {
    async function fetchCommandsToday() {
      const res = await fetch("/api/commands").then((res) => res.json());

      const total: number = res?.total;

      if (!total) return 0;
      return total;
    }

    (async () => {
      commands = await fetchCommandsToday().catch(() => 0);

      if (commands !== 0) {
        (document.querySelector("#command-count") as HTMLElement).style.opacity = "100%";
      }

      setInterval(async () => {
        commands = await fetchCommandsToday().catch(() => 0);
      }, 5000);
    })();
  });
</script>

<svelte:head>
  <title>nypsi</title>
  <meta
    name="description"
    content="
  the best discord bot. includes gambling, economy, items, fake cryptocurrency, moderation, reaction roles, channel stats"
  />
</svelte:head>

<div id="command-count" class="w-full text-center pt-2 opacity-0 duration-1000 ease-in">
  <p class="text-gray-400"><span class="text-red-500">{commands.toLocaleString()}</span> commands today</p>
</div>

<div class="h-screen flex justify-center items-center">
  <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-2/3 text-center">
    <h1 class="text-white text-9xl font-bold">nypsi</h1>
    <p class="text-gray-400 text-2xl font-bold mt-5">the best discord bot</p>

    <div class="w-3/4 h-1 bg-red-500 rounded-full mt-3 m-auto lg:w-full" />

    <div class="flex flex-col sm:flex-row justify-center items-center mt-2">
      <a href="https://discord.com/invite/hJTDNST" class="flex flex-col justify-center items-center mb-4 sm:mb-0 sm:mr-4">
        <p class="text-white text-2xl font-bold mt-2 hover-effect">discord</p>
      </a>

      <a href="https://docs.nypsi.xyz/" class="flex flex-col justify-center items-center mb-4 sm:mb-0 sm:mr-4">
        <p class="text-white text-2xl font-bold mt-2 hover-effect">docs</p>
      </a>

      <a href="#features" class="flex flex-col justify-center items-center mb-4 sm:mb-0 sm:mr-4">
        <p class="text-white text-2xl font-bold mt-2 hover-effect">features</p>
      </a>

      <a
        href="https://discord.com/oauth2/authorize?client_id=678711738845102087&permissions=1377879583830&scope=bot%20applications.commands"
        target="_blank"
        class="flex flex-col justify-center items-center mb-4 sm:mb-0 sm:mr-4"
      >
        <p class="text-white text-2xl font-bold mt-2 hover-effect">invite</p>
      </a>

      <a href="https://ko-fi.com/tekoh/tiers" class="flex flex-col justify-center items-center">
        <p class="text-white text-2xl font-bold mt-2 hover-effect">donate</p>
      </a>
    </div>
  </div>
</div>

<section id="features" class="bg-gray-900 py-12">
  <div class="mx-auto px-4 sm:px-6 lg:px-8">
    <h2 class="text-4xl font-bold text-white mb-12">features</h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div class="bg-gray-800 rounded-lg shadow-md p-6">
        <h3 class="text-2xl font-bold text-white mb-4">prestige system</h3>
        <p class="text-gray-400">gain xp through gambling to prestige, unlocking rewards and increasing your vote rewards</p>
      </div>

      <div class="bg-gray-800 rounded-lg shadow-md p-6">
        <h3 class="text-2xl font-bold text-white mb-4">mention history</h3>
        <p class="text-gray-400">keep track of your pings, check who ghost pinged you, can store up to 15 mentions</p>
      </div>

      <div class="bg-gray-800 rounded-lg shadow-md p-6">
        <h3 class="text-2xl font-bold text-white mb-4">cryptocurrency</h3>
        <p class="text-gray-400">
          buy and sell fake cryptocurrency, updates to real cryptocurrency value, contains ethereum and bitcoin. lose money
          simulator.
        </p>
      </div>

      <div class="bg-gray-800 rounded-lg shadow-md p-6">
        <h3 class="text-2xl font-bold text-white mb-4">wordle</h3>
        <p class="text-gray-400">play the popular wordle game on discord. guess the word and test your smarts.</p>
      </div>

      <div class="bg-gray-800 rounded-lg shadow-md p-6">
        <h3 class="text-2xl font-bold text-white mb-4">street racing</h3>
        <p class="text-gray-400">
          start and race in races with cars to earn money. contains a lot of cars: toyota supra m4, tesla model x, corsa
          2003, skyline gtr.
        </p>
      </div>

      <div class="bg-gray-800 rounded-lg shadow-md p-6">
        <h3 class="text-2xl font-bold text-white mb-4">inventory system</h3>
        <p class="text-gray-400">
          get items, sell them, keep em' and be greedy, use them to bully others and flex. contains a lot of items with more
          being added.
        </p>
      </div>

      <div class="bg-gray-800 rounded-lg shadow-md p-6">
        <h3 class="text-2xl font-bold text-white mb-4">gambling</h3>
        <p class="text-gray-400">
          gamble all of your money away, or win big. contains the most popular games: blackjack, mines, slots, dragon tower &
          more.
        </p>
      </div>

      <div class="bg-gray-800 rounded-lg shadow-md p-6">
        <h3 class="text-2xl font-bold text-white mb-4">workers</h3>
        <p class="text-gray-400">
          earn easy money by buying workers and upgrading them. this is the easiest way to earn money, just sit back and
          relax.
        </p>
      </div>

      <div class="bg-gray-800 rounded-lg shadow-md p-6">
        <h3 class="text-2xl font-bold text-white mb-4">seasons</h3>
        <p class="text-gray-400">
          every few months a new season will start, (real money) rewards are given to top players from the last season
        </p>
      </div>

      <div class="bg-gray-800 rounded-lg shadow-md p-6">
        <h3 class="text-2xl font-bold text-white mb-4">auctions</h3>
        <p class="text-gray-400">
          sell and buy items from other people by the price they set. depends on supply and demand of the item.
        </p>
      </div>

      <div class="bg-gray-800 rounded-lg shadow-md p-6">
        <h3 class="text-2xl font-bold text-white mb-4">karma system</h3>
        <p class="text-gray-400">
          earn karma from interacting with the bot, spend it in the karma shop on premium membership & rare items
        </p>
      </div>

      <div class="bg-gray-800 rounded-lg shadow-md p-6">
        <h3 class="text-2xl font-bold text-white mb-4">moderation</h3>
        <p class="text-gray-400">
          fully fledged & capable moderation system. case tracking, chat filter, mass kick (owner only) etc.
        </p>
      </div>
    </div>
  </div>
</section>
