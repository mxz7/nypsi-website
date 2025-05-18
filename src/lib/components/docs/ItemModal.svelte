<script lang="ts">
  import { goto, preloadData, pushState } from "$app/navigation";
  import { page } from "$app/stores";
  import type { Snippet } from "svelte";
  import { cubicOut } from "svelte/easing";
  import { fade, fly } from "svelte/transition";
  import ItemPage from "../../../routes/item/(item)/[itemId]/+page.svelte";

  type Props = { children: Snippet; item: string };

  let { children, item }: Props = $props();
</script>

<a
  href="/item/{item}"
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

    const href = `/item/${item}`;

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

{#if $page.state.docsItemModal && $page.state.docsItemModal[item]}
  <div
    in:fly={{ duration: 250, y: 20, easing: cubicOut }}
    out:fly={{ duration: 250, y: 20, easing: cubicOut }}
    class="fixed top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 transform"
  >
    <div
      class="rounded-box border-primary/25 bg-base-200 hover:border-primary/40 border p-2 shadow-lg duration-100"
    >
      <ItemPage data={$page.state.docsItemModal[item] as unknown as any} />
    </div>
  </div>

  <button
    in:fade={{ duration: 250 }}
    out:fade={{ duration: 250 }}
    class="fixed top-0 left-0 z-10 h-full w-full cursor-default backdrop-blur-xs"
    aria-label="close modal"
    onclick={() => {
      history.back();
    }}
  ></button>
{/if}
