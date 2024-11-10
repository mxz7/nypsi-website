<script>
  import DocsTemplate from "$lib/components/docs/DocsTemplate.svelte"
  import ItemModal from "$lib/components/docs/ItemModal.svelte"
  import CrateOdds from "./crate-odds.svelte"
  import { onMount } from "svelte";
  import { page } from '$app/stores';
  
  let selected = $state("vote/basic/69420");

  const tabs = ["vote/basic/69420", "boosters", "workers", "mineshaft chest", "nypsi", "omega", "gem"];

  onMount(() => {
    if (tabs.includes($page.url.searchParams.get('crate'))) selected = $page.url.searchParams.get('crate');
  })

</script>

<DocsTemplate title='crates' />

## how do i get a crate?

you can easily obtain <ItemModal item="vote_crate">vote crates</ItemModal> by voting for nypsi with `$vote`. you can also get crates from tasks, daily rewards, fishing, loot drops, [premium](/docs/premium) rewards every friday night / saturday morning or the [online shop](https://ko-fi.com/tekoh/shop).

## what do i get from crates?

you can get random items such as collectables and cars, but most notably being tools such as fishing rods, guns, pickaxes, other crates, boosters or scratch cards.

## how do i open my crates?

you can use the `$use <name of crate> <amount>` command to open specific number of a specific crate.

## crate odds

<div class="mb-2" >
  <ul class="menu menu-horizontal rounded-box bg-base-300 text-xs lg:text-sm">
    {#each tabs as tab}
      <li>
        <button class={selected === tab ? "focus" : ""} on:click={() => selected = tab}>{tab}</button>
      </li>
    {/each}
  </ul>
</div>

{#if selected === "vote/basic/69420"}
<CrateOdds crate="basic_crate" />
{:else if selected === "boosters"}
<CrateOdds crate="boosters_crate" />
{:else if selected === "workers"}
<CrateOdds crate="workers_crate" />
{:else if selected === "mineshaft chest"}
<CrateOdds crate="mineshaft_chest" />
{:else if selected === "nypsi"}
<CrateOdds crate="nypsi_crate" />
{:else if selected === "omega"}
<CrateOdds crate="omega_crate" />
{:else if selected === "gem"}
<CrateOdds crate="gem_crate" />
{/if}
