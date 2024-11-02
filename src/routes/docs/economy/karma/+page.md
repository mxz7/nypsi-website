<script>
  import DocsTemplate from "$lib/components/docs/DocsTemplate.svelte"
  import ShopItems from "./shop-items.svelte"
</script>

<DocsTemplate title='karma' />

## how to get karma

karma is earned passively while using commands with nypsi.

to check how much karma you have, use the `/karma` command.

## what is karma used for

karma is used in the karma shop that is opened periodically to purchase rewards such as xp, crates, and premium ranks.

## karma shop

while the karma shop is opened, it can be viewed using the `/karmashop view` command.

to purchase an item, use the command below.

```
/karmashop buy <item>
```

items on the karma shop have a limited stock, so make sure to buy them before stock runs out.

## how often is the karma shop open

the karma shop opens a few times a month, use the `/karmashop view` command to see when it is next scheduled to be opened. **please note** that these times are generated at random by nypsi for fairness.

## karma shop items
<ShopItems />
