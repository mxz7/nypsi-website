<script lang="ts">
  import { Loader2 } from "lucide-svelte";
  import { fade, type FadeParams } from "svelte/transition";

  export let size = 56;
  export let fadeOutSettings: FadeParams = { duration: 150 };
  export let fadeInSettings: FadeParams = { duration: 50 };
</script>

<div
  class="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2"
  in:fade|global={fadeInSettings}
  out:fade|global={fadeOutSettings}
>
  <div class="flex items-center justify-center">
    <div class="animate-spin">
      <Loader2 size="{size}px" strokeWidth="2.5px" color="#8b5cf6" />
    </div>
  </div>
</div>
