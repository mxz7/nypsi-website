<script>
  import { page } from "$app/stores";
  import { BadgePoundSterling, ChartArea, ChartBar, Coins } from "lucide-svelte";

  let { children } = $props();
</script>

<div class="mx-auto mt-4 flex w-full max-w-6xl gap-8 p-4 lg:p-0">
  <ul class="menu hidden w-72 rounded-box bg-base-200 p-4 lg:block">
    <li><h2 class="font-semibold">dashboard</h2></li>

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

  {@render children()}
</div>
