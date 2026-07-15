<script>
  import DocsTemplate from "$lib/components/wiki/DocsTemplate.svelte"
  import ItemModal from "$lib/components/wiki/ItemModal.svelte"
  import DocsHeader from '$lib/components/wiki/DocsHeader.svelte';
</script>

<DocsTemplate title='events' description="" />

<DocsHeader header='h2' text="what is an event" />

an event is similar to a task, except it is for **everyone** who plays nypsi.

you may see the 🔱 (trident) emoji in some command outputs sometimes, this is showing the current event progress. you can also view event progress [here](/events).

events will end when the target is hit, or when the time runs out, depending on which type of event it is. an event will either have a target or an end date

<DocsHeader header='h2' text="event rewards" />

| group      | reward                                                                              |
| ---------- | ----------------------------------------------------------------------------------- |
| #1         | 3x <ItemModal item="pandora_box">pandora's box</ItemModal> guaranteed               |
| #1 - #5    | 7x <ItemModal item="pandora_box">pandora's box</ItemModal> randomly given to group  |
| #1 - #10   | 2,000x <ItemModal item="dabloon">dabloons</ItemModal> randomly given to group       |
| top 5%     | 10x <ItemModal item="pandora_box">pandora's box</ItemModal> randomly given to group |
| top 7.5%   | event achievement progress                                                          |
| top 10%    | 15x <ItemModal item="pandora_box">pandora's box</ItemModal> randomly given to group |
| top 50%    | 10x <ItemModal item="pandora_box">pandora's box</ItemModal> randomly given to group |
| bottom 50% | 7x <ItemModal item="pandora_box">pandora's box</ItemModal> randomly given to group  |

**randomly given to group** means that x amount of pandora boxes will be given to x random users in that group.

example: 10x boxes will be given to 3 members **randomly** chosen from the top 50% group.
