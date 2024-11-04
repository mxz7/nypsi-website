<script lang="ts">
  let scanners = $state(0);
  let radars = $state(0);
  let stored: number | undefined = $state(0);

  $effect(() => {
    console.log(isNaN(stored));
    if (stored && isNaN(stored)) stored = 0;
  });

  const scrapBase = 0.00009;
  const shardBase = 0.00003;

  const perScanner = 0.00077;
  const perRadar = 0.00027;

  let scrapChance = $derived(
    Math.min(50, Math.round(Math.min(scrapBase + perScanner * scanners, 0.5) * stored * 10 ** 5) / 10 ** 5),
  );
  let shardChance = $derived(
    Math.min(10, Math.round(Math.min(shardBase + perRadar * radars, 0.1) * stored * 10 ** 5) / 10 ** 5),
  );
</script>

<h2>quarry calculator</h2>

<div class="w-64">
  <div class="flex w-full gap-2">
    <select class="input input-bordered grow" bind:value={scanners}>
      {#each { length: 11 } as _, i}
        {#if scanners === i}
          <option value={i} selected>{i} scanner{i != 1 ? "s" : ""}</option>
        {:else}
          <option value={i}>{i} scanner{i != 1 ? "s" : ""}</option>
        {/if}
      {/each}
    </select>

    <select class="input input-bordered grow" bind:value={radars}>
      {#each { length: 11 } as _, i}
        {#if radars === i}
          <option value={i} selected>{i} radar{i != 1 ? "s" : ""}</option>
        {:else}
          <option value={i}>{i} radar{i != 1 ? "s" : ""}</option>
        {/if}
      {/each}
    </select>
  </div>

  <label class="input input-bordered mt-2 flex w-full items-center gap-2">
    stored
    <input type="text" class="grow" placeholder="stored" maxlength="6" bind:value={stored} />
  </label>
</div>

<br />
<br />
<span>Chance for a scrap: {scrapChance || 0}%</span>
<br />
<span>Chance for a shard: {shardChance || 0}%</span>
