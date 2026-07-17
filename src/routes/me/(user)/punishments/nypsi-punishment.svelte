<script lang="ts">
  import { MStoTime } from "$lib/functions/time";
  import { onDestroy, onMount } from "svelte";

  type Props = {
    type: string;
    reason: string;
    expires?: Date;
  };

  let { type, reason, expires }: Props = $props();

  let now = $state(Date.now());
  let expiresIn = $derived(expires ? expires.getTime() - now : 0);
  let interval: ReturnType<typeof setInterval> | undefined;

  const label = $derived(type.replaceAll("_", " ").toLowerCase());

  onMount(() => {
    if (!expires) return;

    interval = setInterval(() => {
      now = Date.now();
    }, 1000);
  });

  onDestroy(() => {
    if (interval) clearInterval(interval);
  });
</script>

<article class="bg-base-200 flex flex-col gap-2 rounded-lg p-4">
  <header class="flex items-center justify-between gap-2">
    <h3 class="text-lg font-bold text-white">{label}</h3>
    <span class="badge badge-soft badge-error">active</span>
  </header>

  <p class="text-base-content/75 text-sm">{reason}</p>

  {#if expires}
    <p class="text-sm">
      expires on <span class="font-medium">{expires.toLocaleDateString()}</span> at
      <span class="font-medium">{expires.toLocaleTimeString()}</span>
      <span class="text-base-content/75 block text-xs"
        >in <span class="font-medium">{MStoTime(expiresIn)}</span></span
      >
    </p>
  {:else}
    <p class="text-base-content/75 text-sm">this punishment does not expire.</p>
  {/if}
</article>
