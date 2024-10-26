<script>
  import { navigating, page } from "$app/stores";
  import { cubicOut } from "svelte/easing";
  import { tweened } from "svelte/motion";
  import { fade } from "svelte/transition";

  // progress bar value
  const p = tweened(0, {
    duration: 200,
    easing: cubicOut,
  });

  let isVisible = $state(false);

  function increase() {
    if ($p >= 0 && $p < 0.2) {
      p.update((_) => _ + 0.04);
    } else if ($p >= 0.2 && $p < 0.5) {
      p.update((_) => _ + 0.02);
    } else if ($p >= 0.5 && $p < 0.8) {
      p.update((_) => _ + 0.002);
    } else if ($p >= 0.8 && $p < 0.99) {
      p.update((_) => _ + 0.0005);
    } else {
      p.set(0);
    }

    if ($navigating) {
      const rand = Math.round(Math.random() * (300 - 50)) + 50;
      setTimeout(function () {
        increase();
      }, rand);
    }
  }

  navigating.subscribe((value) => {
    if (value) {
      if (value.to.url.pathname !== $page.url.pathname) {
        increase();
        isVisible = true;
      }
    }
    if (!value) {
      p.update((_) => _ + 0.3);
      setTimeout(function () {
        p.set(1);
        setTimeout(function () {
          isVisible = false;
          p.set(0);
        }, 100);
      }, 100);
    }
  });
</script>

<div class="sticky top-0 h-[2px] w-full overflow-hidden">
  {#if $p > 0 && $p < 1 && isVisible}
    <div
      in:fade={{ duration: 300 }}
      out:fade={{ duration: 300, delay: 250 }}
      style="width: {$p * 115}%;"
      class="top-0 h-[2px] rounded-lg bg-primary duration-100"
    ></div>
  {/if}
</div>
