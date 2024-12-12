<script>
  import DocsTemplate from "$lib/components/docs/DocsTemplate.svelte"
  import ItemModal from "$lib/components/docs/ItemModal.svelte"
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

to keep your farm plants happy and healthy, you need to care for them! generally you can just check `$farm` every few days, if they're unhealthy, water **then** fertilise if needed.

<DocsHeader header='h3' text="watering" />

plants need to be watered every 1-2 days, if they haven't been watered they get unhealthy and eventually die. to water you just use `$farm water`.

<DocsHeader header='h3' text="fertilising" />

fertilising is the exact same story. except they only need to be fertilised around every week. if they aren't fertilised for a long time, they will die. fertilising can be done with `$farm fertilise` or `$use fertiliser`

<DocsHeader header='h2' text="farm upgrades" />

there are certain items that you can use to upgrade farms. these upgrade apply for all plants of a single plant type.

you can use a <ItemModal item="farm_silo">silo</ItemModal> to upgrade the plant storage by 10%, up to a max of 50%.

in order to upgrade the speed of farms, you can use hoes. hoes have an upgradable item path, meaning that you have to start with the lowest level hoe and work your way up to the highest. each hoe gives you a 5% boost to output, making the boost go from 5% with a <ItemModal item="stone_hoe">stone hoe</ItemModal> up to 25% with a <ItemModal item="netherite_hoe">netherite hoe</ItemModal>
