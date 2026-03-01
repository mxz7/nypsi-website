<script>
  import DocsTemplate from "$lib/components/wiki/DocsTemplate.svelte"
  import ItemModal from "$lib/components/wiki/ItemModal.svelte"
  import DocsHeader from '$lib/components/wiki/DocsHeader.svelte';
</script>

<DocsTemplate title='scratch cards' description="learn how to use and obtain scratch cards, daily scratch cards, and shop scratchies. discover how prize pools and winning chances work in this guide." />

scratch cards work just as you would expect them to do `/use <scratch card>` to use a scratch card. to win, you must get 3 in a row (horizontally or vertically).

<DocsHeader header='h2' text="obtaining" />

<p>
<ItemModal item="daily_scratch_card">daily scratch cards</ItemModal> can be obtained from doing `/daily` each day
</p>

<p>
<ItemModal item="corner_shop_scratchie">corner shop scratchies</ItemModal> can be purchased from the shop with `/buy`
</p>

<p>
<ItemModal item="karma_scratch_card">karma scratch cards</ItemModal> can be purchased from the <a href="/wiki/economy/karma">karma shop</a>
</p>

<p>
<ItemModal item="lucky_scratch_card">lucky scratch cards</ItemModal> and <ItemModal item="legendary_scratch_card">legendary scratch cards</ItemModal> can be obtained from achievements or <a href="/wiki/economy/items/crates">crates</a>
</p>
