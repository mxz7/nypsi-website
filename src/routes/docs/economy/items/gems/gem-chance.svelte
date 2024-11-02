<script lang="ts">
  import { browser } from "$app/environment";

  export let type: string;

  async function getCrateChances() {
    const chances: number[] = [];
    
    const omegaCrate = (await fetch("https://raw.githubusercontent.com/mxz7/nypsi-odds/main/out/omega_crate.txt").then(response => response.text())).split("\n");
    
    const found = (omegaCrate.find((line) => line.includes(type)));
    chances.push(!found ? 0 : parseFloat((found.split(" ")[1]).split("%")[0]));

    const gemCrate = (await fetch("https://raw.githubusercontent.com/mxz7/nypsi-odds/main/out/gem_crate.txt").then(response => response.text())).split("\n");
    chances.push(parseFloat(gemCrate.find((line) => line.includes(type)).split(" ")[1].split("%")[0]));

    return chances;
  }

</script>

<div class="container">
  {#if browser}
    {#await getCrateChances()}
      <p>loading...</p>
    {:then chance}
      {#if chance[0] > 0}
        <p>{chance[0]}% chance to obtain from an omega crate</p>
      {/if}
        <p>{chance[1]}% chance to obtain from a gem crate</p>
    {/await}
  {/if}
</div>
