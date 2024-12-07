<script>
  import DocsTemplate from "$lib/components/docs/DocsTemplate.svelte"
  import DocsHeader from '$lib/components/docs/DocsHeader.svelte';
</script>

<DocsTemplate title='street races' />

street races work by starting an event in the current channel, then allowing members in that channel
to join the street race. to join they will need to have the available funds, and a car. if they
don't have a car, they will be given a complimentary bicycle 🙂

for every _tick_ in the street race, the next position of every user will be calculated using the
following:

movement = (speed value of chosen car) + (random value between -4 and 8)

if movement is less than the current position, the position will not change

<DocsHeader header='h2' text="getting a car" />

you can get a car from opening crates, faster cars will be rarer than slower cars, however, you
should keep more than one car, as using a car in a race puts it on cooldown for a short while.

<DocsHeader header='h2' text="custom cars" />

custom cars can be bought with `/garage`. they can be upgraded with upgrade parts and can be much
faster than normal cars. you can also customise their appearance with car skins
