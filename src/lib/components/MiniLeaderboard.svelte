<script lang="ts">
  import type { LeaderboardData } from "$lib/types/LeaderboardData";

  export let data: LeaderboardData;
  export let title: string;
  export let valueSuffix = "";
  export let concatUser = true;
</script>

<div class="mx-5 sm:grow">
  <h2 class="text-center font-bold sm:text-3xl">{title}</h2>
  <table class="mx-auto mt-1 text-sm sm:text-lg">
    <tbody>
      {#each data.slice(0, 10) as { username, value, position }}
        <tr
          class="border-b-[8px] border-gray-900 border-opacity-100 bg-gray-950 bg-opacity-20 duration-200 ease-in hover:scale-105"
        >
          <td class="px-1 py-1 text-right text-gray-400">#{position}</td>
          <td class="px-4 py-1">{username.length > 12 && concatUser ? `${username.slice(0, 10)}..` : username}</td>
          <td class="px-4 py-1 text-right">{value} {valueSuffix}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
