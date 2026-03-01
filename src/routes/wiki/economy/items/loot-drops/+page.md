<script>
  import DocsTemplate from "$lib/components/docs/DocsTemplate.svelte"
  import DocsHeader from '$lib/components/docs/DocsHeader.svelte';
  import ItemModal from "$lib/components/docs/ItemModal.svelte"
</script>

<DocsTemplate title='loot drops' description="discover how loot drops and rare loot rains spawn in active discord channels, their random rewards, and how to get more on the official nypsi server." />

loot drops are little minigames that spawn with activity in a channel, the first to complete the game receives a random reward

<DocsHeader header='h2' text="spawning" />

loot drops will spawn randomly when there is activity in a channel. the more people that are active in the same channel, the higher probability that one will spawn

you may find that the commands channel in the [official nypsi server](https://discord.gg/hJTDNST) is active enough for them to spawn frequently

<DocsHeader header='h2' text="rewards" />

the reward for loot drops is randomly generated from a list of allowed items, in a similar way that scratch card rewards are decided

<DocsHeader header='h2' text='loot rains' />

<ItemModal item="rain">loot rains</ItemModal> are special, incredibly rare items that spawn a wave of loot drops for 1-2 minutes.

a loot rain will be 2 minutes **only** if it is in the [official nypsi server](https://nypsi.xyz/discord).

loot rains can also be bought from the online store
