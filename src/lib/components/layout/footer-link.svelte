<script lang="ts">
  import type { HTMLAnchorAttributes } from "svelte/elements";
  import { twMerge } from "tailwind-merge";

  let { children, ...props }: HTMLAnchorAttributes = $props();

  let classes = $derived(
    twMerge(
      "fill-base-content link-hover flex items-center gap-1 text-xs duration-300",
      props.class?.toString() || "",
    ),
  );
</script>

<a {...props} class={classes}>
  {@render children()}
</a>
