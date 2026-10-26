<script>
  import DocsTemplate from "#lib/components/wiki/docs-template.svelte"
  import ShopItems from "./shop-items.svelte"
  import DocsHeader from '#lib/components/wiki/docs-header.svelte';
</script>

<DocsTemplate title='karma' description="learn how to earn and use karma in nypsi to buy exclusive rewards like xp, crates, and premium ranks in the limited-time karma shop." />

<DocsHeader header='h2' text="how to get karma" />

karma is earned passively while using commands with nypsi.

to check how much karma you have, use `/karma balance`. you can choose the optional `user` option to check another user's karma. use `/karma help` to learn more about the karma system.

<DocsHeader header='h2' text="what is karma used for" />

karma is used in the karma shop that is opened periodically to purchase rewards such as xp, crates, and premium ranks.

<DocsHeader header='h2' text="karma shop" />

while the karma shop is opened, it can be viewed using `/karma shop`.

to purchase an item, use the command below.

```
/karma buy item-karmashop:<item>
```

items on the karma shop have a limited stock, so make sure to buy them before stock runs out.

<DocsHeader header='h2' text="how often is the karma shop open" />

the karma shop opens a few times a month, use `/karma shop` to see when it is next scheduled to be opened. **please note** that these times are generated at random by nypsi for fairness.

if you prefer prefix commands, `$karma`, `$karmashop view`, `$karmashop buy <item>` and `$karmahelp` still work.

<DocsHeader header='h2' text="karma shop items" />

<ShopItems />
