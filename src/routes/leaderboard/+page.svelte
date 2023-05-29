<script>
  import MiniLeaderboard from "../../lib/components/MiniLeaderboard.svelte";

  let balance = [
    { user: "kestas", value: 5000000 },
    { user: "max", value: 400000 },
    { user: "psychotic", value: 1 },
    { user: "kestas", value: 5000000 },
    { user: "max", value: 400000 },
    { user: "psychotic", value: 1 },
    { user: "kestas", value: 5000000 },
    { user: "max", value: 400000 },
    { user: "psychotic", value: 1 },
    { user: "kestas", value: 5000000 },
    { user: "max", value: 400000 },
    { user: "psychotic", value: 1 }

    // Add more dummy
  ].slice(0, 10); // Display only top 10 entries
</script>

<svelte:head>
  <title>nypsi leaderboards</title>
  <meta name="description" content="leaderboards for the nypsi discord bot" />
</svelte:head>

<header class="text-center mt-5">
  <h1 class="text-white text-5xl font-bold">leaderboards</h1>
  <div class="w-3/4 sm:w-96 h-1 bg-red-500 rounded-full mt-3 m-auto" />
</header>

<div class="flex flex-row mt-10 overflow-x-auto text-white sm:p-3 overflow-y-hidden">
  <MiniLeaderboard data={balance} />
  <MiniLeaderboard data={balance} />
  <MiniLeaderboard data={balance} />
</div>
