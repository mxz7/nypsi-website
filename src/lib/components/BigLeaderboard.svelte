<script lang="ts">
  import type { LeaderboardData } from "$lib/types/LeaderboardData";

  export let data: LeaderboardData;
  export let suffix: (value: string) => string;
</script>

<table class="mt-1 sm:text-xl mx-auto text-gray-200 w-full sm:w-1/2">
  <tbody>
    {#each data.slice(0, 100) as { username, value, position }}
      <tr
        class="bg-gray-950 border-b-[8px] border-gray-900 border-opacity-100 bg-opacity-20 hover:scale-105 duration-200 ease-in"
      >
        <td class="px-1 py-1 text-gray-400">#{position}</td>
        <td class="px-4 py-1">{username}</td>
        <td class="px-4 py-1 text-right"
          >{value}
          <span class="opacity-75">{suffix(value)}</span></td
        >
      </tr>
    {/each}
  </tbody>
</table>
