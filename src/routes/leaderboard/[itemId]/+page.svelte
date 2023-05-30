<script>
  export let data;
</script>

<svelte:head>
  <title>nypsi leaderboard</title>
  <meta name="description" content="leaderboards for the nypsi discord bot" />
</svelte:head>

{#if data.item}
  <header class="text-center mt-5">
    <h1 class="text-white text-5xl font-bold">{data.item.plural ? data.item.plural : `${data.item.name}s`} leaderboard</h1>
    <div class="w-3/4 sm:w-96 h-1 bg-red-500 rounded-full mt-3 m-auto" />
  </header>

  <div class="mt-10 px-5">
    <table class="mt-1 sm:text-xl mx-auto text-gray-200 w-full">
      <tbody>
        {#each data.itemData.slice(0, 100) as { username, value, position }}
          <tr
            class="bg-gray-950 border-b-[8px] border-gray-900 border-opacity-100 bg-opacity-20 hover:scale-105 duration-200 ease-in"
          >
            <td class="px-1 py-1 text-gray-400">#{position}</td>
            <td class="px-4 py-1">{username}</td>
            <td class="px-4 py-1 text-right">{value} {data.item.plural ? data.item.plural : `${data.item.name}s`}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{:else}
  <h2
    class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl font-bold w-full px-5 text-center"
  >
    invalid item, please select one from the <a href="/leaderboard#items" class="underline text-sky-300">list</a>
  </h2>
{/if}
