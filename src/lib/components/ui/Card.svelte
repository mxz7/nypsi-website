<script lang="ts">
  import { twMerge } from "tailwind-merge";

  interface Props {
    children: import("svelte").Snippet;
    class?: string;
    mode?: "section" | "div" | "article" | "anchor" | "li";
    href?: string;
    focused?: boolean;
    style?: string;
  }

  let {
    children,
    class: classes,
    mode = "div",
    href,
    focused = false,
    style = "",
  }: Props = $props();

  const activeClasses = $derived.by(() => {
    const output = [
      "bg-base-200",
      "hover:border-primary/30",
      "w-full",
      "gap-2",
      "rounded-xl",
      "border",
      "p-4",
      "duration-300",
    ];

    if (focused) {
      output.push("border-primary/20 ");
    } else {
      output.push("border-primary/10");
    }

    if (classes) {
      return twMerge(output.join(" "), classes);
    }

    return output.join(" ");
  });
</script>

{#if mode === "section"}
  <section class={activeClasses} {style}>
    {@render children?.()}
  </section>
{:else if mode === "article"}
  <article class={activeClasses} {style}>
    {@render children?.()}
  </article>
{:else if mode === "anchor"}
  <a {href} class={activeClasses} {style}>
    {@render children?.()}
  </a>
{:else if mode === "li"}
  <li class={activeClasses} {style}>
    {@render children()}
  </li>
{:else}
  <div class={activeClasses} {style}>
    {@render children?.()}
  </div>
{/if}
