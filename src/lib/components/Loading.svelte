<script lang="ts">
  import { fade, type FadeParams } from "svelte/transition";

  interface Props {
    fadeOutSettings?: FadeParams;
    fadeInSettings?: FadeParams;
  }

  let { fadeOutSettings = { duration: 0 }, fadeInSettings = { duration: 0 } }: Props = $props();
</script>

<div
  class="flex w-full justify-center"
  in:fade|global={fadeInSettings}
  out:fade|global={fadeOutSettings}
>
  <span class="loading loading-spinner loading-lg text-primary"></span>
</div>
