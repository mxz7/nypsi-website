<script>
  import DocsTemplate from "$lib/components/wiki/docs-template.svelte"
  import DocsHeader from '$lib/components/wiki/docs-header.svelte';
</script>

<DocsTemplate title='the market' description="buy and sell items with other players on the nypsi market. buy or sell instantly, create limit orders, get alerts, use trade requests, and manage offers easily with commands." />

<DocsHeader header='h2' text="how it works" />

the market is a place where you can buy and sell items with other players. to access it, use `/market`.

<DocsHeader header='h2' text="buy and sell" />

the command format is:

```
/market <buy|sell> <item> [amount] [price]
```

`amount` is optional and defaults to `1`. use `buy` to buy from the lowest-priced sell orders, or `sell` to sell to the highest-priced buy orders. nypsi uses the available orders in the best-price order until it has filled your amount.

you can use `$mk b` and `$mk s` as shorter versions of `$market buy` and `$market sell`.

if you include a price, that will act as your minimum (sell) or maximum (buy) price per item. the market will work to fulfill your request, and create a buy/sell order if unable to fully complete your request.

<DocsHeader header='h2' text="create a buy or sell order" />

add `price` to the same command to create a limit order. a buy price is the most you will pay per item; a sell price is the least you will accept per item. the order will still fill existing favourable orders first, then any amount left over is posted as your new order.

```
/market buy <item> <amount> <maximum price per item>
/market sell <item> <amount> <minimum price per item>
```

the money for a buy order, or the items for a sell order, are held until the order is filled or you cancel it. use `/market manage` to view and cancel your active buy and sell orders.

<DocsHeader header='h2' text="browse the market" />

use `/market search <item>` or `$mk v <item>` to see that item's buy and sell orders before choosing a price. you can also view a live feed of the entire market in the [official nypsi discord server](/discord), where you can fulfill orders.

<DocsHeader header='h2' text="market watch" />

you are able to receive dms when certain items are up to buy or sell on the market with `/market watch`. you can receive dms either for whenever the item goes up or for when it is under a certain price threshold.

<DocsHeader header='h2' text="trade requests" />

in addition to the market, there are also trade requests. these are created through `/trade`. to fulfill trades you need to be in the [official nypsi server](/discord). however, to create trades you don't need to be.

<DocsHeader header="h2" text="offers" />

offers are very similar to the market, however it exists so that you can request to buy an item directly from someone who may not be aware they have it, or may not be an active nypsi player. a very useful tool to gather items you might need!
