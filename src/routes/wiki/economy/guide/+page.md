<script>
  import DocsTemplate from "$lib/components/wiki/docs-template.svelte"
  import DocsHeader from '$lib/components/wiki/docs-header.svelte';
  import ItemModal from "$lib/components/wiki/item-modal.svelte"
</script>

<DocsTemplate title='basic progression guide' description="get started with nypsi's economy: claim free rewards, complete tasks and achievements, gather items with fish, hunt and mine, then sell your loot or use the market." />

nypsi does not have one required path to follow, but this loop is a good way to start earning money and building your inventory.

<DocsHeader header='h2' text="claim your rewards" />

start by using these commands whenever they are available:

- `/free` gives you free basic tools that you can use with `/fish`, `/hunt` and `/mine`.
- `/vote` gives money and items, including [crates](/wiki/economy/items/crates). you can vote every 12 hours, and keeping a vote streak improves your rewards.
- `/daily` gives a daily reward. claiming it each day builds your daily streak and can also give items such as crates and scratch cards.

you can enable vote reminders with `/settings me notifications` so that you do not miss a claim or lose a streak.

<DocsHeader header='h2' text="complete goals" />

use `/tasks` to see your current tasks. completing them gives useful rewards while encouraging you to try different parts of the economy.

[achievements](/wiki/economy/achievements) are longer-term goals. use `/achievements` to check your progress and collect rewards such as crates, scratch cards, xp and exclusive tags.

tasks and achievements often progress while you are earning money normally, so check them before deciding what to do next.

<DocsHeader header='h2' text="gather items" />

use the tools from `/free` with `/fish`, `/hunt` and `/mine`. these commands consume tool durability and give you fish, prey, sellables and other items.

better tools let you find more items and rarer items. you can obtain them from crates or buy basic tools with `/buy`. see the [fish, hunt and mine guide](/wiki/economy/fish-hunt-mine) for tool tiers, durability and boosters.

<DocsHeader header='h2' text="sell your items" />

there are two main ways to turn items into money:

1. use `/sell all` to sell common loot from fishing, hunting and mining directly to nypsi. the command shows the items and their sell value before you confirm.
2. sell valuable items to other players on [the market](/wiki/economy/market). check an item with `/item <item>` to see its estimated worth and recent market value, then use `/market search <item>` to view existing orders.

to list an item for other players to buy, use `/market manage` or create a sell order directly:

```
/market create <item> sell <amount> <price>
```

the `/sell` price is often much lower than what another player will pay for a valuable crate item. check `/item` and the market before selling collectables, tools, boosters or other rare items directly to nypsi.

<DocsHeader header='h2' text="level up" />

using economy commands earns xp. each level requires a certain amount of xp and money in your [bank](/wiki/economy/bank), and you will level up automatically once you meet both requirements. use `/profile` to check your current level and progress.

deposit money with `/deposit`. higher levels require more bank space, so you will eventually need to use <ItemModal item="stolen_credit_card">stolen credit cards</ItemModal> from crates, scratch cards or other players to increase your bank capacity.

levelling gives rewards along the way and every 100 levels allows you to prestige. prestiging lowers your level by 100, increases your prestige level and gives you a random permanent upgrade. **you do not lose your money or items when you prestige.**

repeat the reward, goal, gathering and selling loop to build up the money and xp needed for your next level. see the [levelling guide](/wiki/economy/level) for more information about bank size, level rewards and prestige upgrades.

<DocsHeader header='h2' text="what to try next" />

- [lottery](/wiki/economy/lottery): voting and crates can give <ItemModal item="lottery_ticket" trailing=",">lottery tickets</ItemModal> which are entered automatically for a chance to win money.
- [gambling](/wiki/economy/gambling): wager money in games such as blackjack, roulette and coinflip. gambling is risky and will often only make a profit when you have a high win multiplier and use gambling boosters, so do not bet money that you need for progression.
- [events](/wiki/economy/events): community-wide goals that reward participation and high contributors.
- [workers](/wiki/economy/workers): buy and upgrade workers to earn money passively, then claim their earnings regularly.
- [farms](/wiki/economy/farm): plant seeds from crates or scratch cards and care for them to produce items over time.

you do not need to start every system at once. pick the ones you enjoy, keep collecting your recurring rewards, and use tasks and achievements to guide you towards new activities.
