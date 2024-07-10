<script lang="ts">
  import tooltip from "$lib/Tooltips";
  import parseEmoji from "$lib/functions/parseEmoji";
  import type { LeaderboardData } from "$lib/types/LeaderboardData";
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";

  export let data: LeaderboardData;
  export let suffix: (value: string) => string;
  export let tags: Promise<{ [key: string]: { tagId: string; emoji: string; name: string } }> =
    new Promise((resolve) => {
      resolve({});
    });

  onMount(async () => {
    const tagData = await Promise.resolve(tags);

    console.log(tagData);

    for (const user of data) {
      if (user.user.tag) {
        console.log(user);
        console.log(tagData[user.user.tag]);
      }
    }
  });
</script>

<table class="mx-auto mt-1 w-full px-4 text-slate-200 sm:max-w-2xl sm:px-0 sm:text-xl">
  {#each data.slice(0, 100) as { user, value, position }, i}
    <tr
      class="mb-2 flex w-full items-center gap-2 rounded-lg border border-slate-400 border-opacity-5 bg-slate-950 bg-opacity-20 px-2 py-1 duration-200 ease-in hover:scale-105 hover:border-accent hover:border-opacity-20"
      in:fly|global={{ delay: 100 + i * 55, duration: 500, y: 250 }}
    >
      <td class="text-slate-400">#{position}</td>
      <td class="sline-clamp-1 flex h-2 items-center">
        {#if user.id}
          {#if user.tag}
            {#await tags then tags}
              <p>[</p>
              <img
                class="h-5 sm:h-6"
                src={parseEmoji(tags[user.tag]?.emoji)}
                alt=""
                use:tooltip={{
                  placement: "top",
                  content: tags[user.tag]?.name,
                  followCursor: true,
                }}
              />
              <p class="mr-1">]</p>
            {/await}
          {/if}
          <a href="/user/{user.id}">{user.username}</a>
        {:else}
          {user.username}
        {/if}
      </td>
      <td class="line-clamp-1 grow break-all text-right"
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
    @apply border-accent border-opacity-40 shadow shadow-slate-950;
  }

  tr:nth-child(1):hover {
    scale: 103%;
  }
</style>
