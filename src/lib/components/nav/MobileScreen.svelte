<script lang="ts">
  import { page } from "$app/stores";
  import { auth } from "$lib/state.svelte";
  import { BadgePoundSterling, ChartArea, Coins, X } from "lucide-svelte";
  import { fade, fly } from "svelte/transition";

  let { visible = $bindable(false) } = $props();
</script>

{#if visible}
  <div
    in:fly={{ x: -200, duration: 250 }}
    out:fly={{ x: -200, duration: 250 }}
    class="fixed left-0 top-0 z-20 h-full w-[70%] rounded-box bg-base-200 bg-opacity-95 p-2 shadow-xl shadow-base-300"
  >
    <button class="btn btn-ghost" onclick={() => (visible = !visible)}>
      <X strokeWidth={2.5} />
    </button>

    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <ul class="menu font-medium" onclick={() => (visible = !visible)}>
      <li><a href="/" class={$page.url.pathname === "/" ? "text-primary" : ""}>home</a></li>
      <li>
        <a
          href="/leaderboard"
          class={$page.url.pathname.startsWith("/leaderboard") ? "text-primary" : ""}
          >leaderboards</a
        >
      </li>
      <li>
        <a href="/status" class={$page.url.pathname.startsWith("/status") ? "text-primary" : ""}
          >status</a
        >
      </li>
      <li><a href="/docs">docs</a></li>
      <li><a href="/discord" target="_blank">discord</a></li>

      {#if auth.value?.authenticated}
        <li class="mt-1">
          <h2 class={$page.url.pathname.startsWith("/me") ? "text-primary" : ""}>dashboard</h2>
        </li>
        <div class="pl-2">
          <li>
            <a
              class="flex items-center {$page.url.pathname.startsWith('/me/stats')
                ? 'text-primary'
                : ''}"
              href="/me/stats"
            >
              <Coins size={16} />
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
              <ChartArea size={16} />
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
              <BadgePoundSterling size={16} />
              <span>purchases</span>
            </a>
          </li>
        </div>
      {/if}
    </ul>
  </div>

  <!-- svelte-ignore a11y_click_events_have_key_events  -->
  <!-- svelte-ignore a11y_interactive_supports_focus -->
  <div
    in:fade={{ duration: 250 }}
    out:fade={{ duration: 250 }}
    class="fixed left-0 top-0 z-10 h-full w-full backdrop-blur-sm"
    role="button"
    onclick={() => (visible = !visible)}
  ></div>
{/if}
