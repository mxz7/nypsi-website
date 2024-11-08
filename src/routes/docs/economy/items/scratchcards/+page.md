<script>
  import DocsTemplate from "$lib/components/docs/DocsTemplate.svelte"
</script>

<DocsTemplate title='scratch cards' />

## how do they work

scratch cards work just as you would expect them to do `/use <scratch card>` to use a scratch card. to win, you must get 3 in a row (horizontally or vertically).

## how do i get them

daily scratch cards can be obtained from doing `/daily` each day

corner shop scratchies can be purchased from the shop with `/buy`

karma scratch cards can be purchased from the [karma shop](/docs/economy/karma)

lucky scratch cards and legendary scratch cards can be obtained from achievements or [crates](/docs/economy/items/crates)

there are 3 other scratch cards which you can only get , or from achievements. these are the lucky scratch card, karma scratch card and the legendary scratch card.

## how the prize pool works

you may see on the [items page](/items/daily_scratch_card) that some items have a 100% chance in scratch cards (or lootdrops). this is because of how scratch cards work, and how it's not exactly super easy possible to generate the odds like it is with crates.

the percentage that you see is the chance of the item appearing in the prize pool during the scratch card generation.

the prize pool is then used to randomly populate the scratch card, with between 1-2 winning rows being forced from those items.

so even if the item gets into the prize pool, it doesnt mean that its possible to be won in the scratch card.

loot drops work in an almost identical way, minus the random population. with just 1 item being chosen from the prize pool with random chance.

crates (other than basic & 69420) also work in this exact way, however it is very easy to just run a simulation of millions of crates being opened to determine the end chances.
