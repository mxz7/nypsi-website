<script>
  import DocsTemplate from "$lib/components/docs/DocsTemplate.svelte"
</script>

<DocsTemplate title='gambling' />

## maximum bet

your maximum bet is determined based on multiple factors, including level, premium and guild.

you can view your maximum bet with `$maxbet`

## card games

the card games included with nypsi have been made as realistic as possible, while also keeping them easy to play. card games will use 1 standard deck of cards, shuffled using the best regarded algorithm

when a card is chosen for either the player or the dealer, the card chosen is the first in the array (list), just like how you would take the first card from a real deck of playing cards.

## earning xp

to earn xp you must bet a minimum amount. this amount can be seen with `/settings me defaultbet`, and it changes depending on the amount of xp you earn is calculated on a number of variables, including your level, bet, win multiplier, premium level and inventory items. it works by creating a minimum and a maximum value, and creating a random number between those. any bonuses from active boosters will then be applied to that generated number.

## game id

every time you gamble (including fights, coinflips, etc.) a game id may be shown at the bottom of the message. this id shows the related information for each game, such as who created it, win/lose, earnings and the outcome. this is how gambling stats are calculated (`/stats`)
