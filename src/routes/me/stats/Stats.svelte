<script lang="ts">
  import { ArrowLeft, ArrowRight } from "lucide-svelte";

  interface Props {
    data: string[];
    title: string;
  }

  let { data, title }: Props = $props();
  let currentPage = $state("1");

  const pages = new Map<number, string[]>();

  for (const item of data) {
    if (pages.size === 0) pages.set(1, [item]);
    else if (pages.get(pages.size).length >= 15) pages.set(pages.size + 1, [item]);
    else pages.set(pages.size, [...pages.get(pages.size), item]);
  }
</script>

<div
  class="rounded-lg border border-primary border-opacity-5 bg-base-200 p-4 duration-300 hover:border-opacity-20"
>
  <h1 class="mb-4 text-center text-xl font-bold">{title}</h1>
  <div class="flex flex-col gap-1">
    {#each pages.get(parseInt(currentPage)) || [] as item}
      {@html item}
    {/each}
  </div>
  <div class="mt-3 flex justify-center gap-8">
    <button
      onclick={() => {
        if (!pages.get(parseInt(currentPage) - 1)) return;
        currentPage = (parseInt(currentPage) - 1).toString();
      }}
    >
      <ArrowLeft class="text-primary" size="32px" />
    </button>

    <input
      type="text"
      class="w-4 border-none bg-transparent text-center text-primary focus:border-none focus:outline-none"
      bind:value={currentPage}
    />

    <button
      onclick={() => {
        if (!pages.get(parseInt(currentPage) + 1)) return;
        currentPage = (parseInt(currentPage) + 1).toString();
      }}
    >
      <ArrowRight size="32px" class="text-primary" />
    </button>
  </div>
</div>
