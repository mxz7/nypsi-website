<script>
  import DocsTemplate from "$lib/components/docs/DocsTemplate.svelte"
  import ItemModal from "$lib/components/docs/ItemModal.svelte"
  import Calculator from "./calculator.svelte"
</script>

<DocsTemplate title='workers' />

## what do workers do

workers passively earn money for you, meaning that you will be making money by doing nothing, however you still need to claim money from them periodically. you can do this with `/workers claim`, or by having worker notifications enabled. you will receive a dm with a button to claim money from your workers

## how do i buy workers?

you can buy, upgrade and claim money from your workers using `/workers`

## rare upgrades

some upgrades for workers you cannot buy in the upgrade menu (launchpad, warehouse permit, nasa computers, etc). these can be found in [crates](/docs/economy/items/crates?crate=workers) or bought from other players through [auctions](/docs/economy/items/inventory) or trading.

## special items

<ItemModal item="earth_scanner">earth scanners</ItemModal> and <ItemModal item="gem_radar">gem radars</ItemModal> have a chance to give you quarry scraps and gem shards respectively. the chance to get these are based off of the amount of the upgrades you have and the amount of items stored in your quarry. you can use the calculator below to see the chances of scraps and shards based on upgrades and the stored amount.

<Calculator />
