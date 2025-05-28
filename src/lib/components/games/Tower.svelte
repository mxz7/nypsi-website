<script lang="ts">
  import DiscordButton from "./DiscordButton.svelte";

  interface Props {
    outcome: string;
  }

  let { outcome }: Props = $props();

  const difficulty = outcome.split("difficulty: ")[1].split("\n")[0].trim();

  const rows: { style: 1 | 2 | 3 | 4; emoji?: { id?: string; name: string } }[][] = outcome
    .split("bad click")[1]
    .trim()
    .split("\n")
    .map((row) => {
      if (row.length === 5) {
        row.replace("gc", "m");
      }
      return row;
    })
    .map((row) =>
      row.split("").map((item) => {
        switch (item.toLowerCase()) {
          case "a":
            return { style: 2 };
          case "b":
            return { style: 2, emoji: { name: "🥚" } };
          case "g":
            return { style: 2, emoji: { name: "blue_gem", id: "1046866209326514206" } };
          case "c":
            return { style: 3, emoji: { name: "🥚" } };
          case "m":
            return { style: 3, emoji: { name: "blue_gem", id: "1046866209326514206" } };
          case "x":
            return { style: 4 };
          default:
            return { style: 2 };
        }
      }),
    );

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
    style="grid-template-columns: repeat({difficulty === 'easy'
      ? '4'
      : difficulty === 'medium'
        ? '3'
        : difficulty === 'hard'
          ? '2'
          : difficulty === 'expert'
            ? '4'
            : '3'}, minmax(0, 1fr))"
    class="grid w-fit gap-1 sm:gap-2"
  >
    {#each rows as row}
      {#each row as item}
        <DiscordButton data={item} />
      {/each}
    {/each}
  </div>
</div>
