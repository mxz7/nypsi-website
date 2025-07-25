<script lang="ts">
  import tooltip from "$lib/Tooltips.js";
  import { ChartArea, Crown } from "@lucide/svelte";
  import { sort } from "fast-sort";
  import { fade } from "svelte/transition";

  let { data } = $props();

  const rarityMap = new Map<number, string>();

  rarityMap.set(0, "common");
  rarityMap.set(1, "uncommon");
  rarityMap.set(2, "rare");
  rarityMap.set(3, "very rare");
  rarityMap.set(4, "exotic");
  rarityMap.set(5, "impossible");
  rarityMap.set(6, "more impossible");
  rarityMap.set(7, "even more impossible");

  function formatName(itemId: string) {
    let [id, value] = itemId.split(":");

    if (value) {
      value = Number(value).toLocaleString();

      if (id === "money") return `$${value}`;
      if (id === "xp") return `${value} xp`;
      if (id === "karma") return `${value} karma`;
    }

    return itemId;
  }
</script>

<svelte:head>
  <title>{data.item.name} | nypsi</title>
  <meta name="og:title" content="{data.item.name} | nypsi" />

  <meta name="description" content={data.item.longDesc} />
  <meta name="og:description" content={data.item.longDesc} />

  <meta name="og:image" content={data.item.emoji} />
  <meta property="og:image:width" content="128" />
  <meta property="og:image:height" content="128" />

  <link rel="canonical" href="https://nypsi.xyz/items/{data.item.id}" />
</svelte:head>

