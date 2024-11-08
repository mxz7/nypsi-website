<script lang="ts">
  import { sort } from "fast-sort";

  let { data } = $props();

  const rarityMap = new Map<number, string>();

  rarityMap.set(0, "common");
  rarityMap.set(1, "uncommon");
  rarityMap.set(2, "rare");
  rarityMap.set(3, "very rare");
  rarityMap.set(4, "exotic");
  rarityMap.set(5, "impossible");
  rarityMap.set(6, "literally not possible within your lifetime");
</script>

<svelte:head>
  <title>{data.item.name} / nypsi</title>
</svelte:head>

<div class="w-full rounded-box bg-base-200 p-3">
  <div class="flex w-full gap-3">
    <div class="h-24 w-24 rounded-box bg-base-300 p-4">
      <img
        class="h-full w-full object-contain"
        src={data.item.emoji}
        alt={data.item.id}
        fetchpriority="high"
      />
    </div>
    <div class="flex grow flex-col justify-center">
      <h1 class="text-xl font-bold text-white">{data.item.name}</h1>
      <p>{data.item.role}</p>
    </div>
  </div>

  {#if data.item.shortDesc}
    <div class="mt-2 w-full rounded-box bg-base-300 p-3 text-sm italic">{data.item.shortDesc}</div>
  {/if}

  {#if data.item.longDesc}
    <div class="mt-2 w-full rounded-box bg-base-300 p-3">{data.item.longDesc}</div>
  {/if}

  <div class="mt-2 grid w-full grid-cols-3 gap-3 rounded-box bg-base-300 p-3">
    <div class="w-full text-center text-lg">
      <h2 class="font-semibold text-white">in world</h2>
      {#await data.inWorld}
        <span class="loading loading-spinner loading-sm"></span>
      {:then inWorld}
        <span class="text-sm">{inWorld._sum.amount.toLocaleString()}</span>
      {/await}
    </div>

    <div class="w-full text-center">
      <h2 class="text-lg font-semibold text-white">worth</h2>
      {#await data.value}
        <span class="loading loading-spinner loading-sm"></span>
      {:then value}
        <span class="text-sm">${value.toLocaleString()}</span>
      {/await}
    </div>

    <div class="w-full text-center text-lg">
      <h2 class="font-semibold text-white">rarity</h2>

      <span class="text-sm">{rarityMap.get(data.item.rarity)}</span>
    </div>
  </div>

  {#await data.odds then obtaining}
    {#if Object.values(obtaining.found).length > 0}
      <div class="mt-2 w-full rounded-box bg-base-300 p-3">
        <h3 class="text-center font-semibold text-white">obtaining</h3>
        {#each sort(Object.entries(obtaining.found)).desc((i) => i[1]) as foundEntry}
          {@const item = data.items.find((i) => i.id === foundEntry[0])}
          <div class="flex items-center gap-1">
            {#if item}
              <img src={item.emoji} alt={item.id} decoding="async" loading="lazy" class="w-5" />
              <span>{item.name}</span>
            {:else}
              <span>{foundEntry[0]}</span>
            {/if}
            <span class="ml-2">{foundEntry[1]}</span>
          </div>
        {/each}
      </div>
    {/if}
  {/await}
</div>
