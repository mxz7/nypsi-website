<script>
  import DocsTemplate from "$lib/components/docs/DocsTemplate.svelte"
  import DocsHeader from '$lib/components/docs/DocsHeader.svelte';
  import ItemModal from "$lib/components/docs/ItemModal.svelte"
</script>

<DocsTemplate title='item worth / value' description="learn how item worth and value are determined in nypsi, including unvalued items, market manipulation, price history, and the best way to sell items." />

items are often associated with a 'worth'. this comes from an average of what users pay for the item in [the market](/docs/economy/market) or offers.

<DocsHeader header='h2' text="unvalued" />

when items are first added to nypsi, there is no data on market orders or offers for the item. this can make it difficult to estimate how much the item is worth and how much you can sell it for. in these situations it may be best to ask a **trusted** and experienced nypsi player. if the item is new and rare, it's likely that it could be worth a lot.

items may also be unvalued if they have simply never been sold on [the market](/docs/economy/market) or through offers before. this is rare, but does happen with some incredibly rare items that are just traded between players.

<DocsHeader header='h2' text="manipulation" />

you may think that it's easy to manipulate the worth of items since it's based on market orders and offers. and it is pretty easy, but this is incredibly easy to find and remove, and is **very much against the rules**. you will be caught and you will be banned.

<DocsHeader header='h2' text="history" />

[premium members](https://nypsi.xyz/docs/premium) have access to view the item worth history graphs. these graphs are visible from the [items page](https://nypsi.xyz/items), or from a button on the `/item` command. this shows the past of item worth, market value, offers value and the amount of items in the world.

<DocsHeader header='h2' text="sell price" />

the sell price which you see in the `/item` command is the amount you will get for selling an item to nypsi with `/sell`. this is usually not recommended unless the item is supposed to be sold, which would be things like `prey`, `fish`, `sellables`. for the majority of items, players will pay a higher price than this to buy the item from you, whether that be in [the market](/docs/economy/market), offers, or a private sale.