<div class="rounded-box bg-base-200 w-full p-3 sm:sticky sm:top-4">
  <div class="flex w-full gap-3">
    <div class="rounded-box bg-base-300 h-24 w-24 p-4">
      <img
        class="h-full w-full object-contain"
        src={data.item.emoji}
        alt=""
        decoding="sync"
        loading="eager"
      />
    </div>
    <div class="flex grow flex-col justify-center">
      <h1 class="text-xl font-bold text-white">{data.item.name}</h1>
      <p>{data.item.role}</p>
    </div>
  </div>

  {#if data.item.shortDesc}
    <div class="rounded-box bg-base-300 mt-2 w-full p-3 text-sm italic">{data.item.shortDesc}</div>
  {/if}

  {#if data.item.longDesc}
    <div class="rounded-box bg-base-300 mt-2 w-full p-3">{data.item.longDesc}</div>
  {/if}

  <div class="rounded-box bg-base-300 mt-2 grid w-full grid-cols-3 gap-3 p-3">
    <div class="w-full text-center">
      <h2 class="text-lg font-semibold text-white">in world</h2>
      {#await data.inWorld}
        <span class="loading loading-spinner loading-xs" in:fade={{ delay: 100, duration: 100 }}
        ></span>
      {:then inWorld}
        <span class="text-sm">{(inWorld || 0).toLocaleString()}</span>
      {/await}
    </div>

    <div class="w-full text-center">
      <h2 class="text-lg font-semibold text-white">worth</h2>
      {#await data.value}
        <span class="loading loading-spinner loading-xs" in:fade={{ delay: 100, duration: 100 }}
        ></span>
      {:then value}
        {#if value}
          <span class="text-sm">${value.toLocaleString()}</span>
        {:else}
          <a href="/docs/economy/items/worth#unvalued" class="link">unvalued</a>
        {/if}
      {/await}
    </div>

    <div class="w-full text-center">
      <h2 class="text-lg font-semibold text-white">rarity</h2>

      <span class="text-sm">{rarityMap.get(data.item.rarity)}</span>
    </div>
  </div>

  <div class="mt-2 flex w-full gap-3">
    <a href="/leaderboards/{data.item.id}" class="btn text-primary grow" title="leaderboard">
      <Crown />
    </a>
    <a href="/items/history/{data.item.id}" class="btn text-primary grow" title="history">
      <ChartArea />
    </a>
  </div>

  {#await data.odds then odds}
    {#if Object.values(odds.found).length > 0}
      <div class="rounded-box bg-base-300 mt-2 w-full p-3">
        <h3
          class="link text-center font-medium text-white"
          use:tooltip={{ content: "(crates and scratch cards)" }}
        >
          obtaining
        </h3>
        <div class="max-h-48 overflow-auto">
          {#each sort(Object.entries(odds.found)).desc( (i) => parseFloat(i[1].substring(0, i[1].length - 1)), ) as foundEntry}
            {@const item = data.items.find((i) => i.id === foundEntry[0])}
            <div class="flex items-center gap-1">
              {#if item}
                <img src={item.emoji} alt="" decoding="async" loading="lazy" class="w-5" />
                {#if item.role === "scratch-card"}
                  <a href="/docs/economy/items/scratch-cards" class="link">{item.name}</a>
                {:else}
                  <a href="/items/{item.id}" class="link-hover">{item.name}</a>
                {/if}
              {:else}
                <span>{foundEntry[0]}</span>
              {/if}
              <span class="grow text-right">{foundEntry[1]}</span>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    {#if odds.crate_open}
      <div class="rounded-box bg-base-300 mt-2 p-3">
        <h3 class="text-center font-medium text-white">items</h3>
        <div class="max-h-48 overflow-auto">
          <div>
            {#each odds.crate_open as { itemId, chance }}
              {@const item = data.items.find((i) => i.id === itemId)}
              <div class="flex items-center gap-1">
                <div class="h-5 w-5">
                  <img
                    src={(item
                      ? item
                      : data.items.find(
                          (i) =>
                            i.id ==
                            (itemId.startsWith("xp")
                              ? "double_xp"
                              : itemId.startsWith("money")
                                ? "highroller"
                                : "karma_tag"),
                        )
                    ).emoji}
                    alt=""
                    decoding="async"
                    loading="lazy"
                    class="h-full w-full object-contain"
                  />
                </div>
                <a href="/items/{itemId}" class="link-hover"
                  >{item ? item.name : formatName(itemId)}</a
                >
                <span class="grow text-right">{chance}</span>
              </div>
            {/each}
          </div>
        </div>
      </div>
    {/if}
  {/await}

  {#if data.item.craft}
    <div class="rounded-box bg-base-300 mt-2 p-3">
      <h3 class="text-center font-medium text-white">recipe</h3>
      <div class="max-h-48 overflow-auto">
        <div>
          {#each data.item.craft.ingredients as ingredient}
            {@const [itemId, amount] = ingredient.split(":")}
            {@const item = data.items.find((i) => i.id === itemId)}
            <div class="flex items-center gap-1">
              <div class="h-5 w-5">
                <img
                  src={item.emoji}
                  alt=""
                  decoding="async"
                  loading="lazy"
                  class="h-full w-full object-contain"
                />
              </div>
              <a class="link-hover" href="/items/{itemId}"
                >{item ? item.name : formatName(itemId)}</a
              >
              <span class="grow text-right">x{amount}</span>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}

  {#if data.items.find((i) => i.craft && i.craft.ingredients.find( (j) => j.startsWith(data.item.id), ))}
    <div class="rounded-box bg-base-300 mt-2 p-3">
      <h3 class="text-center font-medium text-white">used in recipe</h3>
      <div class="grid max-h-48 grid-cols-2 overflow-auto">
        {#each data.items.filter((i) => i.craft && i.craft.ingredients.find( (j) => j.startsWith(data.item.id), )) as item}
          <div class="flex items-center gap-1">
            <div class="h-5 w-5">
              <img
                src={item.emoji}
                alt=""
                decoding="async"
                loading="lazy"
                class="h-full w-full object-contain"
              />
            </div>
            <a class="link-hover" href="/items/{item.id}"
              >{item ? item.name : formatName(item.id)}</a
            >
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
