<script lang="ts">
  import type { Snippet } from "svelte";
  import { twMerge } from "tailwind-merge";

  interface Props {
    children: Snippet;
    class?: string;
  }

  let { children, class: userClasses }: Props = $props();

  const activeClasses = $derived(
    twMerge("max-w-6xl w-full mx-auto px-3 lg:px-0 mt-8", userClasses),
  );
</script>

<main class={activeClasses}>
  {@render children()}
</main>
