<script>
  import DocsTemplate from "$lib/components/wiki/DocsTemplate.svelte"
  import ItemModal from "$lib/components/wiki/ItemModal.svelte"
  import DocsHeader from '$lib/components/wiki/DocsHeader.svelte';
</script>

<DocsTemplate title='museum' description="discover how the museum works and what it's for." />

the _museum_ exists to scratch that itch that some people get for collecting... or hoarding.

<DocsHeader header='h2' text="viewing" />

to view your museum you do `/museum view`, this will bring you to your customisable home page, you can then choose an item category from the select list at the bottom to browse your museum.

to view another user's museum, use `/museum lookup`, this will allow you to see their home page, other people can also see your home page.

<DocsHeader header='h2' text="donating" />

_donating_ is how you add items to your museum. each item has a specific threshold to be marked as 'completed', completed items do not get removed on new seasons, and you can keep donating infinitely.

**you can NOT get items back out of the museum**

<DocsHeader header='h2' text="leaderboards" />

there are museum leaderboards for each item, being the total amount donated, as well as how quickly it was completed.

<DocsHeader header='h2' text="item limits" />

some museum items have a limit that you cannot go over. for example: most boosters have a limit of 1, this is to keep a lot of these items in the economy, as it would be nice to not have them all disappear.

most items do not have a limit, you can donate as many as you want to the museum to get to the top of the leaderboard
