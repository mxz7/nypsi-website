<script lang="ts">
  import { page } from "$app/state";

  let { data, children } = $props();
</script>

<svelte:head>
  <title>graphs | nypsi</title>
</svelte:head>

{#if data.premium}
  <div class="flex w-full justify-center">
    <ul class="menu menu-horizontal rounded-box bg-base-200 text-xs lg:text-sm">
      <li>
        <a
          class={page.url.pathname.startsWith("/me/graphs/balance") ? "menu-active" : ""}
          href="/me/graphs/balance{page.url.searchParams.toString()
            ? `?${page.url.searchParams.toString()}`
            : ''}">balance</a
        >
      </li>
      <li>
        <a
          class={page.url.pathname.startsWith("/me/graphs/net") ? "menu-active" : ""}
          href="/me/graphs/net{page.url.searchParams.toString()
            ? `?${page.url.searchParams.toString()}`
            : ''}">net worth</a
        >
      </li>
      <li>
        <a
          class={page.url.pathname.startsWith("/me/graphs/level") ? "menu-active" : ""}
          href="/me/graphs/level{page.url.searchParams.toString()
            ? `?${page.url.searchParams.toString()}`
            : ''}">level</a
        >
      </li>
      <li>
        <a
          class={page.url.pathname.startsWith("/me/graphs/karma") ? "menu-active" : ""}
          href="/me/graphs/karma{page.url.searchParams.toString()
            ? `?${page.url.searchParams.toString()}`
            : ''}">karma</a
        >
      </li>
      <li>
        <a
          class={page.url.pathname.startsWith("/me/graphs/items") ? "menu-active" : ""}
          href="/me/graphs/items">items</a
        >
      </li>
    </ul>
  </div>
{:else}
  <p class="text-error text-lg font-medium">
    you must have <a href="https://ko-fi.com/nypsi" target="_blank" class="link">premium</a> to view
    your graphs
  </p>
{/if}

{@render children()}
