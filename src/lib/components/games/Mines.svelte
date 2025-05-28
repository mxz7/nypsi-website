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

  outcome[4].components.pop();
</script>

<div class="flex items-center justify-center">
  <div class="grid w-fit grid-cols-5 gap-1 sm:gap-2">
    {#each outcome as row}
      {#each row.components as button}
        <DiscordButton data={button} />
      {/each}
    {/each}
  </div>
</div>
