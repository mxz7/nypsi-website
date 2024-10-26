<script lang="ts">
  interface Props {
    outcome: string;
  }

  let { outcome }: Props = $props();

  const outcomeData = JSON.parse(outcome) as {
    player: { cards: string[]; total: number };
    dealer: { cards: string[]; total: number };
  };

  const playerCards = outcomeData.player.cards
    .map((i) => i.trim())
    .map((i) => i.replace("♠️", "S").replace("♣️", "C").replace("♦️", "D").replace("♥️", "H"));
  const playerTotal = outcomeData.player.total;

  const dealerCards = outcomeData.dealer.cards
    .map((i) => i.trim())
    .map((i) => i.replace("♠️", "S").replace("♣️", "C").replace("♦️", "D").replace("♥️", "H"));
  const dealerTotal = outcomeData.dealer.total;

  while (dealerCards.length > playerCards.length) {
    playerCards.unshift("invisible");
  }

  while (playerCards.length > dealerCards.length) {
    dealerCards.push("invisible");
  }
</script>

<div class="flex w-full items-center justify-center text-center text-slate-200 opacity-50">
  <p class="mr-16">player ({playerTotal})</p>
  <p class="ml-16">nypsi ({dealerTotal})</p>
</div>
<div class="mt-2 flex w-full items-center justify-center">
  {#each playerCards as card}
    <img
      style="opacity: {card === 'invisible' ? '0' : '100'}%"
      src="/cards/{card === 'invisible' ? '2C' : card}.svg"
      alt={card}
      class="-ml-8 h-16 sm:h-24"
    />
  {/each}
  <p class="mx-3 text-center text-5xl text-slate-200">-</p>
  {#each dealerCards as card}
    <img
      style="opacity: {card === 'invisible' ? '0' : '100'}%"
      src="/cards/{card === 'invisible' ? '2C' : card}.svg"
      alt={card}
      class="-mr-8 h-16 sm:h-24"
    />
  {/each}
</div>
