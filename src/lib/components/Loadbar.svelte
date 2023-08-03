<script lang="ts">
  import { navigating } from "$app/stores";
  import { cubicInOut } from "svelte/easing";
  import { tweened } from "svelte/motion";
  import { fade } from "svelte/transition";

  const progress = tweened(0, { easing: cubicInOut });

  let status: "loading" | "inactive" = "inactive";
  let finished = false;
  let started = 0;

  navigating.subscribe((value) => {
    if (value) {
      progress.set(0, { duration: 0 });
      status = "loading";
      finished = false;
      started = Date.now();

      setTimeout(() => {
        if (status === "inactive") return;
        progress.set(40, { duration: 1000 });
        setTimeout(() => {
          if (!finished && status === "loading") progress.set(80, { duration: 10000 });
        }, 1000);
      }, 250);
    } else {
      if (started < Date.now() - 250) {
        finished = true;
        progress.set(100, { duration: 250 });

        setTimeout(() => {
          status = "inactive";
          finished = false;
          started = 0;
          progress.set(0);
        }, 250);
      } else {
        status = "inactive";
        started = 0;
        progress.set(0);
      }
    }
  });
</script>

{#if status === "loading" && $progress > 0}
  <div
    in:fade={{ delay: 50, duration: 100 }}
    out:fade={{ duration: 750 }}
    style="width: {$progress}%;"
    class="absolute top-[64px] h-[2px] w-0 rounded bg-accent duration-100"
  />
{/if}
