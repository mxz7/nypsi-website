<script>
  import DocsTemplate from "$lib/components/wiki/DocsTemplate.svelte"
  import ItemModal from "$lib/components/wiki/ItemModal.svelte"
  import DocsHeader from '$lib/components/wiki/DocsHeader.svelte';
</script>

<DocsTemplate title='bakery' description="learn how the bakery lets you produce cookies and cakes, boost baking with grandpas, furnaces, and upgrades like cursors and grandmas for more rewards" />

the bakery is a way to produce <ItemModal item="cookie">cookies</ItemModal> and <ItemModal item="cake">cakes</ItemModal>

<DocsHeader header='h2' text="how it works" />

you need a <ItemModal item="furnace">furnace</ItemModal> and 1 <ItemModal item="coal">coal</ItemModal> each time you bake. your furnace wont be used while baking, but coal will be used. if you want to bake, do `/bake`

<DocsHeader header='h2' text="baking cookies" />

cakes have a chance to be baked depending on the amount of grandpas in your bakery. it starts off at 0%, increasing by 0.5% per grandpa, up to a maximum of 25%. any amount of grandpas over 50 does nothing, so it is not recommended using more than that.&#x20;

the percent chance to get cakes continues to run until it fails, so it is possible to get more than 1 cake per bake if you are lucky. if you have a 25% chance of getting a cake, the chance of 1 cake is 1/4, 2 cakes 1/16, 3 cakes 1/64, etc.

<DocsHeader header='h2' text="bakery upgrades" />

you can increase your cookie production with cursors, super cursors, and grandmas

| item                                                    | effect                        |
| ------------------------------------------------------- | ----------------------------- |
| <ItemModal item="cursor">cursor</ItemModal>             | +1 max cookie                 |
| <ItemModal item="super_cursor">super cursor</ItemModal> | +1 min & max cookie           |
| <ItemModal item="grandma">grandma</ItemModal>           | bakes 0.5 cookies each hour   |
| <ItemModal item="grandpa">grandpa</ItemModal>           | +0.5% chance of baking a cake |
| <ItemModal item="oven">oven</ItemModal>                 | +1 hour of afk time           |

with ovens, cookies will build up from grandmas up to the max afk time. this means that with 12 ovens you can store 6 cookies per grandma, maxing out after 12 hours.

cookie production also has chance to be doubled either from [guild upgrades](/wiki/economy/guilds) or certain [gems](/wiki/economy/items/gems)

<DocsHeader header='h3' text="obtaining" />

upgrades can be obtained from [crates](/wiki/economy/items/crates) and [scratch cards](/wiki/economy/items/scratch-cards)
