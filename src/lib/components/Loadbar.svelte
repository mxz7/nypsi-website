<script lang="ts">
  import { navigating } from "$app/stores";
  import { cubicOut } from "svelte/easing";
  import { tweened } from "svelte/motion";
  import { fade } from "svelte/transition";

  const progress = tweened(0, { easing: cubicOut });

  let status: "loading" | "inactive" | "finishing" = "inactive";
  let started = 0;

  navigating.subscribe((value) => {
    if (value) {
      progress.set(0, { duration: 0 });
      status = "loading";
      started = Date.now();
      progress.set(60, { delay: 250, duration: 4500 });
    } else {
      if (status === "inactive") return;
      if (started > Date.now() - 200) {
        status = "inactive";
        progress.set(0);
        return;
      }
      status = "finishing";
      progress.set(100, { duration: 250 }).then(() => {
        status = "inactive";
        progress.set(0);
      });
    }
  });
</script>

<div class="sticky top-0 h-[2px] w-full">
  {#if ["loading", "finishing"].includes(status)}
    <div
      in:fade={{ delay: 250, duration: 50 }}
      out:fade={{ duration: 750 }}
      style="width: {$progress}%;"
      class="top-0 h-[2px] rounded bg-accent duration-100"
    />
  {/if}
</div>
