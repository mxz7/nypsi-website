<script lang="ts">
  import { page } from "$app/state";
  import logo from "$lib/assets/logo.svg";
  import { auth } from "$lib/state.svelte";
  import { Menu } from "@lucide/svelte";
  import MobileScreen from "./MobileNav.svelte";

  let sidebarVisible = $state(false);
</script>

<MobileScreen bind:visible={sidebarVisible} />

<div class="w-full px-3 lg:px-0">
  <nav class="navbar bg-base-200 mx-auto mt-3 rounded-xl lg:max-w-6xl">
    <div class="navbar-start">
      <button
        aria-label="show mobile navigation"
        class="btn btn-ghost lg:hidden"
        onclick={() => (sidebarVisible = !sidebarVisible)}
      >
        <Menu strokeWidth={2.5} />
      </button>

      <div class="hidden items-center text-sm lg:flex">
        <a class="btn btn-ghost" href="/" aria-label="home">
          <img src={logo} class="h-10" alt="" />
        </a>

        <ul class="menu menu-md menu-horizontal flex-nowrap">
          <li><a href="/leaderboards" class="font-semibold">leaderboards</a></li>
          <li><a href="/items" class="font-semibold">items</a></li>
          <li><a href="/events" class="font-semibold">events</a></li>
          <li><a href="/status" class="font-semibold">status</a></li>
          <li><a href="/wiki" class="font-semibold">wiki</a></li>
          <li>
            <a href="/discord" class="font-semibold" target="_blank">discord</a>
          </li>
          <li>
            <a href="https://ko-fi.com/nypsi/tiers" target="_blank">
              <span
                class="bg-linear-to-br from-violet-500 to-purple-500 bg-clip-text font-bold text-transparent"
              >
                premium
              </span>
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div class="grow"></div>

    <div class="w-auto">
      {#if !auth.value}
        <button class="btn btn-ghost" aria-label="loading">
          <span class="loading loading-spinner loading-sm"></span>
        </button>
      {:else if !auth.value.authenticated}
        <a href="/login?next={encodeURIComponent(page.url.pathname)}" class="btn btn-ghost"
          >log in</a
        >
      {:else}
        <a href="/me" class="btn btn-ghost">
          <div class="avatar">
            <div class="h-10 w-10 rounded-full">
              <img src={auth.value.user.avatar} alt="your avatar" decoding="async" />
            </div>
          </div>
        </a>
      {/if}
    </div>
  </nav>
</div>
