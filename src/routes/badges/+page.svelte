<script>
  import badges from "$lib/data/badges";
</script>

<h1 class="mt-4 text-center text-4xl font-bold text-white">badges</h1>

<div class="mt-10 flex justify-center text-white">
  <div class="lg:max-w-[50vw]">
    {#each Array.from(badges.values()) as badge}
      <div class="mb-12 px-4" id={badge.name}>
        <h1 class="flex flex-row items-center align-middle text-xl">
          <img src={badge.icon} class="mr-3 h-8" alt="" />
          {badge.name}
        </h1>
        <div class="mx-4 my-2 h-[3px] rounded-lg bg-gray-950 bg-opacity-50" />
        <p>{badge.description}</p>
      </div>
    {/each}
  </div>
</div>
