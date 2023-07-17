<table class="mx-auto mt-1 w-full text-gray-200 sm:w-1/2 sm:text-xl">
  {#each { length: 25 } as i}
    <tr
      class="mb-2 flex w-full animate-pulse items-center gap-2 rounded border border-gray-400 border-opacity-5 bg-gray-950 bg-opacity-20 px-2 py-3 duration-200 ease-in hover:scale-105 hover:border-accent hover:border-opacity-20"
    >
      <td class="text-gray-400">
        <div class="h-3 w-6 rounded-lg !bg-gray-700 sm:h-4" />
      </td>
      <td class="grow"
        ><div
          style="width: {Math.floor(Math.random() * 35) + 40}%"
          class="h-3 rounded-lg bg-gray-700 sm:h-4"
        /></td
      >
      <td class=""><div class="h-3 w-16 rounded-lg bg-gray-700 sm:h-4" /> </td>
    </tr>
  {/each}
</table>

<style>
  tr:nth-child(1) {
    color: #8b5cf6;
    font-weight: bold;
    scale: 105%;

    @apply border-accent border-opacity-40 shadow shadow-gray-950;
  }

  tr:nth-child(1) div {
    background-color: #8b5cf6;
  }
</style>
