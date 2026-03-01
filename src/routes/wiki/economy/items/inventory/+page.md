<script>
  import DocsTemplate from "$lib/components/wiki/DocsTemplate.svelte"
  import DocsHeader from '$lib/components/wiki/DocsHeader.svelte';
</script>

<DocsTemplate title='inventory system' description="learn how to get items in the inventory system by voting for crates, earning rewards like karma and lottery tickets, and viewing detailed item info." />

<DocsHeader header='h2' text="how to get items" />

to get any items, you need to obtain [crates](/wiki/economy/items/crates). the easiest way to obtain crates is through voting. you can vote every 12 hours and enable vote reminders through `/settings me notifications`

voting will give you varying rewards depending on your prestige, but generally, you will receive [vote crates](/wiki/economy/items/crates), [karma](/wiki/economy/karma), money, temporary multiplier booster and 5 [lottery tickets](/wiki/economy/lottery).

<DocsHeader header='h2' text="item information" />

to find information about items, you can do `/item <item>`. this command will give you more user friendly information, such as how much the item is worth, the average amount that the item normally sells for on [the market](/wiki/economy/market) and how many of the item are in the world (hint: the little percentage next to this number indicates your contribution to the global amount). you can also see this information in the [items page](/items).

you could also use `$help <item>` to view information about an item. however, this information is less user friendly and more technical, but it may help you understand better what each item does.
