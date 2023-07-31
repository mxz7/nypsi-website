<script lang="ts">
  import { ArrowLeft, ArrowRight } from "lucide-svelte";

  export let data: string[];
  export let title: string;
  let currentPage = "1";

  const pages = new Map<number, string[]>();

  for (const item of data) {
    if (pages.size === 0) pages.set(1, [item]);
    else if (pages.get(pages.size).length >= 15) pages.set(pages.size + 1, [item]);
    else pages.set(pages.size, [...pages.get(pages.size), item]);
  }
</script>

<div
  class="p-4 duration-300 hover:border-accent hover:border-opacity-20 hover:bg-opacity-40 rounded border border-gray-300 border-opacity-5 bg-gray-950 bg-opacity-25"
>
  <h1 class="text-xl font-bold mb-4 text-center">{title}</h1>
  <div class="flex-col flex gap-1">
    {#each pages.get(parseInt(currentPage)) || [] as item}
      {@html item}
    {/each}
  </div>
  <div class="flex justify-center mt-3 gap-8">
    <button
      on:click={() => {
        if (!pages.get(parseInt(currentPage) - 1)) return;
        currentPage = (parseInt(currentPage) - 1).toString();
      }}
    >
      <ArrowLeft color="#8b5cf6" size="32px" />
    </button>

    <input
      type="text"
      class="w-4 text-center text-accent border-none bg-transparent focus:border-none focus:outline-none"
      bind:value={currentPage}
    />

    <button
      on:click={() => {
        if (!pages.get(parseInt(currentPage) + 1)) return;
        currentPage = (parseInt(currentPage) + 1).toString();
      }}
    >
      <ArrowRight size="32px" color="#8b5cf6" />
    </button>
  </div>
</div>
