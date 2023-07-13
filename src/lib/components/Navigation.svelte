<script lang="ts">
  import { page } from "$app/stores";
  import type { UserSession } from "$lib/types/User";
  import { fly } from "svelte/transition";

  $: dropDownVisible = false;
  export let user: UserSession;

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
</script>

<nav class="sticky z-30 h-16 w-full shadow-lg">
  <div class="flex h-full w-full flex-row">
    <div class="flex grow flex-row items-center p-3 align-middle">
      <a href="/" class="flex flex-row items-center align-middle md:mr-4 md:px-2">
        {#if dropDownVisible && user && user.authenticated}
          <a href="/user/{user.id}" class="h-8 rounded-full">
            <img
              class="h-auto max-h-full w-auto max-w-full rounded-full object-contain duration-200 hover:scale-105"
              src="https://cdn.discordapp.com/avatars/{user.id}/{user.avatar}.png"
              alt=""
            />
          </a>
        {:else}
          <img src="/nypsi_transparent.png" alt="nypsi icon" class="h-8" />
        {/if}
      </a>

      <div
        class="mt-1 hidden h-full flex-row items-center align-middle text-sm md:flex [&>a]:mx-3 [&>a]:font-bold [&>a]:text-gray-200"
      >
        <a class="hover-effect" href="/leaderboard">leaderboards</a>
        <a class="hover-effect" href="https://discord.com/invite/hJTDNST" target="_blank">discord</a
        >
        <a class="hover-effect" href="https://docs.nypsi.xyz" target="_blank">docs</a>
        <a
          class="hover-effect duration-300 hover:scale-110 hover:text-red-500"
          href="https://ko-fi.com/tekoh/tiers"
          target="_blank">donate</a
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
        class="rounded p-1 duration-200 hover:bg-gray-800 md:hidden"
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
          class="lucide lucide-menu text-gray-400"
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
      {#if user.authenticated}
        <a href="/user/{user.id}" class="h-10 w-10 rounded-full">
          <img
            class="h-auto max-h-full w-auto max-w-full rounded-full object-contain duration-200 hover:scale-105"
            src="https://cdn.discordapp.com/avatars/{user.id}/{user.avatar}.png"
            alt=""
          />
        </a>
      {:else}
        <a
          href="/login?redirect={encodeURIComponent($page.url.toString())}"
          class="rounded bg-gray-950 bg-opacity-25 p-2 px-3 text-sm font-semibold text-gray-200"
          >log in</a
        >
      {/if}
    </div>
  </div>

  {#if dropDownVisible}
    <div
      in:fly={{ duration: 200, y: -10 }}
      out:fly={{ duration: 200, y: -10 }}
      class="absolute w-full rounded-lg border-b-2 border-white border-opacity-5 bg-gray-900 bg-opacity-75 shadow-lg backdrop-blur-md"
    >
      <div class="flex flex-col text-center font-semibold text-white [&>a]:m-3 [&>p]:m-3">
        <a href="/leaderboard">leaderboards</a>
        {#if !user || !user.authenticated}
          <a href="/login?redirect={encodeURIComponent($page.url.toString())}">log in</a>
        {/if}
        <a href="https://discord.com/invite/hJTDNST" target="_blank">discord</a>
        <a href="https://docs.nypsi.xyz" target="_blank">docs</a>
        <a href="https://ko-fi.com/tekoh/tiers" target="_blank" class="text-red-500">donate</a>
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
    background: rgb(239, 68, 68);
    border-radius: 9999px;
    transition: width 0.2s ease-in, left 0.2s ease-in;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
  }

  .hover-effect:hover::after {
    width: 100%;
  }
</style>
