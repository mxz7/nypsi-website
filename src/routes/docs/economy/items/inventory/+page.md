<script>
  import DocsTemplate from "$lib/components/docs/DocsTemplate.svelte"
  import DocsHeader from '$lib/components/docs/DocsHeader.svelte';
</script>

<DocsTemplate title='inventory system' />

<DocsHeader header='h2' text="how to get items" />

to get any items, you need to obtain [crates](/docs/economy/items/crates). the easiest way to obtain crates is through voting. you can vote every 12 hours and enable vote reminders through `/settings me notifications`

voting will give you varying rewards depending on your prestige, but generally, you will receive [vote crates](/docs/economy/items/crates), [karma](/docs/economy/karma), money, temporary multiplier booster and 5 [lottery tickets](/docs/economy/lottery).

<DocsHeader header='h2' text="item information" />

to find information about items, you can do `/item <item>`. this command will give you more user friendly information, such as how much the item is worth, the average amount that the item normally sells for on [the market](/docs/economy/market) and how many of the item are in the world (hint: the little percentage next to this number indicates your contribution to the global amount). you can also see this information in the [items page](/item).

you could also use `$help <item>` to view information about an item. however, this information is less user friendly and more technical, but it may help you understand better what each item does.
