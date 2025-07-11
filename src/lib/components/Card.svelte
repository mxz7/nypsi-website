<script lang="ts">
  interface Props {
    children: import("svelte").Snippet;
    class?: string;
    mode?: "main" | "section" | "div" | "article" | "anchor";
    href?: string;
  }

  let { children, class: classes, mode = "div", href }: Props = $props();

  const activeClasses = $derived.by(() => {
    const output = [
      "bg-base-200",
      "hover:border-primary/30",
      "w-full",
      "gap-2",
      "rounded-lg",
      "border",
      "p-4",
      "duration-300",
    ];

    if (mode === "main") {
      output.push("border-primary/15 ");
    } else {
      output.push("border-primary/5");
    }

    if (classes) {
      output.push(...classes.split(" "));
    }

    return output.join(" ");
  });
</script>

{#if mode === "main"}
  <main class={activeClasses}>
    {@render children?.()}
  </main>
{:else if mode === "section"}
  <section class={activeClasses}>
    {@render children?.()}
  </section>
{:else if mode === "article"}
  <article class={activeClasses}>
    {@render children?.()}
  </article>
{:else if mode === "anchor"}
  <a {href} class={activeClasses}>
    {@render children?.()}
  </a>
{:else}
  <div class={activeClasses}>
    {@render children?.()}
  </div>
{/if}
