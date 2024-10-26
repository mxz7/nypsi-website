<script lang="ts">
  import { page } from "$app/stores";
  import Blackjack from "$lib/components/games/Blackjack.svelte";
  import Mines from "$lib/components/games/Mines.svelte";
  import RockPaperScissors from "$lib/components/games/RockPaperScissors.svelte";
  import Roulette from "$lib/components/games/Roulette.svelte";
  import Scratch from "$lib/components/games/Scratch.svelte";
  import Slots from "$lib/components/games/Slots.svelte";
  import Tower from "$lib/components/games/Tower.svelte";
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";

  let { data } = $props();

  onMount(async () => {
    console.log(await Promise.resolve(data.game));
  });
</script>

<svelte:head>
  <title>game: {$page.params.id} / nypsi</title>
</svelte:head>

<div class="mt-8 flex flex-col justify-center">
  <div in:fly={{ y: 25, delay: 300, duration: 500 }} out:fly={{ y: 15, duration: 250 }}>
    {#if data.game && data.game.ok}
      <div class="my-3">
        {#if data.game.game === "slots"}
          <Slots outcome={data.game.outcome} />
        {:else if data.game.game === "rps"}
          <RockPaperScissors outcome={data.game.outcome} />
        {:else if data.game.game === "blackjack"}
          <Blackjack outcome={data.game.outcome} />
        {:else if data.game.game.includes("scratch")}
          <Scratch game={data.game} />
        {:else if data.game.game === "tower"}
          <Tower outcome={data.game.outcome} />
        {:else if data.game.game === "mines"}
          <Mines outcome={JSON.parse(data.game.outcome.slice(6))} />
        {:else if data.game.game === "roulette"}
          <Roulette outcome={data.game.outcome} />
        {:else}
          <p class="text-center text-white">
            game: {data.game.game}<br />outcome: {data.game.outcome}
          </p>
        {/if}
      </div>
      <div class="text-center text-xl font-bold">
        <!-- <p class="text-xs text-white">{game.outcome}</p> -->
        {#if data.game.win == 1 && !data.game.game.includes("scratch")}
          <p class=" success">won</p>

          <p class="success text-lg opacity-75">
            ${(data.game.earned - data.game.bet).toLocaleString()} profit
          </p>
        {:else if data.game.win == 0 && !data.game.game.includes("scratch")}
          <p class=" text-error">lost</p>
        {:else if data.game.win == 2 && !data.game.game.includes("scratch")}
          <p class=" text-yellow-500">draw</p>
        {/if}
      </div>

      <div class="mt-5 px-2 text-center text-slate-300">
        {#if data.game.win == 1 && !data.game.game.includes("scratch")}
          <p>
            bet ${data.game.bet.toLocaleString()} and won ${data.game.earned.toLocaleString()}{data
              .game.xpEarned > 0
              ? ` (${data.game.xpEarned.toLocaleString()}xp)`
              : ""}
          </p>
        {:else if !data.game.game.includes("scratch")}
          <p>bet ${data.game.bet.toLocaleString()}</p>
        {/if}

        <p class="mt-3 text-center text-slate-300">
          played by
          {#if data.game.userId}
            <a
              href="/user/{data.game.userId}"
              class="font-bold text-primary underline-offset-4 hover:underline"
              >{data.game.username}</a
            >
          {:else}
            <span class="font-bold text-primary">{data.game.username}</span>
          {/if}
          on {new Date(data.game.date).toLocaleDateString()} at {new Date(
            data.game.date,
          ).toLocaleTimeString()}
        </p>
      </div>
    {:else}
      <p class="text-center text-xl font-bold text-white">unknown game</p>
    {/if}
  </div>
</div>
