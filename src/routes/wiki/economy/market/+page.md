<script>
  import DocsTemplate from "$lib/components/docs/DocsTemplate.svelte"
  import DocsHeader from '$lib/components/docs/DocsHeader.svelte';
</script>

<DocsTemplate title='the market' description="buy and sell items with other players on the nypsi market. create and fill orders, get alerts, use trade requests, and manage offers easily with commands." />

<DocsHeader header='h2' text="how it works" />

the market is a place where you can buy and sell items with other players. to access it, use `/market`.

<DocsHeader header='h2' text="buy and sell orders" />

buy and sell orders are created through `/market manage`. this menu also lets you see the most recent buy and sell orders.

you can also make one with a single command, example:

```
/market create <item> <buy|sell> <amount> <price>
$mk c <item> <b|s> <amount> <price>
```

<DocsHeader header='h2' text="filling orders" />

to access the market of an item, do `/market search <item>`. here, you can sell to buy orders or buy from sell orders.

you can also view a 'live feed' of the entire market in the [official nypsi discord server](/discord), where you can also fulfill orders.

<DocsHeader header='h2' text="market watch" />

you are able to receive dms when certain items are up to buy or sell on the market with `/market watch`. you can receive dms either for whenever the item goes up or for when it is under a certain price threshold.

<DocsHeader header='h2' text="trade requests" />

in addition to the market, there are also trade requests. these are created through `/trade`. to fulfill trades you need to be in the [official nypsi server](/discord). however, to create trades you don't need to be.

<DocsHeader header="h2" text="offers" />

offers are very similar to the market, however it exists so that you can request to buy an item directly from someone who may not be aware they have it, or may not be an active nypsi player. a very useful tool to gather items you might need!
