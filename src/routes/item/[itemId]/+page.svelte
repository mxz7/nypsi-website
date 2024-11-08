<script lang="ts">
  let { data } = $props();
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
    <div class="flex flex-col justify-center">
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
    <div class="w-full text-center">
      <h2 class="font-semibold text-white">in world</h2>
      {#await data.inWorld}
        <span class="loading loading-spinner loading-sm"></span>
      {:then inWorld}
        <span>{inWorld._sum.amount.toLocaleString()}</span>
      {/await}
    </div>
  </div>
</div>
