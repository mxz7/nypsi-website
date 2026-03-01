<script lang="ts">
  import Card from "$lib/components/ui/Card.svelte";
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

<Card class="rounded-box bg-base-200 w-full p-3 sm:sticky sm:top-4">
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

  <dl class="rounded-box bg-base-300 mt-2 grid w-full grid-cols-3 gap-3 p-3">
    <div class="w-full text-center">
      <dt class="text-lg font-semibold text-white">in world</dt>
      {#await data.inWorld}
        <dd class="loading loading-spinner loading-xs" in:fade={{ delay: 100, duration: 100 }}></dd>
      {:then inWorld}
        <dd class="text-sm">{(inWorld || 0).toLocaleString()}</dd>
      {/await}
    </div>

    <div class="w-full text-center">
      <dt class="text-lg font-semibold text-white">worth</dt>
      {#await data.value}
        <dd class="loading loading-spinner loading-xs" in:fade={{ delay: 100, duration: 100 }}></dd>
      {:then value}
        {#if value}
          <dd class="text-sm">${value.toLocaleString()}</dd>
        {:else}
          <dd>
            <a href="/wiki/economy/items/worth#unvalued" class="link">unvalued</a>
          </dd>
        {/if}
      {/await}
    </div>

    <div class="w-full text-center">
      <dt class="text-lg font-semibold text-white">rarity</dt>

      <dd class="text-sm">{rarityMap.get(data.item.rarity)}</dd>
    </div>
  </dl>

  <div class="mt-2 flex w-full gap-3">
    <a href="/leaderboards/{data.item.id}" class="btn text-primary grow" title="leaderboard">
      <Crown />
    </a>
    <a href="/items/{data.item.id}/history" class="btn text-primary grow" title="history">
      <ChartArea />
    </a>
  </div>

  {#await data.odds then odds}
    {#if Object.values(odds.found).length > 0}
      <section class="rounded-box bg-base-300 mt-2 w-full p-3">
        <h3
          class="link text-center font-medium text-white"
          use:tooltip={{ content: "(crates and scratch cards)" }}
        >
          obtaining
        </h3>
        <ol class="max-h-48 overflow-auto">
          {#each sort(Object.entries(odds.found)).desc( (i) => parseFloat(i[1].substring(0, i[1].length - 1)), ) as foundEntry}
            {@const item = data.items.find((i) => i.id === foundEntry[0])}
            <li class="flex items-center gap-1">
              {#if item}
                <img src={item.emoji} alt="" decoding="async" loading="lazy" class="w-5" />
                {#if item.role === "scratch-card"}
                  <a href="/wiki/economy/items/scratch-cards" class="link my-0.5 text-sm"
                    >{item.name}</a
                  >
                {:else}
                  <a href="/items/{item.id}" class="link-hover my-0.5 text-sm">{item.name}</a>
                {/if}
              {:else}
                {@const isStore = foundEntry[0].includes("nypsi store")}
                {#if isStore}
                  <a
                    class="text-primary hover:text-primary/75 font-medium underline-offset-2"
                    href="https://ko-fi.com/nypsi/shop"
                    target="_blank">{foundEntry[0]}!!</a
                  >
                {:else}
                  <span class="my-0.5 text-sm">{foundEntry[0]}</span>
                {/if}
              {/if}
              {#if foundEntry[1]}
                <span class="grow text-right font-mono text-sm">{foundEntry[1]}</span>
              {/if}
            </li>
          {/each}
        </ol>
      </section>
    {/if}

    {#if odds.crate_open}
      <section class="rounded-box bg-base-300 mt-2 p-3">
        <h3 class="text-center font-medium text-white">items</h3>
        <div class="max-h-48 overflow-auto">
          <ol>
            {#each odds.crate_open as { itemId, chance }}
              {@const item = data.items.find((i) => i.id === itemId)}
              <li class="flex items-center gap-1">
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
                <a href="/items/{itemId}" class="link-hover my-0.5 text-sm"
                  >{item ? item.name : formatName(itemId)}</a
                >
                <span class="grow text-right font-mono text-sm">{chance}</span>
              </li>
            {/each}
          </ol>
        </div>
      </section>
    {/if}
  {/await}

  {#if data.item.craft}
    <section class="rounded-box bg-base-300 mt-2 p-3">
      <h3 class="text-center font-medium text-white">recipe</h3>
      <div class="max-h-48 overflow-auto">
        <ul>
          {#each data.item.craft.ingredients as ingredient}
            {@const [itemId, amount] = ingredient.split(":")}
            {@const item = data.items.find((i) => i.id === itemId)}
            <li class="flex items-center gap-1">
              <div class="h-5 w-5">
                <img
                  src={item.emoji}
                  alt=""
                  decoding="async"
                  loading="lazy"
                  class="h-full w-full object-contain"
                />
              </div>
              <a class="link-hover my-0.5 text-sm" href="/items/{itemId}"
                >{item ? item.name : formatName(itemId)}</a
              >
              <span class="grow text-right font-mono text-sm">x{amount}</span>
            </li>
          {/each}
        </ul>
      </div>
    </section>
  {/if}

  {#if data.items.find((i) => i.craft && i.craft.ingredients.find( (j) => j.startsWith(data.item.id), ))}
    <section class="rounded-box bg-base-300 mt-2 p-3">
      <h3 class="text-center font-medium text-white">used in recipe</h3>
      <ul class="grid max-h-48 grid-cols-2 overflow-auto">
        {#each data.items.filter((i) => i.craft && i.craft.ingredients.find( (j) => j.startsWith(data.item.id), )) as item}
          <li class="flex items-center gap-1">
            <div class="h-5 w-5">
              <img
                src={item.emoji}
                alt=""
                decoding="async"
                loading="lazy"
                class="h-full w-full object-contain"
              />
            </div>
            <a class="link-hover my-0.5 text-sm" href="/items/{item.id}"
              >{item ? item.name : formatName(item.id)}</a
            >
          </li>
        {/each}
      </ul>
    </section>
  {/if}
</Card>
