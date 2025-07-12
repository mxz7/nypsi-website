<script lang="ts">
  import { page } from "$app/state";
  import { fly } from "svelte/transition";

  let { data } = $props();

  const board: string[][] = $derived.by(() => {
    const board = [];

    for (let i = 0; i < 6; i++) {
      board[i] = ["x", "x", "x", "x", "x"];
    }

    for (let i = 0; i < data.game.guesses.length; i++) {
      const counts = new Map<string, number>();
      const word = data.game.guesses[i];

      for (let j = 0; j < 5; j++) {
        const letter = word[j];
        const actualLetter = data.game.word[j];

        let value: string;

        if (letter === actualLetter) {
          value = `green:${letter}`;
          counts.set(letter, (counts.get(letter) || 0) + 1);
        }

        board[i][j] = value;
      }

      for (let j = 0; j < 5; j++) {
        const letter = word[j];
        const actualLetter = data.game.word[j];
        const letterCount = (data.game.word.match(new RegExp(letter, "g")) || []).length;

        let value: string;

        if (letter == actualLetter) {
          // do nothing
        } else if (data.game.word.includes(letter)) {
          if ((counts.get(letter) || 0) >= letterCount) {
            value = `grey:${letter}`;
          } else {
            value = `yellow:${letter}`;
            counts.set(letter, (counts.get(letter) || 0) + 1);
          }
        } else {
          value = `grey:${letter}`;
        }

        if (value) board[i][j] = value;
      }
    }

    return board;
  });

  function formatTime(ms: number) {
    const minutes = Math.floor(ms / 60000);
    let seconds = ((ms % 60000) / 1000).toFixed(2);

    if (minutes > 0) {
      seconds = Math.round((ms % 60000) / 1000).toString();
    }

    return `${minutes > 0 ? `${minutes}m` : ""}${seconds}s`;
  }
</script>

<svelte:head>
  <title>wordle: {page.params.id} | nypsi</title>
  <meta name="og:title" content="wordle: {page.params.id} | nypsi" />
</svelte:head>

<h1 class="text-center text-lg font-bold">{data.game.id.toString(36)}</h1>

{#key data}
  <div in:fly={{ y: 25, delay: 300, duration: 500 }} out:fly={{ y: 15, duration: 250 }}>
    <p class="text-center">
      completed by <a
        class="link-primary"
        href={data.game.userId === "hidden"
          ? "/docs/economy/user-settings/hidden"
          : "/users/" + data.game.userId}>{data.game.user.lastKnownUsername}</a
      >
      in {formatTime(data.game.time)}
    </p>

    <div class="mt-8 flex w-full justify-center">
      <div class="grid w-fit grid-cols-5 gap-x-1 gap-y-3">
        {#each board as row}
          {#each row as letter}
            {#if letter === "x"}
              <div class="bg-base-200 rounded-lg p-2 text-4xl font-medium">&#8203;</div>
            {:else if letter.startsWith("green:")}
              <div class="bg-base-300 text-success rounded-lg p-2 text-center text-4xl font-medium">
                {letter.substring(6)}
              </div>
            {:else if letter.startsWith("yellow:")}
              <div class="bg-base-300 text-warning rounded-lg p-2 text-center text-4xl font-medium">
                {letter.substring(7)}
              </div>
            {:else if letter.startsWith("grey:")}
              <div
                class="bg-base-300 rounded-lg p-2 text-center text-4xl font-medium text-slate-500"
              >
                {letter.substring(5)}
              </div>
            {/if}
          {/each}
        {/each}
      </div>
    </div>
  </div>
{/key}
