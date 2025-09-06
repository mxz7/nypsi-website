<script lang="ts">
  import { page } from "$app/state";
  import type { PathsData } from "$lib/data/docs";
  import { paths } from "$lib/data/docs";
  import { fly } from "svelte/transition";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="canonical" href="https://nypsi.xyz{page.url.pathname}" />
</svelte:head>

{#snippet renderPath(path: { name: string; path: string; children?: PathsData })}
  <li>
    {#if path.children}
      <details open={page.url.pathname.startsWith(path.path)}>
        <summary class={page.url.pathname.startsWith(path.path) ? "text-primary" : ""}
          >{path.name.replaceAll("-", " ")}</summary
        >
        <ul>
          {#each Object.values(path.children) as child}
            {@render renderPath(child)}
          {/each}
        </ul>
      </details>
    {:else}
      <a
        data-sveltekit-preload-code="eager"
        class={path.path === page.url.pathname ? "text-primary" : ""}
        href={path.path}
      >
        {path.name.replaceAll("-", " ")}
      </a>
    {/if}
  </li>
{/snippet}

<div class="mx-auto mt-4 flex w-full max-w-6xl gap-8">
  <nav class="hidden lg:block">
    <ul class="menu rounded-box bg-base-200 h-fit w-72 p-4">
      <li><h2 class="menu-title">nypsi docs</h2></li>

      {#each paths.filter((p) => !p.path.includes("privacy") && !p.path.includes("terms")) as path}
        {@render renderPath(path)}
      {/each}
    </ul>
  </nav>
  {#key page.url.pathname}
    <main in:fly={{ duration: 400, y: 25 }} class="docs-content w-full p-4 lg:p-0">
      {@render children()}
    </main>
  {/key}
</div>

<style>
  @reference "../../app.css";

  :global(.docs-content h1) {
    @apply mb-6 text-3xl font-bold text-white underline-offset-3 lg:text-4xl;
  }

  :global(.docs-content h2) {
    @apply mt-8 mb-3 text-2xl font-bold text-white underline-offset-3;
  }

  :global(.docs-content h3) {
    @apply mt-3 mb-1 text-xl font-bold text-white underline-offset-3;
  }

  :global(.docs-content h4) {
    @apply mt-2 mb-1 text-lg font-semibold text-white underline-offset-3;
  }

  :global(.docs-content h5) {
    @apply mt-2 mb-1 text-base font-semibold text-white underline-offset-3;
  }

  :global(.docs-content p) {
    @apply mt-1 mb-2 leading-relaxed;
  }

  :global(.docs-content pre) {
    @apply bg-base-300 overflow-x-auto rounded-lg p-2;
    font-family: ui-monospace, "SF Mono", monospace;
  }

  :global(.docs-content code) {
    @apply bg-base-300 rounded-lg p-1;
    font-family: ui-monospace, "SF Mono", monospace;
  }

  :global(.docs-content p a, .docs-content li a) {
    @apply link link-primary underline-offset-3;
  }

  :global(.docs-content table) {
    @apply table;
  }

  :global(.docs-content ul) {
    @apply list-inside list-disc;
  }

  :global(.docs-content ol) {
    @apply list-inside list-decimal;
  }
</style>
