<script lang="ts">
  import { goto, preloadData, pushState } from "$app/navigation";
  import { page } from "$app/stores";
  import type { Snippet } from "svelte";
  import { fade } from "svelte/transition";
  import ItemPage from "../../../routes/item/(item)/[itemId]/+page.svelte";

  let { children, item }: { children: Snippet; item: string } = $props();
</script>

<a
  href="/item/{item}"
  class="link"
  onclick={async (e) => {
    if (
      innerWidth < 640 || // bail if the screen is too small
      e.shiftKey || // or the link is opened in a new window
      e.metaKey ||
      e.ctrlKey // or a new tab (mac: metaKey, win/linux: ctrlKey)
    )
      return;

    e.preventDefault();

    const href = `/item/${item}`;

    const result = await preloadData(href);

    if (result.type === "loaded" && result.status === 200) {
      const data = {
        items: result.data.items,
        item: result.data.item,
        odds: await result.data.odds,
        inWorld: await result.data.inWorld,
        value: await result.data.value,
      };
      pushState(href, { docsItemModal: data });
    } else {
      goto(href);
    }
  }}>{@render children()}</a
>

{#if $page.state.docsItemModal}
  <div
    in:fade={{ duration: 100 }}
    out:fade={{ duration: 100 }}
    class="fixed left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 transform"
  >
    <div class="rounded-box shadow">
      <ItemPage data={$page.state.docsItemModal as unknown as any} />
    </div>
  </div>

  <button
    in:fade={{ duration: 100 }}
    out:fade={{ duration: 100 }}
    class="fixed left-0 top-0 z-10 h-full w-full cursor-default backdrop-blur-sm"
    aria-label="close modal"
    onclick={() => {
      history.back();
    }}
  ></button>
{/if}
