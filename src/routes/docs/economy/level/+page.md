<script>
  import DocsTemplate from "$lib/components/docs/DocsTemplate.svelte"
  import ItemModal from "$lib/components/docs/ItemModal.svelte"
  import DocsHeader from '$lib/components/docs/DocsHeader.svelte';
</script>

<DocsTemplate title='levelling' description="learn how levelling, rewards, bank size, and prestiging work in our system. discover xp boosters, upgrades, stolen credit cards, and more." />

levels work on a 1-100 basis, each 100 levels acting as a new prestige, even if you don't explicitly prestige. although, there is no reason to _not_ prestige, you will be missing out on an [upgrade](#prestige-upgrades)

<DocsHeader header='h2' text="levelling up" />

level ups are handled automatically whenever you meet the xp and bank requirements (`/profile`)

<DocsHeader header='h2' text="level up rewards" />

level up rewards are spread out between levels, for example, every 50 levels you will receive an xp booster

<DocsHeader header='h2' text="increasing bank size" />

the main way of increasing your bank size is with <ItemModal item="stolen_credit_card" trailing=".">stolen credit cards</ItemModal> you can buy these from other users or find them yourself in [crates](/docs/economy/items/crates), [scratch cards](/docs/economy/items/scratch-cards), etc. another way to increase your bank is to level up, however, sometimes you will need to use a credit card to have enough bank storage to be able to level up

<DocsHeader header='h2' text="prestiging" />

when you prestige, your level will be decreased by 100 and given a prestige level. you will receive a random permanent upgrade seen in the upgrades button in `/profile`. if you don't like the upgrade that you received, you can use a <ItemModal item="reroll_token">reroll token</ItemModal> to reroll that upgrade into a different random one. **you do not lose anything when you prestige**

<DocsHeader header='h2' text="prestige upgrades" />

| perk name           | description              | max |
| ------------------- | ------------------------ | --- |
| cursor booster      | +0.1 cookies per cursor  | 20  |
| grandma booster     | +0.1 cookies per grandma | 20  |
| guild xp booster    | +3% xp sent to guild     | 5   |
| gamble multiplier   | +1% gamble multiplier    | 5   |
| xp booster          | +5% more xp              | 5   |
| sell multiplier     | +3% sell multiplier      | 15  |
| farm output booster | +2% farm output          | 10  |
