<table class="mx-auto mt-1 w-full text-gray-200 sm:w-1/2 sm:text-xl">
  {#each { length: 25 } as i}
    <tr
      class="flex animate-pulse border-b-[8px] border-gray-900 border-opacity-100 bg-gray-950 bg-opacity-20 duration-200 ease-in hover:scale-105"
    >
      <td class="px-1 py-2 text-gray-400">
        <div class="h-3 w-6 rounded-lg !bg-gray-700 sm:h-4" />
      </td>
      <td class="grow px-4 py-2"
        ><div
          style="width: {Math.floor(Math.random() * 35) + 40}%"
          class="h-3 rounded-lg bg-gray-700 sm:h-4"
        /></td
      >
      <td class="px-4 py-2"><div class="h-3 w-16 rounded-lg bg-gray-700 sm:h-4" /> </td>
    </tr>
  {/each}
</table>

<style>
  tr:nth-child(1) {
    color: rgb(239, 68, 68);
    font-weight: bold;
    scale: 105%;
  }

  tr:nth-child(1) div {
    background-color: rgb(239, 68, 68);
  }
</style>
