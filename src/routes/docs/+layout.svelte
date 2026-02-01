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
    <main in:fly={{ duration: 400, y: 25 }} class="docs-content">
      {@render children()}
    </main>
  {/key}
</div>

<style>
  @reference "../../app.css";

  :global {
    .docs-content {
      @apply w-full p-4 lg:p-0;

      h1 {
        @apply mb-6 text-3xl font-bold text-white underline-offset-3 lg:text-4xl;
      }

      h2 {
        @apply mb-3 text-2xl font-bold text-white underline-offset-3;
      }

      h3 {
        @apply mb-2 text-xl font-bold text-white underline-offset-3;
      }

      h4 {
        @apply mb-2 text-lg font-semibold text-white underline-offset-3;
      }

      h5 {
        @apply mb-2 text-base font-semibold text-white underline-offset-3;
      }

      p {
        @apply mt-1 mb-2 leading-relaxed;
      }

      pre {
        @apply bg-base-300 overflow-x-auto rounded-lg p-2;
        font-family: ui-monospace, "SF Mono", monospace;
      }

      code {
        @apply bg-base-300 rounded-lg p-1;
        font-family: ui-monospace, "SF Mono", monospace;
      }

      a:not(:is(h1 a, h2 a, h3 a, h4 a, h5 a, h6 a)) {
        @apply link link-primary underline-offset-3;
        text-decoration: underline;
        color: var(--color-primary) /* var(--color-primary) */;
        &:hover {
          color: color-mix(in oklab, var(--color-primary) /* var(--color-primary) */ 80%, #000);
        }
      }

      table {
        @apply table;
      }

      ul,
      ol {
        @apply list-inside;
      }

      ul {
        @apply list-disc;
      }

      ol {
        @apply list-decimal;
      }
    }
  }
</style>
