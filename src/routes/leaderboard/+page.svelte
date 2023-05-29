<svelte:head>
  <title>nypsi leaderboard</title>
  <meta name="description" content="leaderboard for the nypsi bot" />
</svelte:head>

<script>
  let balance = [
    { name: 'kestas', bal: 5000000 },
    { name: 'max', bal: 400000 },
    { name: 'psychotic', bal: 1 },
    // Add more dummy
  ].slice(0, 10); // Display only top 10 entries

  let prestige = [
    { name: 'kestas', pres: 69 },
    { name: 'max', pres: 42 },
    { name: 'psychotic', pres: 3 },
    // Add more dummy
  ].slice(0, 10); // Display only top 10 entries
</script>

<div class="h-screen flex justify-center items-center">
  <div class="flex flex-col text-center">
    <h1 class="text-white text-6xl font-bold">leaderboard</h1>
    <div class="w-3/4 h-1 bg-red-500 rounded-full mt-3 m-auto lg:w-full"></div>

    <div class="flex mt-8">
      <div class="w-1/2 mx-10">
        <h2 class="text-white text-3xl font-bold">Top Bal</h2>
        <div class="w-3/4 h-1 bg-red-500 rounded-full mt-3 m-auto lg:w-1/2"></div>

        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400 mt-8">
          <thead>
          </thead>
          <tbody>
            {#each balance as { name, bal }}
            <tr>
              <td class="border px-4 py-2 text-white">{name}</td>
              <td class="border px-4 py-2 text-white">{bal}</td>
            </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <div class="w-1/2">
        <h2 class="text-white text-3xl font-bold">Top Pres</h2>
        <div class="w-3/4 h-1 bg-red-500 rounded-full mt-3 m-auto lg:w-1/2"></div>

        <table class="table-auto mt-8">
          <thead>
          </thead>
          <tbody>
            {#each prestige as { name, pres }}
            <tr>
              <td class="border px-4 py-2 text-white">{name}</td>
              <td class="border px-4 py-2 text-white">{pres}</td>
            </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
