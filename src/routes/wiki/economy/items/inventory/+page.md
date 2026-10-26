<script>
  import DocsTemplate from "#lib/components/wiki/docs-template.svelte"
  import DocsHeader from '#lib/components/wiki/docs-header.svelte';
</script>

<DocsTemplate title='inventory system' description="learn how to get items in the inventory system by voting for crates, earning rewards like karma and lottery tickets, and viewing detailed item info." />

<DocsHeader header='h2' text="how to get items" />

to get any items, you need to obtain [crates](/wiki/economy/items/crates). the easiest way to obtain crates is through voting. you can vote every 12 hours and enable vote reminders through `/settings me notifications`

voting will give you varying rewards depending on your prestige, but generally, you will receive [vote crates](/wiki/economy/items/crates), [karma](/wiki/economy/karma), money, temporary multiplier booster and 5 [lottery tickets](/wiki/economy/lottery).

<DocsHeader header='h2' text="item information" />

to find information about items, you can do `/item <item>`. this command will give you more user friendly information, such as how much the item is worth, the average amount that the item normally sells for on [the market](/wiki/economy/market) and how many of the item are in the world (hint: the little percentage next to this number indicates your contribution to the global amount). you can also see this information in the [items page](/items).

you could also use `/help query:<item>` to view information about an item. however, this information is less user friendly and more technical, but it may help you understand better what each item does.

<DocsHeader header='h2' text="using items" />

to use an item, run `/use` and choose it in the `item` option. autocomplete suggests usable items from your inventory and shows how many you own.

the optional `amount` option defaults to `1`. for items that support using several at once, enter a quantity or `all`. items that can only be used one at a time ignore this option. for example, `/use item:vote_crate amount:5` opens five vote crates, subject to your crate opening limit.

if an item is used on another member, choose them in the separate `member` option, for example `/use item:handcuffs member:@user`. keep quantities and members out of the `item` option.

prefix commands still use `$use <item> [amount or member]`. tools such as fishing rods, guns and pickaxes are used through `/fish`, `/hunt` and `/mine` instead of `/use`.
