<script>
  import DocsTemplate from "$lib/components/wiki/docs-template.svelte"
  import DocsHeader from "$lib/components/wiki/docs-header.svelte"
  import Pets from "./pets.svelte"
</script>

<DocsTemplate title='pets' description="learn how to unlock, level up and activate pets for passive economy bonuses across farming, baking, grinding, xp, events and gambling." />

pets are economy items that give you a chance of receiving a bonus when you use the part of the economy they help with.

<DocsHeader header='h2' text="unlocking and levelling pets" />

use a pet item with `/use <pet>` to unlock it. using more copies of an unlocked pet levels it up instead.

each level requires more copies of the pet item. higher levels improve the chance of the pet activating and may also improve its bonus. use `/pets` and select a pet to see its current level, effect, activation chance and how many items are needed for the next level.

you can also open a pet directly with `/pet <pet>`.

<DocsHeader header='h2' text="active pets" />

only active pets can provide their bonus. use `/pets` to view your active pets and activate or deactivate any pet you have unlocked.

you start with one active pet slot. extra slots are available through personal upgrades, up to a maximum of five active pets.

when a pet successfully provides its benefit, its lifetime activation count for the current economy season increases. pets, their levels and their activation counts reset with the rest of the [seasonal economy](/wiki/economy/seasons).

<DocsHeader header='h2' text="pet benefits" />

<Pets />
