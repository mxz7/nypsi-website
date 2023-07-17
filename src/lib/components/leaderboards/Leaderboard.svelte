<script lang="ts">
  import type { LeaderboardData } from "$lib/types/LeaderboardData";
  import { fly } from "svelte/transition";

  export let data: LeaderboardData;
  export let suffix: (value: string) => string;
</script>

<table class="mx-auto mt-1 w-full text-gray-200 sm:w-1/2 sm:px-0 sm:text-xl">
  {#each data.slice(0, 100) as { user, value, position }, i}
    <tr
      class="flex w-full border-b-[8px] border-gray-900 border-opacity-100 bg-gray-950 bg-opacity-20 duration-200 ease-in hover:scale-105"
      in:fly|global={{ delay: i * 55, duration: 500, y: 250 }}
    >
      <td class="px-1 py-1 text-gray-400">#{position}</td>
      <td class="line-clamp-1 grow px-4 py-1">
        {#if user.id}
          <a href="/user/{user.id}">{user.username}</a>
        {:else}
          {user.username}
        {/if}
      </td>
      <td class="px-4 py-1 text-right"
        >{value}
        <span class="hidden opacity-75 sm:inline">{suffix(value)}</span></td
      >
    </tr>
  {/each}
</table>

<style>
  tr:nth-child(1) {
    color: #8b5cf6;
    font-weight: bold;
    scale: 105%;
  }

  tr:nth-child(1):hover {
    scale: 110%;
  }
</style>
