<script lang="ts">
  import { parse } from "$lib/functions/twemoji";

  export let outcome: string;

  const oneStr = outcome.split("**choice**")[1].split("**")[0].trim();
  const twoStr = outcome.split("**landed**")[1].trim();

  const one = parse(oneStr || "", {
    assetType: "png",
  });
  const two = parse(twoStr || "", { assetType: "png" });
</script>

<div class="flex w-full items-center justify-center text-center text-slate-200 opacity-50">
  <p class="mr-16">player</p>
  <p class="ml-16">nypsi</p>
</div>
<div class="flex w-full items-center justify-center">
  <img src={one} alt="" class="h-14 w-14" />
  <p class="mx-3 text-5xl text-slate-200">-</p>
  <img src={two} alt="" class="h-14 w-14" />
</div>
