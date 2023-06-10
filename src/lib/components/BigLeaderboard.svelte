<script lang="ts">
  import type { LeaderboardData } from "$lib/types/LeaderboardData";

  export let data: LeaderboardData;
  export let suffix: (value: string) => string;
</script>

<table class="mx-auto mt-1 w-full text-gray-200 sm:w-1/2 sm:text-xl">
  <tbody>
    {#each data.slice(0, 100) as { username, value, position }}
      <tr
        class="flex border-b-[8px] border-gray-900 border-opacity-100 bg-gray-950 bg-opacity-20 duration-200 ease-in hover:scale-105"
      >
        <td class="px-1 py-1 text-gray-400">#{position}</td>
        <td class="line-clamp-1 grow px-4 py-1">{username}</td>
        <td class="px-4 py-1 text-right"
          >{value}
          <span class="hidden opacity-75 sm:inline">{suffix(value)}</span></td
        >
      </tr>
    {/each}
  </tbody>
</table>
