<script>
  import DocsTemplate from "$lib/components/docs/DocsTemplate.svelte"
  import DocsHeader from '$lib/components/docs/DocsHeader.svelte';
</script>

<DocsTemplate title='farms' />

<DocsHeader header='h2' text="starting a farm" />

to get a farm you need seeds. once you have seeds, you can plant them with `$use`

<DocsHeader header='h2' text="obtaining seeds" />

seeds can be obtained like any other 'rare' item, from crates and scratch cards. different crates / scratch cards will have different odds for giving seeds.

you can see the odds for crates on the [crates page](/docs/economy/items/crates)

the current seeds can be found on the [items page](/item)

<DocsHeader header='h2' text="caring for your farm" />

to keep your farm plants happy and healthy, you need to care for them! generally you can just check `$farm` every few days, if they're unhealthy, water and fertilise.

<DocsHeader header='h3' text="watering" />

plants need to be watered every 1-2 days, if they haven't been watered they get unhealthy and eventually die. to water you just use `$farm water`.

<DocsHeader header='h3' text="fertilising" />

fertilising is the exact same story. except they only need to be fertilised around every week. if they aren't fertilised for a long time, they will die. fertilising can be done with `$farm fertilise` or `$use fertiliser`
