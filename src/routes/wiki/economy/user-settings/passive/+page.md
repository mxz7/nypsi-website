<script>
  import DocsTemplate from "$lib/components/wiki/DocsTemplate.svelte"
  import DocsHeader from '$lib/components/wiki/DocsHeader.svelte';
</script>

<DocsTemplate title='passive mode' description="enable passive mode to avoid being robbed or attacked by players, with reduced xp and cookie gain; 20-minute cooldown applies for changes." />

<DocsHeader header='h2' text="what is passive mode" />

enabling passive mode allows you to not be robbed or attacked by other players, at the expense of reduced multiplier, xp gain and cookie production

<DocsHeader header='h2' text="enabling/disabling" anchor="enabling-disabling" />

there is a 20 minute cooldown on enabling and disabling passive mode to prevent abuse.

```
/settings me passive on/off
```
