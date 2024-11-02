<script lang="ts">
  import { onMount } from "svelte";

  let { type }: { type: string } = $props();

  let chances: number[] = $state([]);

  onMount(async () => {
    const omegaCrate = (
      await fetch(
        "https://raw.githubusercontent.com/mxz7/nypsi-odds/main/out/omega_crate.txt",
      ).then((response) => response.text())
    ).split("\n");

    const found = omegaCrate.find((line) => line.includes(type));
    chances.push(!found ? 0 : parseFloat(found.split(" ")[1].split("%")[0]));

    const gemCrate = (
      await fetch("https://raw.githubusercontent.com/mxz7/nypsi-odds/main/out/gem_crate.txt").then(
        (response) => response.text(),
      )
    ).split("\n");
    chances.push(
      parseFloat(
        gemCrate
          .find((line) => line.includes(type))
          .split(" ")[1]
          .split("%")[0],
      ),
    );
  });
</script>

<div class="container">
  {#if chances.length === 0}
    <span class="loading loading-spinner"></span>
  {:else}
    {#if chances[0] > 0}
      <p>{chances[0]}% chance to obtain from an omega crate</p>
    {/if}
    <p>{chances[1]}% chance to obtain from a gem crate</p>
  {/if}
</div>
