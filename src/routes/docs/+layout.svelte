<script lang="ts">
  import { page } from "$app/stores";
  import type { PathsData } from "$lib/data/docs";
  import { paths } from "$lib/data/docs";

  console.log(paths);

  let { children } = $props();
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Fira+Mono:wght@400;500;700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
    rel="stylesheet"
  />
</svelte:head>

{#snippet renderPath(path: { name: string; path: string; children?: PathsData })}
  <li>
    {#if path.children}
      <details open={$page.url.pathname.startsWith(path.path)}>
        <summary class={$page.url.pathname.startsWith(path.path) ? "text-primary" : ""}
          >{path.name}</summary
        >
        <ul>
          {#each Object.values(path.children) as child}
            {@render renderPath(child)}
          {/each}
        </ul>
      </details>
    {:else}
      <a class={path.path === $page.url.pathname ? "text-primary" : ""} href={path.path}>
        {path.name}
      </a>
    {/if}
  </li>
{/snippet}

<div class="mx-auto mt-4 flex w-full max-w-6xl gap-8">
  <ul class="menu hidden h-fit w-72 rounded-box bg-base-200 p-4 lg:block">
    <li><h2 class="menu-title">nypsi docs</h2></li>

    {#each paths as path}
      {@render renderPath(path)}
    {/each}
  </ul>
  <div class="docs-content w-full p-4 lg:p-0">
    {@render children()}
  </div>
</div>

<style>
  :global(.docs-content h1) {
    @apply mb-6 text-4xl font-bold text-white;
    font-family: "Poppins", sans-serif;
  }

  :global(.docs-content h2) {
    @apply my-4 text-2xl font-bold text-white;
    font-family: "Poppins", sans-serif;
  }

  :global(.docs-content h3) {
    @apply my-2 text-2xl font-semibold text-white;
    font-family: "Poppins", sans-serif;
  }

  :global(.docs-content p) {
    @apply my-4;
  }

  :global(.docs-content pre) {
    @apply rounded-lg bg-base-300 p-2;
    font-family: "Fira Mono", monospace;
  }

  :global(.docs-content code) {
    @apply rounded-lg bg-base-300 p-1;
    font-family: "Fira Mono", monospace;
  }

  :global(.docs-content a) {
    @apply link;
  }
</style>
