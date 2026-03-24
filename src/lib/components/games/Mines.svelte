<script lang="ts">
  import DiscordButton from "./DiscordButton.svelte";

  interface Props {
    outcome: {
      components: {
        emoji: { name: string; id?: string; animated: boolean };
        style: 1 | 2 | 3 | 4;
      }[];
    }[];
  }

  let { outcome }: Props = $props();
</script>

<div class="flex items-center justify-center">
  <div class="grid w-fit grid-cols-5 gap-1 sm:gap-2">
    {#each outcome as row, y}
      {#each row.components as button, x}
        {#if y === 4 && x === 4}
          <!-- do nothing -->
        {:else}
          <DiscordButton data={button} />
        {/if}
      {/each}
    {/each}
  </div>
</div>
