<script lang="ts">
  import type { UserSession } from "$lib/types/User";
  import { fly } from "svelte/transition";

  $: dropDownVisible = false;
  export let user: Promise<UserSession>;

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
        {#await user}
          <img src="/nypsi_transparent.png" alt="nypsi icon" class="h-8" />
        {:then user}
          {#if dropDownVisible && user && user.authenticated}
            <a href="/user/me" class="h-8 rounded-full">
              <img
                class="h-auto max-h-full w-auto max-w-full rounded-full object-contain duration-200 hover:scale-105"
                src="https://cdn.discordapp.com/avatars/{user.id}/{user.avatar}.png"
                alt=""
              />
            </a>
          {:else}
            <img src="/nypsi_transparent.png" alt="nypsi icon" class="h-8" />
          {/if}
        {/await}
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
          class="h-6 w-6 text-gray-400"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          ><path
            fill-rule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clip-rule="evenodd"
          /></svg
        >
      </button>
    </div>
    <div class="mr-3 hidden items-center justify-center md:flex">
      {#await user}
        <a
          href="/login"
          class="rounded bg-gray-950 bg-opacity-25 p-2 px-3 text-sm font-semibold text-gray-200"
          >log in</a
        >
      {:then user}
        {#if user.authenticated}
          <a href="/user/me" class="h-10 w-10 rounded-full">
            <img
              class="h-auto max-h-full w-auto max-w-full rounded-full object-contain duration-200 hover:scale-105"
              src="https://cdn.discordapp.com/avatars/{user.id}/{user.avatar}.png"
              alt=""
            />
          </a>
        {:else}
          <a
            href="/login"
            class="rounded bg-gray-950 bg-opacity-25 p-2 px-3 text-sm font-semibold text-gray-200"
            >log in</a
          >
        {/if}
      {/await}
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
        {#await user}
          <a href="/login">log in</a>
        {:then user}
          {#if !user || !user.authenticated}
            <a href="/login">log in</a>
          {/if}
        {/await}
        <a href="https://discord.com/invite/hJTDNST" target="_blank">discord</a>
        <a href="https://docs.nypsi.xyz" target="_blank">docs</a>
        <a href="https://ko-fi.com/tekoh/tiers" target="_blank" class="text-red-500">donate</a>
      </div>
    </div>
  {/if}
</nav>
