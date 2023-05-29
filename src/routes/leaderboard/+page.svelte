<script>
  let balance = [
    { name: "kestas", bal: 5000000 },
    { name: "max", bal: 400000 },
    { name: "psychotic", bal: 1 },
    { name: "kestas", bal: 5000000 },
    { name: "max", bal: 400000 },
    { name: "psychotic", bal: 1 },
    { name: "kestas", bal: 5000000 },
    { name: "max", bal: 400000 },
    { name: "psychotic", bal: 1 },
    { name: "kestas", bal: 5000000 },
    { name: "max", bal: 400000 },
    { name: "psychotic", bal: 1 }

    // Add more dummy
  ].slice(0, 10); // Display only top 10 entries

  let prestige = [
    { name: "kestas", pres: 69 },
    { name: "max", pres: 42 },
    { name: "psychotic", pres: 3 },
    { name: "kestas", pres: 69 },
    { name: "max", pres: 42 },
    { name: "psychotic", pres: 3 },
    { name: "kestas", pres: 69 },
    { name: "max", pres: 42 },
    { name: "psychotic", pres: 3 },
    { name: "kestas", pres: 69 },
    { name: "max", pres: 42 },
    { name: "psychotic", pres: 3 },
    { name: "kestas", pres: 69 },
    { name: "max", pres: 42 },
    { name: "psychotic", pres: 3 },
    { name: "kestas", pres: 69 },
    { name: "max", pres: 42 },
    { name: "psychotic", pres: 3 }

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
  <div class="mx-5 sm:grow">
    <h2 class="text-center text-xl font-bold sm:text-3xl">top balance</h2>
    <table class="mt-1 text-sm sm:text-xl mx-auto">
      <tbody>
        {#each balance as { name, bal }}
          <tr
            class="bg-gray-950 border-b-[8px] border-gray-900 border-opacity-100 bg-opacity-20 hover:scale-105 duration-200 ease-in"
          >
            <td class="px-1 py-1 text-gray-400">#{balance.findIndex((item) => item.name === name) + 1}</td>
            <td class="px-4 py-1">{name}</td>
            <td class="px-4 py-1 text-right">${bal.toLocaleString()}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
