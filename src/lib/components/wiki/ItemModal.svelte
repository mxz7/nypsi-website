<script lang="ts">
  import { goto, preloadData, pushState } from "$app/navigation";
  import { page } from "$app/state";
  import type { Snippet } from "svelte";
  import { cubicOut } from "svelte/easing";
  import { fade, fly } from "svelte/transition";
  import ItemPage from "../../../routes/items/(item)/[itemId]/+page.svelte";

  type Props = { children: Snippet; item: string; trailing?: "" };

  let { children, item, trailing }: Props = $props();

  let showThis = $state(false);
</script>

<span style="display: inline-flex; align-items: baseline;">
  <a
    href="/items/{item}"
    class="link link-primary"
    onclick={async (e) => {
      if (
        innerWidth < 640 || // bail if the screen is too small
        e.shiftKey || // or the link is opened in a new window
        e.metaKey ||
        e.ctrlKey // or a new tab (mac: metaKey, win/linux: ctrlKey)
      )
        return;

      e.preventDefault();

      showThis = true;

      const href = `/items/${item}`;

      const result = await preloadData(href);

      if (result.type === "loaded" && result.status === 200) {
        const data = {
          items: $state.snapshot(await result.data.items),
          item: $state.snapshot(await result.data.item),
          odds: await result.data.odds,
          inWorld: await result.data.inWorld,
          value: await result.data.value,
        };

        const docsItemModal = {};

        docsItemModal[item] = data;

        pushState(href, { docsItemModal });
      } else {
        goto(href);
      }
    }}>{@render children()}</a
  >
  {#if trailing}
    <span style="all: unset;">{trailing}</span>
  {/if}
</span>

{#if page.state.docsItemModal && page.state.docsItemModal[item] && showThis}
  <div
    in:fly={{ duration: 250, y: 20, easing: cubicOut }}
    out:fly={{ duration: 250, y: 20, easing: cubicOut }}
    class="fixed top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 transform"
  >
    <div
      class="rounded-box border-primary/25 bg-base-200 hover:border-primary/40 border p-0 shadow-lg duration-100"
    >
      <ItemPage data={page.state.docsItemModal[item] as unknown as any} />
    </div>
  </div>

  <button
    in:fade={{ duration: 250 }}
    out:fade={{ duration: 250 }}
    class="fixed top-0 left-0 z-10 h-full w-full cursor-default backdrop-blur-xs"
    aria-label="close modal"
    onclick={() => {
      history.back();
      showThis = false;
    }}
  ></button>
{/if}
