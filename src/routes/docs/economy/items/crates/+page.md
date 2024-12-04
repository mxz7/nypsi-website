<script>
  import DocsTemplate from "$lib/components/docs/DocsTemplate.svelte"
  import ItemModal from "$lib/components/docs/ItemModal.svelte"
  import CrateOdds from "./crate-odds.svelte"
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { page } from '$app/stores';
  import DocsHeader from '$lib/components/docs/DocsHeader.svelte';
  
  let selected = $state("basic");

  const tabs = [
    {id: "basic", name: "vote/basic/69420"},
    {id: "boosters", name: "boosters"},
    {id: "workers", name: "workers"},
    {id: "mineshaft", name: "mineshaft chest"},
    {id: "nypsi", name: "nypsi"},
    {id: "omega", name: "omega"},
    {id: "gem", name: "gem"},
  ];

  onMount(() => {
    if (tabs.find((i) => i.id == $page.url.searchParams.get('crate'))) {
      selected = $page.url.searchParams.get('crate');
    }
  })

</script>

<DocsTemplate title='crates' />

<DocsHeader header='h2' text="how do i ge ta crate?" />

you can easily obtain <ItemModal item="vote_crate">vote crates</ItemModal> by voting for nypsi with `$vote`. you can also get crates from tasks, daily rewards, fishing, loot drops, [premium](/docs/premium) rewards every friday night / saturday morning or the [online shop](https://ko-fi.com/tekoh/shop).

<DocsHeader header='h2' text="what do i get from crates?" />

you can get random items such as collectables and cars, but most notably being tools such as fishing rods, guns, pickaxes, other crates, boosters or scratch cards.

<DocsHeader header='h2' text="how do i open my crates?" />

you can use the `$use <name of crate> <amount>` command to open specific number of a specific crate.

<DocsHeader header='h2' text="crate odds" />

<div class="mb-2" >
  <ul class="menu menu-horizontal rounded-box bg-base-300 text-xs lg:text-sm">
    {#each tabs as tab}
      <li>
        <button class={selected === tab.id ? "focus" : ""} onclick={() => {
          selected = tab.id;
          goto(`?crate=${tab.id}`);
          }}>{tab.name}</button>
      </li>
    {/each}
  </ul>
</div>

{#if selected === "basic"}
<CrateOdds crate="basic_crate" />
{:else if selected === "boosters"}
<CrateOdds crate="boosters_crate" />
{:else if selected === "workers"}
<CrateOdds crate="workers_crate" />
{:else if selected === "mineshaft"}
<CrateOdds crate="mineshaft_chest" />
{:else if selected === "nypsi"}
<CrateOdds crate="nypsi_crate" />
{:else if selected === "omega"}
<CrateOdds crate="omega_crate" />
{:else if selected === "gem"}
<CrateOdds crate="gem_crate" />
{/if}
