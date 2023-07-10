<script lang="ts">
  import { navigating } from "$app/stores";
  import { fade } from "svelte/transition";

  let loadingSize = 0;
  let startedLoading = 0;
  let interval: number | undefined;

  $: if (
    $navigating &&
    !interval //&&
    // $navigating.to?.params?.userId &&
    // $navigating.from?.route.id?.startsWith("/user")
  ) {
    loadingSize = 0;
    startedLoading = Date.now();
    interval = setInterval(() => {
      if (startedLoading < Date.now() - 125) return;
      loadingSize += Math.floor(Math.random() * 10) + 5;
      if (loadingSize > 85) loadingSize = 85;
    }, 75);
  } else if (interval && !$navigating) {
    if (startedLoading < Date.now() - 125) {
      clearInterval(interval);
      interval = undefined;
      startedLoading = 0;
    } else {
      loadingSize = 100;
      setTimeout(() => {
        clearInterval(interval);
        interval = undefined;
        startedLoading = 0;
      }, 100);
    }
  }
</script>

{#if interval}
  <div
    in:fade={{ delay: 150, duration: 50 }}
    out:fade={{ duration: 750 }}
    style="width: {loadingSize}%;"
    class="absolute top-[64px] h-[2px] w-0 rounded bg-red-500 duration-100"
  />
{/if}
