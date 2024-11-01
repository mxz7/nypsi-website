<script>
  import { page } from "$app/stores";
  import { BadgePoundSterling, ChartArea, Coins } from "lucide-svelte";
  import { onMount } from "svelte";

  let { children, data } = $props();

  onMount(() => {
    console.log(data.paths);
  });
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Fira+Mono:wght@400;500;700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="mx-auto mt-4 flex w-full max-w-6xl gap-8">
  <ul class="menu hidden h-fit w-72 rounded-box bg-base-200 p-4 lg:block">
    <li><h2 class="font-semibold">nypsi docs</h2></li>

    <div class="pl-2">
      <li>
        <a
          class="flex items-center {$page.url.pathname.startsWith('/me/stats')
            ? 'text-primary'
            : ''}"
          href="/me/stats"
        >
          <Coins />
          <span>stats</span>
        </a>
      </li>

      <li>
        <a
          class="flex items-center {$page.url.pathname.startsWith('/me/graphs')
            ? 'text-primary'
            : ''}"
          href="/me/graphs"
        >
          <ChartArea />
          <span>graphs</span>
        </a>
      </li>

      <li>
        <a
          class="flex items-center {$page.url.pathname.startsWith('/me/purchases')
            ? 'text-primary'
            : ''}"
          href="/me/purchases"
        >
          <BadgePoundSterling />
          <span>purchases</span>
        </a>
      </li>
    </div>
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
    @apply rounded-lg bg-base-200 p-2;
    font-family: "Fira Mono", monospace;
  }

  :global(.docs-content code) {
    @apply rounded-lg bg-base-200 p-1;
    font-family: "Fira Mono", monospace;
  }
</style>
