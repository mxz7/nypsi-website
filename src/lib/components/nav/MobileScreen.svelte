<script lang="ts">
  import { X } from "lucide-svelte";
  import { fly } from "svelte/transition";

  let { visible = $bindable(false) } = $props();
</script>

{#if visible}
  <div
    in:fly={{ x: -200, duration: 250 }}
    out:fly={{ x: -200, duration: 250 }}
    class="fixed left-0 top-0 z-20 h-full w-[70%] rounded-box bg-base-200 p-2 shadow-xl shadow-base-300"
  >
    <button class="btn btn-ghost" onclick={() => (visible = !visible)}>
      <X strokeWidth={2.5} />
    </button>

    <ul class="menu font-medium" onclick={() => (visible = !visible)}>
      <li><a href="/">home</a></li>
      <li><a href="/leaderboard">leaderboards</a></li>
      <li><a href="/status">status</a></li>
      <li><a href="/discord" target="_blank">discord</a></li>
      <li><a href="https://docs.nypsi.xyz" target="_blank">docs</a></li>
    </ul>
  </div>

  <div
    class="fixed left-0 top-0 z-10 h-full w-full"
    role="button"
    onclick={() => (visible = !visible)}
  />
{/if}
