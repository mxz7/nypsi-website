<script lang="ts">
  import { onNavigate } from "$app/navigation";
  import { cubicOut } from "svelte/easing";
  import { Tween } from "svelte/motion";

  const width = new Tween(0, { easing: cubicOut });
  const opacity = new Tween(0, { duration: 0 });
  let currentNavigation: number | null = null;

  onNavigate(async (nav) => {
    if (nav.from.url.toString() === nav.to.url.toString()) return;
    if (
      nav.from.url.pathname.startsWith("/leaderboards") &&
      nav.to.url.pathname.startsWith("/leaderboards")
    )
      return;

    const id = Math.random();
    currentNavigation = id;

    let showTimeout: ReturnType<typeof setTimeout> | null = null;
    let shown = false;

    width.set(0, { duration: 0 });

    showTimeout = setTimeout(() => {
      shown = true;
      opacity.set(1, { duration: 0 });
      width.set(75, { duration: 4000 });
    }, 100); // only show if nav takes longer than 100ms

    return () => {
      if (currentNavigation !== id) return;

      clearTimeout(showTimeout);

      if (!shown) {
        // navigation completed before the bar appeared, do nothing
        currentNavigation = null;
        return;
      }

      width.set(100, { duration: 750 }).then(() => {
        if (currentNavigation !== id) return;
        opacity.set(0, { duration: 300 }).then(() => {
          if (currentNavigation !== id) return;
          width.set(0, { duration: 0 });
          currentNavigation = null;
        });
      });
    };
  });
</script>

<div
  class="bg-primary pointer-events-none fixed top-0 h-0.5 rounded-lg"
  style="width: {width.current}%; opacity: {opacity.current}"
></div>
