<script>
  import DocsTemplate from "$lib/components/docs/DocsTemplate.svelte"
  import ItemModal from "$lib/components/docs/ItemModal.svelte"
</script>

<DocsTemplate title='bakery' />

the bakery is a way to produce <ItemModal item="cookie">cookies</ItemModal> and <ItemModal item="cake">cakes</ItemModal>

## how it works

you need a <ItemModal item="furnace">furnace</ItemModal> and 1 <ItemModal item="coal">coal</ItemModal> each time you bake. your furnace wont be used while baking, but coal will be used. if you want to bake, do `/bake`

## how do i bake more cookies?

you can increase your cookie production with cursors, super cursors, and grandmas

| item                                                      | effect                        |
| --------------------------------------------------------- | ----------------------------- |
| <ItemModal item="cursor">cursor</ItemModal>               | +1 max cookie                 |
| <ItemModal item="super_cursor">super cursor</ItemModal>   | +1 min & max cookie           |
| <ItemModal item="grandma">grandma</ItemModal>             | bakes 0.5 cookies each hour   |
| <ItemModal item="grandpa">grandpa</ItemModal>             | +0.5% chance of baking a cake |
| <ItemModal item="oven">oven</ItemModal>                   | +1 hour of afk time           |

with ovens, cookies will build up from grandmas up to the max afk time. this means that with 12 ovens you can store 6 cookies per grandma, maxing out after 12 hours.

cookie production also has chance to be doubled either from [guild upgrades](/docs/economy/guilds) or certain [gems](/docs/economy/items/gems)

## how do i bake cakes?

cakes have a chance to be baked depending on the amount of grandpas in your bakery. it starts off at 0%, increasing by 0.5% per grandpa, up to a maximum of 25%. any amount of grandpas over 50 does nothing, so it is not recommended using more than that.&#x20;

the percent chance to get cakes continues to run until it fails, so it is possible to get more than 1 cake per bake if you are lucky. if you have a 25% chance of getting a cake, the chance of 1 cake is 1/4, 2 cakes 1/16, 3 cakes 1/64, etc.

## how do you get upgrades?

upgrades can be obtained from [crates](/docs/economy/items/crates) and [scratch cards](/docs/economy/items/scratch-cards)
