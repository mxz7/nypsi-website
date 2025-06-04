<script lang="ts">
  import { beforeNavigate, onNavigate } from "$app/navigation";
  import { cubicOut } from "svelte/easing";
  import { Tween } from "svelte/motion";
  import { fade } from "svelte/transition";

  const width = new Tween(0, { easing: cubicOut });
  let visible = $state(false);
  let timeout: ReturnType<typeof setTimeout>;

  beforeNavigate(() => {
    width.set(0, { duration: 0 });
    visible = false;

    timeout = setTimeout(() => {
      visible = true;
      width.set(75, { duration: 7500 });
    }, 500);
  });

  onNavigate(() => {
    return () => {
      clearInterval(timeout);

      if (width.current > 0 && visible) {
        width.set(100, { duration: 750 });
        setTimeout(() => {
          visible = false;
          setTimeout(() => {
            width.set(0, { duration: 0 });
          }, 900);
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
