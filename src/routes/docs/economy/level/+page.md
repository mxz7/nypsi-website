<script>
  import DocsTemplate from "$lib/components/docs/DocsTemplate.svelte"
  import ItemModal from "$lib/components/docs/ItemModal.svelte"
  import DocsHeader from '$lib/components/docs/DocsHeader.svelte';
</script>

<DocsTemplate title='levelling' description="learn how levelling, rewards, bank size, and prestiging work in our system. discover xp boosters, upgrades, stolen credit cards, and more." />

levels work on a 1-100 basis, each 100 levels acting as a new prestige, even if you don't explicitly prestige

<DocsHeader header='h2' text="levelling up" />

level ups are handled automatically whenever you meet the xp and bank requirements (`/profile`)

<DocsHeader header='h2' text="level up rewards" />

level up rewards are spread out between levels, for example, every 50 levels you will receive an xp booster

<DocsHeader header='h2' text="increasing bank size" />

the main way of increasing your bank size is with <ItemModal item="stolen_credit_card">stolen credit cards.</ItemModal> you can buy these from other users or find them yourself in [crates](/docs/economy/items/crates), [scratch cards](/docs/economy/items/scratch-cards), etc. another way to increase your bank is to level up, however, sometimes you will need to use a credit card to have enough bank storage to be able to level up

<DocsHeader header='h2' text="prestiging" />

when you prestige, your level will be decreased by 100 and given a prestige level. you will receive a random permanent upgrade seen in the upgrades button in `/profile`. if you don't like the upgrade that you received, you can always use a `reroll token` to reroll a specific upgrade, which can be found in [scratch cards](/docs/economy/items/scratch-cards) and [omega crates](/docs/economy/items/crates?crate=omega). **you do not lose anything when you prestige**
