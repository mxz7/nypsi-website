<script lang="ts">
  import type Game from "$lib/types/Game";
  import DiscordButton from "./DiscordButton.svelte";

  export let game: Game;

  const outcome = JSON.parse(game.outcome) as {
    components: { emoji: { name: string; id?: string; animated: boolean }; style: 1 | 2 | 3 | 4 }[];
  }[];
</script>

<h2 class="text -mt-3 mb-3 text-center font-bold text-gray-300">
  {game.game.replaceAll("_", " ")}
</h2>

<div class="flex items-center justify-center">
  <div class="grid w-fit grid-cols-3 gap-1 sm:gap-2">
    {#each outcome as row}
      {#each row.components as button}
        <DiscordButton data={button} />
      {/each}
    {/each}
  </div>
</div>
