<script lang="ts">
  import { page } from "$app/stores";
  import nypsiLogo from "$lib/assets/nypsi-transparent.webp?as=run:0";
  import { auth } from "$lib/data/stores";
  import Img from "@zerodevx/svelte-img";
  import { Loader2 } from "lucide-svelte";
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";

  $: dropDownVisible = false;
  let authed = "loading";

  function handleMenuOpen() {
    if (dropDownVisible) return handleMenuClose();
    dropDownVisible = true;
    document.body.removeEventListener("click", handleMenuClose);
    setTimeout(() => {
      document.body.addEventListener("click", handleMenuClose);
    }, 50);
  }

  function handleMenuClose() {
    dropDownVisible = false;
    document.body.removeEventListener("click", handleMenuClose);
  }

  onMount(async () => {
    console.log($auth);
    if (!$auth) {
      $auth = await fetch("/api/auth").then((r) => r.json());
    }

    if ($auth.authenticated) {
      authed = $auth.user.avatar;
    } else {
      authed = "no";
    }
  });
</script>

<nav class="sticky z-30 h-16 w-full shadow-lg">
  <div class="flex h-full w-full flex-row">
    <div class="flex grow flex-row items-center p-3 align-middle">
      <a href="/" class="flex flex-row items-center align-middle md:mr-4 md:px-2">
        {#if dropDownVisible}
          {#if authed === "loading"}
            <div class="flex h-8 w-8 items-center justify-center rounded-full">
              <div class="h-fit w-fit animate-spin">
                <Loader2 strokeWidth={3} size={24} color="#8b5cf6" />
              </div>
            </div>
          {:else if authed === "no"}
            <Img src={nypsiLogo} alt="nypsi icon" class="h-8 w-8" />
          {:else}
            <a href="/me" class="h-8 rounded-full">
              <img
                class="h-auto max-h-full w-auto max-w-full rounded-full object-contain duration-200 hover:scale-105"
                src={authed}
                alt=""
              />
            </a>
          {/if}
        {:else}
          <Img src={nypsiLogo} alt="nypsi icon" class="h-8 w-8" />
        {/if}
      </a>

      <div
        class="mt-1 hidden h-full flex-row items-center align-middle text-sm md:flex [&>a]:mx-3 [&>a]:font-semibold [&>a]:text-slate-200"
      >
        <a class="hover-effect" href="/leaderboard">leaderboards</a>
        <a class="hover-effect" href="/status">status</a>
        <a class="hover-effect" href="https://discord.com/invite/hJTDNST" target="_blank">discord</a
        >
        <a class="hover-effect" href="https://docs.nypsi.xyz" target="_blank">docs</a>
        <a
          class="bg-gradient-to-br from-violet-500 to-purple-500 bg-clip-text font-bold !text-transparent duration-300"
          href="https://ko-fi.com/tekoh/tiers"
          target="_blank">premium</a
        >
      </div>

      <div class="flex grow justify-center text-center md:hidden">
        {#if dropDownVisible}
          <a
            in:fly={{ duration: 200, y: -10 }}
            out:fly={{ duration: 200, y: -10 }}
            href="/"
            class="mt-2 text-center font-semibold text-white">home</a
          >
        {/if}
      </div>

      <button
        type="button"
        class="rounded p-1 duration-200 hover:bg-slate-800 md:hidden"
        on:click={() => {
          handleMenuOpen();
        }}
      >
        <span class="sr-only">Open main menu</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-menu text-slate-400"
          ><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line
            x1="4"
            x2="20"
            y1="18"
            y2="18"
          /></svg
        >
      </button>
    </div>
    <div class="mr-3 hidden items-center justify-center md:flex">
      {#if authed === "loading"}
        <div class="flex h-10 w-10 items-center justify-center rounded-full">
          <div class="h-fit w-fit animate-spin">
            <Loader2 strokeWidth={3} size={24} color="#8b5cf6" />
          </div>
        </div>
      {:else if authed === "no"}
        <a
          href="/login?next={encodeURIComponent($page.url.pathname)}"
          class="rounded bg-slate-950 bg-opacity-25 p-2 px-3 text-sm font-semibold text-slate-200 duration-100 hover:bg-opacity-90"
          >log in</a
        >
      {:else}
        <a href="/me" class="h-10 w-10 rounded-full">
          <img
            class="h-auto max-h-full w-auto max-w-full rounded-full object-contain duration-200 hover:scale-105"
            src={authed}
            alt=""
          />
        </a>
      {/if}
    </div>
  </div>

  {#if dropDownVisible}
    <div
      in:fly={{ duration: 200, y: -10 }}
      out:fly={{ duration: 200, y: -10 }}
      class="absolute w-full rounded-lg border-b-2 border-white border-opacity-5 bg-slate-900 bg-opacity-75 shadow-lg backdrop-blur-md"
    >
      <div class="flex flex-col text-center font-semibold text-white [&>a]:m-3 [&>p]:m-3">
        <a href="/leaderboard">leaderboards</a>
        <a href="/status">status</a>
        {#if authed === "no"}
          <a href="/login?next={encodeURIComponent($page.url.pathname)}">log in</a>
        {/if}

        <a href="https://discord.com/invite/hJTDNST" target="_blank">discord</a>
        <a href="https://docs.nypsi.xyz" target="_blank">docs</a>
        <a
          href="https://ko-fi.com/tekoh/tiers"
          target="_blank"
          class="bg-gradient-to-br from-violet-500 to-purple-500 bg-clip-text text-transparent"
          >premium</a
        >
      </div>
    </div>
  {/if}
</nav>

<style>
  .hover-effect::after {
    content: "";
    display: block;
    width: 0;
    height: 2px;
    background: #8b5cf6;
    border-radius: 9999px;
    transition:
      width 0.2s ease-in,
      left 0.2s ease-in;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
  }

  .hover-effect:hover::after {
    width: 100%;
  }
</style>
