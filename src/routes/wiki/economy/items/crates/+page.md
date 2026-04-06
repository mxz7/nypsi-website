<script>
  import DocsTemplate from "$lib/components/wiki/DocsTemplate.svelte"
  import ItemModal from "$lib/components/wiki/ItemModal.svelte"
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { page } from '$app/stores';
  import DocsHeader from '$lib/components/wiki/DocsHeader.svelte';
  
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

<DocsTemplate title='crates' description="learn how to get and open nypsi crates, discover all possible crate items, and see detailed odds for basic, boosters, mineshaft, gem, omega crates." />

<DocsHeader header='h2' text="obtaining" />

you can easily obtain <ItemModal item="vote_crate">vote crates</ItemModal> by voting for nypsi with `$vote`. you can also get crates from tasks, daily rewards, fishing, loot drops, [premium](/wiki/premium) rewards every friday night / saturday morning or the [online shop](https://ko-fi.com/nypsi/shop).

<DocsHeader header='h2' text="items you can get from crates" />

you can get random items such as collectables and cars, but most notably being tools such as fishing rods, guns, pickaxes, other crates, boosters or scratch cards.

<DocsHeader header='h2' text="opening your crates" />

you can use the `$use <name of crate> <amount>` command to open specific number of a specific crate.
