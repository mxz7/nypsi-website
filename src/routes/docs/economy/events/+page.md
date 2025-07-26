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

if the event target **is not reached** before the timer runs out, there will be no rewards given.

| group    | reward                                                                             |
| -------- | ---------------------------------------------------------------------------------- |
| #1       | 1x <ItemModal item="pandora_box">pandora's box</ItemModal> guaranteed              |
| #1 - #5  | 2x <ItemModal item="pandora_box">pandora's box</ItemModal> randomly given to group |
| top 2.5% | event achievement progress                                                         |
| top 5%   | 5x <ItemModal item="pandora_box">pandora's box</ItemModal> randomly given to group |
| top 10%  | 4x <ItemModal item="pandora_box">pandora's box</ItemModal> randomly given to group |
| top 50%  | 3x <ItemModal item="pandora_box">pandora's box</ItemModal> randomly given to group |

**randomly given to group** means that x amount of pandora boxes will be given to x random users in that group.

example: 3x boxes will be given to 3 members **randomly** chosen from the top 50% group.
