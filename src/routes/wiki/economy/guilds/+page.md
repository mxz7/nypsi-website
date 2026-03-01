<script>
  import DocsTemplate from "$lib/components/wiki/DocsTemplate.svelte"
  import DocsHeader from '$lib/components/wiki/DocsHeader.svelte';
</script>

<DocsTemplate title='guilds' description="join or create guilds, invite friends, earn guild tokens, unlock upgrades and rewards, and compete for top spots and real money prizes on this hypixel-inspired server." />

guilds work similarly to how they do on hypixel. you create your own guild, invite friends, and work together to level it up.

<DocsHeader header='h2' text="what's the point?" />

guild owners can buy things from the guild shop with tokens, this will give you upgrades and allow you to earn more money quicker. you receive guild tokens from levelling up

on each level up, the top contributors will receive rewards.

at the end of the season, the top guilds will receive premium and real money as rewards.

<DocsHeader header='h2' text="upgrading" />

your guild will upgraded automatically, once the requirements have been met. you can do `/guild upgrade` to look at the requirements for the next upgrade

<DocsHeader header='h2' text="guild members" />

a guild can only hold so many members, this can be upgraded from the shop with guild tokens.

having more members in a guild allows you all to contribute more, but makes it harder to level up

only the top 4 xp AND top 4 money contributors will receive rewards on each level up

to leave your guild, use the `/guild leave` command. if you are the owner however, you will need to delete your guild, using `/guild delete`

<DocsHeader header='h2' text="how can i get my money back after depositing?" />

you can't get your money back after it has been deposited into the guild. that money is now used for the guild's level ups.

<DocsHeader header='h2' text="guild shop upgrades" />

<DocsHeader header='h3' text='member slot' />

the member slot upgrade comes with a _slight_ side effect. for every member slot purchased, the requirements to upgrade the guild level will be increased. this helps to keep guilds smaller, fairer and adds more competition to nypsi.

<DocsHeader header='h3' text='upgrades' />

use `/guild buy <id>` to buy an upgrade

| id (used to purchase) | name              | effect per level                      |
| --------------------- | ----------------- | ------------------------------------- |
| member                | member slot       | +1 member slot                        |
| maxbet                | max bet increase  | +25k maxbet                           |
| multi                 | gamble multiplier | +1% gamble multiplier                 |
| sellmulti             | sell multiplier   | +5% sell multiplier                   |
| cooldown              | shorter cooldowns | +5% shorter cooldowns                 |
| bakery                | double cookies    | +2% chance to double cookies produced |
