<script lang="ts">
  import { page } from "$app/stores";
  import { auth } from "$lib/state.svelte";
  import { Menu } from "lucide-svelte";
  import MobileScreen from "./MobileScreen.svelte";

  let sidebarVisible = $state(false);
</script>

<MobileScreen bind:visible={sidebarVisible} />

<div class="flex w-full justify-center">
  <div class="navbar bg-base-200 lg:mt-3 lg:max-w-6xl lg:rounded-xl">
    <div class="navbar-start">
      <button class="btn btn-ghost lg:hidden" onclick={() => (sidebarVisible = !sidebarVisible)}>
        <Menu strokeWidth={2.5} />
      </button>

      <div class="hidden items-center text-sm lg:flex">
        <a class="btn btn-ghost" href="/" aria-label="home">
          <picture>
            <source
              srcset="https://cdn.nypsi.xyz/static/nypsi-transparent.avif"
              type="image/avif"
            />
            <img
              src="https://cdn.nypsi.xyz/static/nypsi-transparent.webp"
              alt="nypsi logo"
              decoding="async"
              class="h-10 w-10"
            />
          </picture>
        </a>

        <a
          href="/leaderboard"
          data-sveltekit-preload-code="viewport"
          class="btn btn-ghost font-semibold">leaderboards</a
        >
        <a
          href="/item/dave"
          data-sveltekit-preload-code="viewport"
          class="btn btn-ghost font-semibold">items</a
        >
        <a href="/status" data-sveltekit-preload-code="viewport" class="btn btn-ghost font-semibold"
          >status</a
        >
        <a href="/docs/faq" class="btn btn-ghost font-semibold">docs</a>
        <a href="/discord" class="btn btn-ghost font-semibold" target="_blank">discord</a>
        <a href="https://ko-fi.com/tekoh/tiers" target="_blank" class="btn btn-ghost py-0">
          <span
            class="bg-gradient-to-br from-violet-500 to-purple-500 bg-clip-text py-1 font-bold text-transparent"
          >
            premium
          </span>
        </a>
      </div>
    </div>

    <div class="grow"></div>

    <div class="w-auto">
      {#if !auth.value}
        <button class="btn btn-ghost" aria-label="loading">
          <span class="loading loading-spinner"></span>
        </button>
      {:else if !auth.value.authenticated}
        <a href="/login?next={encodeURIComponent($page.url.pathname)}" class="btn btn-ghost"
          >log in</a
        >
      {:else}
        <a href="/me" class="btn btn-ghost">
          <div class="avatar">
            <div class="h-10 w-10 rounded-full">
              <img
                src={auth.value.user.avatar}
                alt="your avatar"
                decoding="async"
                fetchpriority="high"
              />
            </div>
          </div>
        </a>
      {/if}
    </div>
  </div>
</div>
