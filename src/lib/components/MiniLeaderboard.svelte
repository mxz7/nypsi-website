<script lang="ts">
  export let data: { user: string; value: number }[];
</script>

<div class="mx-5 sm:grow">
  <h2 class="text-center text-xl font-bold sm:text-3xl">top balance</h2>
  <table class="mt-1 text-sm sm:text-xl mx-auto">
    <tbody>
      {#each data as { user, value }}
        <tr
          class="bg-gray-950 border-b-[8px] border-gray-900 border-opacity-100 bg-opacity-20 hover:scale-105 duration-200 ease-in"
        >
          <td class="px-1 py-1 text-gray-400">#{data.findIndex((item) => item.user === user) + 1}</td>
          <td class="px-4 py-1">{user}</td>
          <td class="px-4 py-1 text-right">${value.toLocaleString()}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
