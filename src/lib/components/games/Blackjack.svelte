<script lang="ts">
  export let outcome: string;

  const playerCardsText = outcome.split("member cards: ")[1].trim();
  const playerCards = playerCardsText
    .split("|")
    .map((i) => i.trim())
    .map((i) => i.replace("♠", "S").replace("♣️", "C").replace("♦️", "D").replace("♥️", "H"));
  playerCards.shift();
  const playerTotal = parseInt(playerCards.pop()?.replace("(", "").replace(")", "") as string);

  const dealerCardsText = outcome.split("dealer cards: ")[1].split("member cards:")[0].trim();
  const dealerCards = dealerCardsText
    .split("|")
    .map((i) => i.trim())
    .map((i) => i.replace("♠", "S").replace("♣️", "C").replace("♦️", "D").replace("♥️", "H"));
  dealerCards.shift();
  const dealerTotal = parseInt(dealerCards.pop()?.replace("(", "").replace(")", "") as string);

  while (dealerCards.length > playerCards.length) {
    playerCards.unshift("invisible");
  }

  while (playerCards.length > dealerCards.length) {
    dealerCards.push("invisible");
  }
</script>

<div class="flex w-full items-center justify-center text-center text-gray-500 opacity-50">
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
  <p class="mx-3 text-center text-5xl text-gray-200">-</p>
  {#each dealerCards as card}
    <img
      style="opacity: {card === 'invisible' ? '0' : '100'}%"
      src="/cards/{card === 'invisible' ? '2C' : card}.svg"
      alt={card}
      class="-mr-8 h-16 sm:h-24"
    />
  {/each}
</div>
