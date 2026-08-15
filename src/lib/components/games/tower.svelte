<script lang="ts">
  import { parseTowerRows, type TowerCell } from "$lib/functions/tower";

  import DiscordButton from "./discord-button.svelte";

  interface Props {
    outcome: string;
  }

  let { outcome }: Props = $props();

  type ButtonData = {
    style: 1 | 2 | 3 | 4;
    emoji?: { id?: string; name: string };
  };

  function toButtonData(item: TowerCell): ButtonData {
    switch (item) {
      case "B":
        return { style: 2, emoji: { name: "🥚" } };
      case "G":
        return { style: 2, emoji: { name: "blue_gem", id: "1046866209326514206" } };
      case "C":
        return { style: 3, emoji: { name: "🥚" } };
      case "GC":
        return { style: 3, emoji: { name: "blue_gem", id: "1046866209326514206" } };
      case "X":
        return { style: 4 };
      default:
        return { style: 2 };
    }
  }

  const rows = $derived(parseTowerRows(outcome).map((row) => row.map(toButtonData)));
  const columnCount = $derived(rows[0]?.length ?? 1);

  /**
   * nothing = a
   * egg = b
   * gem = g
   * found egg = c
   * found gem = gc
   * bad click = x (end game)
   * last row is always finish / play again
   * only show 1 untouched row
   * auto finish on 15x or higher or last row
   *
   */
</script>

<div class="flex items-center justify-center">
  <div
    style:grid-template-columns="repeat({columnCount}, minmax(0, 1fr))"
    class="grid w-fit gap-1 sm:gap-2"
  >
    {#each rows as row, rowIndex (rowIndex)}
      {#each row as item, columnIndex (`${rowIndex}-${columnIndex}`)}
        <DiscordButton data={item} />
      {/each}
    {/each}
  </div>
</div>
