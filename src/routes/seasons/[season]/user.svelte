<script lang="ts">
  import parseEmoji from "$lib/functions/parseEmoji";
  import { getTags } from "$lib/functions/tags";
  import type { BaseUserData } from "$lib/types/User";
  import { onMount } from "svelte";

  let { user, pos }: { user: { id?: string; username: string }; pos: number } = $props();

  let tag: string = $state();

  onMount(async () => {
    if (!user.id) return;
    const res = await fetch(`/api/user/${user.id}/base`);

    if (res.ok) {
      const data: BaseUserData = await res.json();

      if (data.Tags[0]?.tagId) {
        const tags = await getTags();

        tag = tags[data.Tags[0].tagId].emoji;
      }
    }
  });
</script>

{#if user.id}
  {#if tag}
    <span>[</span>
    <img class="h-5 sm:h-6" src={parseEmoji(tag)} alt="" decoding="async" />
    <span class="mr-1">]</span>
  {/if}
  <a
    class="{pos === 1
      ? 'font-semibold text-primary'
      : 'text-slate-300'} min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap"
    href="/user/{user?.id || user.username}"
  >
    {user.username}
  </a>
{:else}
  <a
    href="/user/{user.username}"
    class="{pos === 1
      ? 'font-semibold text-primary'
      : 'text-slate-300'} min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap"
  >
    {user.username}
  </a>
{/if}
