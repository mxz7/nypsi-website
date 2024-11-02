<script>
  let scanners = 0;
  let radars = 0;
  let stored = 10000;

  const scrapBase = 0.00009
  const shardBase = 0.00003

  const perScanner = 0.00077
  const perRadar = 0.00027
</script>


<div class="bg-base-200" style="margin-left: 15rem; margin-right: 15rem; text-align: center">
    
  <select class="bg-base-200" style="margin-right:50px; margin-top:10px" bind:value={scanners}>
    {#each {length: 11} as _, i}
      {#if scanners === i}
        <option value={i} selected>{i} scanner{i != 1 ? "s" : ""}</option>
      {:else}
        <option value={i}>{i} scanner{i != 1 ? "s" : ""}</option>
      {/if}
    {/each}
  </select>

  <select class="bg-base-200" bind:value={radars}>
    {#each {length: 11} as _, i}
      {#if radars === i}
        <option value={i} selected>{i} radar{i != 1 ? "s" : ""}</option>
      {:else}
        <option value={i}>{i} radar{i != 1 ? "s" : ""}</option>
      {/if}
    {/each}
  </select>

  <br>
  <input class="bg-base-200" style="margin-top:10px" placeholder="stored" bind:value={stored} min=0 maxlength=6>

  {#if stored > 0}
    <br>
    <br>
    <span>Chance for a scrap: {Math.round(Math.min(scrapBase + perScanner * scanners, 0.5) * stored * 10 ** 5)/(10**5)}%</span>
    <br>
    <span>Chance for a shard: {Math.round(Math.min(shardBase + perRadar * radars, 0.1) * stored * 10 ** 5)/(10**5)}%</span>
  {/if}

</div>

<style>
  select {
    width: 7.25rem;
    height: 1.5rem;
    border-width:1px;
    border-radius: 6px;
    border-color: var(--fallback-bc,oklch(var(--bc)/0.2))
  }
  input {
    width: 7.25rem;
    height: 1.5rem;
    border-width:1px;
    border-radius: 6px;
    border-color: var(--fallback-bc,oklch(var(--bc)/0.2))
  }
</style>
