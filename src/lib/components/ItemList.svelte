<script lang="ts">
  import ItemIcon from "./ItemIcon.svelte";

  export let items: { id: string; name: string; emoji: string; aliases: string[]; role: string }[];
  let searchTerm = "";

  $: filteredItems = items.filter((i) => {
    if (searchTerm.length == 0) return true;
    if (i.name.includes(searchTerm.toLowerCase())) return true;
    if (i.id.includes(searchTerm.toLowerCase())) return true;
    if (i.role.includes(searchTerm.toLowerCase())) return true;
    if (i.aliases)
      for (const alias of i.aliases) {
        if (alias.includes(searchTerm.toLowerCase())) return true;
      }
  });
</script>

<div class="mt-10 w-full p-4 sm:px-48">
  <form class="m-2 p-3 flex flex-row bg-gray-950 bg-opacity-50 w-fit rounded-md">
    <div class="flex justify-center items-center mr-1">
      <img src="/search.png" alt="" class="w-4 h-4" />
    </div>
    <input
      class="ml-2 bg-transparent border-none focus:border-none focus:outline-none text-gray-400 placeholder:text-gray-400"
      type="search"
      name="search"
      placeholder="search"
      bind:value={searchTerm}
    />
  </form>

  <div class="flex flex-row flex-wrap">
    {#each filteredItems as item}
      <ItemIcon {item} />
    {/each}
  </div>
</div>
