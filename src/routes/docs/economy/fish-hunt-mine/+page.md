<script>
  import DocsTemplate from "$lib/components/docs/DocsTemplate.svelte"
  import ItemModal from "$lib/components/docs/ItemModal.svelte"
  import DocsHeader from '$lib/components/docs/DocsHeader.svelte';
</script>

<DocsTemplate title='fish hunt mine' description="learn how to obtain, upgrade and optimally use fishing rods, pickaxes, and guns in fish hunt mine using crates, shop, boosters, and manage item durability efficiently." />

<DocsHeader header='h2' text="obtaining" />

<DocsHeader header='h3' text="crates" />

[crates](/docs/economy/items/crates) is the main way that most people get their items, tools included. the best way to get crates as a beginner is to `/vote` twice daily. a higher vote streak allows you to get more crates at a time.

make sure you don't lose your vote streak by enabling vote reminders! `/settings me notifications`

<DocsHeader header='h3' text="shop" />

you can buy the lowest tier of tools in the shop (`$shop` & `/buy`). these are pretty basic but still allow you to grind and start to earn money.

<DocsHeader header='h2' text="different levels of item" />

the fishing rod, pickaxe and gun have different item ratings: terrible, normal, and incredible for fishing rods and guns, and wooden, iron, and diamond for pickaxes. the difference between these is how many of these you receive each time you find one in a crate, the amount of items you can get when using it, and what rarity items you can receive.

higher level guns, pickaxes, and fishing rods make it easier to find items that have a higher rarity rating.

<DocsHeader header='h2' text="durability" />

in your inventory, there's a number next to every item to indicate how many of those items you have. in the case for guns, pickaxes and fishing rods, this number is used to indicate how many times you can hunt / fish / mine before you need to find more guns / fishing rods / pickaxes.

<DocsHeader header='h2' text="portals" />

there are two additional [portals](/docs/economy/items/portals) you can use to increase the number of unique items that can be mined while using pickaxes or hunted using guns.

<DocsHeader header='h2' text="boosters" />

<ItemModal item="unbreaking" trailing=",">unbreakings</ItemModal> in combination with a slew of other boosters, are one of the most effective ways to make money in nypsi while utilizing fish, hunt, and mine.

to maximize profits with unbreakings, it's recommended to use (1) <ItemModal item="extended_mag">extended magazine</ItemModal> (1) <ItemModal item="worm" trailing=",">worm</ItemModal> (3) <ItemModal item="fortune" trailing=",">fortune</ItemModal> (3) <ItemModal item="efficiency" trailing=",">efficiency</ItemModal> (3) <ItemModal item="apple_juice" trailing=",">apple juice</ItemModal> (2) <ItemModal item="redbull" trailing=",">redbull</ItemModal> (1) unbreaking, as well as the top tier of fishing rods, guns and pickaxes. you can additionally use (2) <ItemModal item="looting">looting</ItemModal> and (1) <ItemModal item="double_xp">double xp</ItemModal> to further maximize xp and money gain. additionally, any tier of [premium](/docs/premium) reduces your command cooldown, with platinum being the best.

these boosters each last for 30 minutes, except the worm and extended magazine which last for 1 hour.

<DocsHeader header='h2' text="sell all" />

to sell the items gained from fish, hunt, and mine, use the command `/sell all` to view all the items and their worth. you can boost your sell multiplier, which increases the sell value of the items in `/sell all` via <ItemModal item="lucky_cheese" trailing=",">lucky cheese</ItemModal> [premium](/docs/premium), [guild shop](/docs/economy/guilds) and [levelling/prestiging](docs/economy/level)
