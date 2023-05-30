<script lang="ts">
  export let data: { username: string; value: string; position: string }[];
  export let title: string;
</script>

<div class="mx-5 sm:grow">
  <h2 class="text-center text-xl font-bold sm:text-3xl">{title}</h2>
  <table class="mt-1 text-sm sm:text-xl mx-auto">
    <tbody>
      {#each data.slice(0, 10) as { username, value, position }}
        <tr
          class="bg-gray-950 border-b-[8px] border-gray-900 border-opacity-100 bg-opacity-20 hover:scale-105 duration-200 ease-in"
        >
          <td class="px-1 py-1 text-gray-400">#{position}</td>
          <td class="px-4 py-1">{username}</td>
          <td class="px-4 py-1 text-right">{value}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
