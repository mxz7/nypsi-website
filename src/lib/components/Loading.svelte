<script lang="ts">
  import { fade, type FadeParams } from "svelte/transition";

  export let fadeOutSettings: FadeParams = { duration: 0 };
  export let fadeInSettings: FadeParams = { duration: 0 };
</script>

<div
  class="flex w-full justify-center"
  in:fade|global={fadeInSettings}
  out:fade|global={fadeOutSettings}
>
  <span class="loading loading-spinner loading-lg text-primary" />
</div>
