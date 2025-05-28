<script>
  import DocsTemplate from "$lib/components/docs/DocsTemplate.svelte"
  import ItemModal from "$lib/components/docs/ItemModal.svelte"
  import DocsHeader from '$lib/components/docs/DocsHeader.svelte';
</script>

<DocsTemplate title='bank' description="learn how the bank works in nypsi: boost bank size with stolen credit cards, keep money safe, level up faster, and master bankrob strategies." />

your bank is the little '💳' icon in `$balance` and `$profile`. it is used for levelling up.

<DocsHeader header='h2' text="increasing the size of your bank" />

when levelling up your bank will gradually increase, but not at the same rate that is needed for level ups. for that you will need to use <ItemModal item="stolen_credit_card">stolen credit cards</ItemModal>. they can be found in crates and scratch cards just like other items. they increase your bank size by a random amount, and will eventually be needed to use so that you can level up.

<DocsHeader header='h2' text="is my money safe in the bank?" />

technically, yes, your money cannot be robbed from other playes when it's in the bank. however, that is not the bank's main purpose. the bank's purpose is for levelling up. to level up you need a certain amount of xp and money for each level. as you reach higher levels, you will need more money and xp. eventually reaching the size capacity of your bank.

<DocsHeader header='h2' text="bankrob" />

bankrob is for stealing money from nypsi, money is given to nypsi when they pay tax, or under certain conditioins in the market.

bankrob allows you to rob from the nypsi bank

<DocsHeader header='h3' text="nypsi bank is closed" />

this means that the bank currently doesn't have enough funds to be robbed

<DocsHeader header='h3' text="lawyers" />

<ItemModal item="lawyer">lawyers</ItemModal> reduce the maximum potential loss from robbing by 65%

<DocsHeader header='h3' text="how does the bank get its money" />

the nypsi bank gets its money from tax when users sell items, use offers, [the market](/docs/economy/market) or paying each other
