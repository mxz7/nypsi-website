<script lang="ts">
  import { fade, type FadeParams } from "svelte/transition";

  export let size = 10;
  export let fadeOutSettings: FadeParams = { duration: 150 };
  export let fadeInSettings: FadeParams = { duration: 0 };
</script>

<div
  class="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2"
  in:fade={fadeInSettings}
  out:fade={fadeOutSettings}
>
  <div class="flex items-center justify-center">
    <svg
      class="-ml-1 mr-3 h-{size} w-{size} animate-spin text-accent"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  </div>
</div>
