<script>
  import DocsTemplate from "$lib/components/docs/DocsTemplate.svelte"
  import ItemModal from "$lib/components/docs/ItemModal.svelte"
  import DocsHeader from '$lib/components/docs/DocsHeader.svelte';
</script>

<DocsTemplate title='events' description="" />

<DocsHeader header='h2' text="what is an event" />

an event is similar to a task, except it is for **everyone** who plays nypsi.

you may see the 🔱 (trident) emoji in some command outputs sometimes, this is showing the current event progress. you can also view event progress [here](/events).

<DocsHeader header='h2' text="event rewards" />

if the even target **is not reached** before the timer runs out, there will be no rewards given.

<ItemModal item="pandora_box">pandora's boxes</ItemModal> are distributed to the group.

const REWARDS_TOP10P = 4;
const REWARDS_TOP50P = 3;

| group   | reward                                                     |
| ------- | ---------------------------------------------------------- |
| top 5%  | event achievement progress                                 |
| top 10% | 4x <ItemModal item="pandora_box">pandora's box</ItemModal> |
| top 50% | 3x <ItemModal item="pandora_box">pandora's box</ItemModal> |
