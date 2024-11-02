<script>
  import DocsTemplate from "$lib/components/docs/DocsTemplate.svelte"
</script>

<DocsTemplate title='inventory system' />

## how to get items

to get any items, you need to obtain [crates](/docs/economy/items/crates). the easiest way to obtain crates is through voting. you can vote every 12 hours and enable vote reminders through `/settings me notifications`

voting will give you varying rewards depending on your prestige, but generally, you will receive [vote crates](/docs/economy/items/crates), [karma](/docs/economy/karma), money, temporary multiplier booster and 5 lottery tickets.

## auctions

to buy auctions you need to be in the [official nypsi server](https://nypsi.xyz/discord). however, to create auctions you don't need to be.

to create an auction, use `/auction create`. it will help you look through the items in your inventory with automatic suggestions.

to receive a DM notification whenever your favourite item goes on auction, you can use `/auction watch` to toggle what items you would like to be notified for. having a premium membership increases the amount of items you can be watching at once. normal users can watch 5 items at once, with each tier of premium giving +5.

## item information

to find information about items, you can do `/item <item>`. this command will give you more user friendly information, such as how much the item is worth, the average amount that the item normally sells for on auction and how many of the item are in the world (hint: the little percentage next to this number indicates your contribution to the global amount).

you could also use `$help <item>` to view information about an item. however, this information is less user friendly and more technical, but it may help you understand better what each item does.
