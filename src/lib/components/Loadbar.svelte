<script lang="ts">
  import { navigating } from "$app/stores";
  import { cubicOut } from "svelte/easing";
  import { tweened } from "svelte/motion";
  import { fade } from "svelte/transition";

  const progress = tweened(0, { easing: cubicOut });

  let status: "loading" | "inactive" = "inactive";
  let started = 0;

  navigating.subscribe((value) => {
    if (value) {
      progress.set(0, { duration: 0 });
      status = "loading";

      started = Date.now();

      setTimeout(() => {
        if (status === "inactive") return;
        progress.set(65, { duration: 4000 });
      }, 250);
    } else {
      if (started < Date.now() - 250) {
        progress.set(100, { duration: 250 });

        setTimeout(() => {
          status = "inactive";

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
