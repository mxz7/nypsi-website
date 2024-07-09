<script lang="ts">
  import { page } from "$app/stores";
  import logo from "$lib/assets/nypsi-transparent.webp?as=run:0";
  import { auth } from "$lib/functions/auth";
  import Img from "@zerodevx/svelte-img";
  import { AlignLeft } from "lucide-svelte";
</script>

<div class="flex w-full justify-center">
  <div class="navbar bg-base-200 lg:mt-3 lg:max-w-6xl lg:rounded-xl">
    <div class="navbar-start">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
          <AlignLeft strokeWidth={2.5} />
        </div>
        <ul
          tabindex="0"
          class="menu dropdown-content menu-sm z-[1] mt-3 w-52 gap-3 rounded-box bg-base-200 p-2 shadow"
        >
          <li><a href="/" class="text-xl">home</a></li>
          <li><a href="/leaderboard" class="text-xl">leaderboards</a></li>
          <li><a href="/status" class="text-xl">status</a></li>
          <li><a href="/discord" target="_blank" class="text-xl">discord</a></li>
          <li><a href="https://docs.nypsi.xyz/" target="_blank" class="text-xl">docs</a></li>
          <li>
            <a href="https://ko-fi.com/tekoh/tiers" target="_blank" class="text-xl">
              <span
                class="bg-gradient-to-br from-violet-500 to-purple-500 bg-clip-text font-semibold text-transparent"
                >premium</span
              >
            </a>
          </li>
        </ul>
      </div>
      <div class="hidden items-center text-sm lg:flex">
        <a class="btn btn-ghost" href="/">
          <Img src={logo} class="h-10 w-10" />
        </a>
        <a href="/leaderboard" class="btn btn-ghost">leaderboards</a>
        <a href="/status" class="btn btn-ghost">status</a>
        <a href="/discord" class="btn btn-ghost" target="_blank">discord</a>
        <a href="https://docs.nypsi.xyz" target="_blank" class="btn btn-ghost">docs</a>
        <a href="https://ko-fi.com/tekoh/tiers" target="_blank" class="btn btn-ghost">
          <span
            class="bg-gradient-to-br from-violet-500 to-purple-500 bg-clip-text text-transparent"
          >
            premium
          </span>
        </a>
      </div>
    </div>

    <div class="grow" />

    <div class="w-auto">
      {#if !$auth}
        <button class="btn btn-ghost">
          <span class="loading loading-spinner"></span>
        </button>
      {:else if !$auth.authenticated}
        <a href="/login?next={encodeURIComponent($page.url.pathname)}" class="btn btn-ghost"
          >log in</a
        >
      {:else}
        <a href="/me" class="btn btn-ghost">
          <div class="avatar">
            <div class=" h-10 w-10 rounded-full">
              <img src={$auth.user.avatar} alt="your avatar" loading="lazy" />
            </div>
          </div>
        </a>
      {/if}
    </div>
  </div>
</div>
