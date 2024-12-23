<script>
  import badges from "$lib/data/badges";
</script>

<svelte:head>
  <title>badges | nypsi</title>
  <meta name="og:title" content="badges | nypsi" />
</svelte:head>

<h1 class="mt-4 text-center text-4xl font-bold text-white">badges</h1>

<div class="mt-10 flex justify-center">
  <div class="lg:max-w-[50vw]">
    {#each Array.from(badges.values()) as badge}
      <div class="mb-12 px-4" id={badge.name}>
        <h2 class="flex flex-row items-center align-middle text-xl text-white">
          <img src={badge.icon} class="mr-3 h-8" alt="" />
          {badge.name}
        </h2>
        <p class="mt-1">{badge.description}</p>
      </div>
    {/each}
  </div>
</div>
