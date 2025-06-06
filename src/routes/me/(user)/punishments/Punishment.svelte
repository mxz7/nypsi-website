<script lang="ts">
  import { MStoTime } from "$lib/functions/time";
  import { onDestroy, onMount } from "svelte";

  interface Props {
    name: string;
    icon?: string;
    expires: Date;
  }

  let { name, icon, expires }: Props = $props();

  let expiresIn = $state(expires.getTime() - new Date().getTime());
  let timeout: ReturnType<typeof setTimeout>;

  onMount(() => {
    timeout = setInterval(() => {
      expiresIn = expires.getTime() - new Date().getTime();
    }, 1000);
  });

  onDestroy(() => {
    clearInterval(timeout);
  });
</script>

<article class="bg-base-200 flex gap-1 rounded-lg p-4">
  {#if icon}
    <img src={icon} alt="" class="h-20 w-20 rounded-lg" />
  {/if}

  <div class="ml-2 flex flex-col">
    <h3 class="text-lg font-bold text-white">{name}</h3>
    <span
      >expires on <span class="font-medium">{expires.toLocaleDateString()}</span> at
      <span class="font-medium">{expires.toLocaleTimeString()}</span></span
    >
    <span class="text-base-content/75 text-sm"
      >in <span class="font-medium">{MStoTime(expiresIn)}</span></span
    >
  </div>
</article>
