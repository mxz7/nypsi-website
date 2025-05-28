<script lang="ts">
  import { beforeNavigate, onNavigate } from "$app/navigation";
  import { cubicOut } from "svelte/easing";
  import { Tween } from "svelte/motion";
  import { fade } from "svelte/transition";

  const width = new Tween(0, { easing: cubicOut });
  let visible = $state(false);
  let timeout: number;

  beforeNavigate(() => {
    width.set(0, { duration: 0 });
    visible = false;
    // console.log("before navigate");

    timeout = setTimeout(() => {
      // console.log("timeout ran");
      visible = true;
      width.set(75, { duration: 7500 });
    }, 1000);
  });

  onNavigate(() => {
    // console.log("navigating");

    return () => {
      // console.log("timeout cancelled");
      clearInterval(timeout);

      if (width.current > 0 && visible) {
        width.set(100, { duration: 1000 });
        setTimeout(() => {
          visible = false;
          setTimeout(() => {
            width.set(0, { duration: 0 });
          }, 1000);
        }, 1200);
      }
    };
  });
</script>

{#if visible}
  <div
    out:fade={{ duration: 500 }}
    class="bg-primary fixed top-0 h-[2px] rounded-lg"
    style="width: {width.current}%"
  ></div>
{/if}
