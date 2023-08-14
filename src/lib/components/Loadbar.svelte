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
      progress.set(65, { delay: 250, duration: 5000 });
    } else {
      if (started > Date.now() - 200) {
        status = "inactive";
        progress.set(0);
        return;
      }
      progress.set(100, { duration: 250 }).then(() => {
        status = "inactive";
        progress.set(0);
      });
    }
  });
</script>

{#if ["loading"].includes(status)}
  <div
    in:fade={{ delay: 250, duration: 50 }}
    out:fade={{ duration: 750 }}
    style="width: {$progress}%;"
    class="sticky top-0 h-[2px] w-full rounded bg-accent duration-100"
  />
{/if}
