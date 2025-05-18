<script>
  import DocsTemplate from "$lib/components/docs/DocsTemplate.svelte"
  import ItemModal from "$lib/components/docs/ItemModal.svelte"
  import DocsHeader from '$lib/components/docs/DocsHeader.svelte';
</script>

<DocsTemplate title='bankrob'  />

bankrob allows you to rob from the nypsi bank

<DocsHeader header='h2' text="nypsi bank is closed" />

this means that the bank currently doesn't have enough funds to be robbed

<DocsHeader header='h2' text="lawyers" />

<ItemModal item="lawyer">lawyers</ItemModal> reduce the maximum potential loss from robbing by 65%

<DocsHeader header='h2' text="how does the bank get its money" />

the nypsi bank gets its money from tax when users sell items, use offers, [the market](/docs/economy/market) or paying each other
