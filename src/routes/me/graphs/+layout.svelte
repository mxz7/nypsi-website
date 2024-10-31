<script lang="ts">
  import { page } from "$app/stores";

  let { data, children } = $props();
</script>

<svelte:head>
  <title>graphs / nypsi</title>
</svelte:head>

{#if data.premium}
  <div class="flex w-full justify-center">
    <ul class="menu menu-horizontal rounded-box bg-base-200 text-sm lg:text-base">
      <li>
        <a
          class={$page.url.pathname.startsWith("/me/graphs/balance") ? "focus" : ""}
          href="/me/graphs/balance{$page.url.searchParams.toString()
            ? `?${$page.url.searchParams.toString()}`
            : ''}">balance</a
        >
      </li>
      <li>
        <a
          class={$page.url.pathname.startsWith("/me/graphs/net") ? "focus" : ""}
          href="/me/graphs/net{$page.url.searchParams.toString()
            ? `?${$page.url.searchParams.toString()}`
            : ''}">net worth</a
        >
      </li>
      <li>
        <a
          class={$page.url.pathname.startsWith("/me/graphs/level") ? "focus" : ""}
          href="/me/graphs/level{$page.url.searchParams.toString()
            ? `?${$page.url.searchParams.toString()}`
            : ''}">level</a
        >
      </li>
      <li>
        <a
          class={$page.url.pathname.startsWith("/me/graphs/karma") ? "focus" : ""}
          href="/me/graphs/karma{$page.url.searchParams.toString()
            ? `?${$page.url.searchParams.toString()}`
            : ''}">karma</a
        >
      </li>
      <li>
        <a
          class={$page.url.pathname.startsWith("/me/graphs/items") ? "focus" : ""}
          href="/me/graphs/items">items</a
        >
      </li>
    </ul>
  </div>
{:else}
  <p class="text-lg font-medium text-error">
    you must have <a href="https://ko-fi.com/tekoh" target="_blank" class="link">premium</a> to view
    your graphs
  </p>
{/if}

{@render children()}
