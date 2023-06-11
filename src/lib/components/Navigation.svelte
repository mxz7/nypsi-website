<script lang="ts">
  import { fly } from "svelte/transition";

  $: dropDownVisible = false;

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

<nav class="sticky z-30 w-full shadow-lg">
  <div class="flex w-full flex-row items-center p-3 align-middle">
    <a href="/" class="flex flex-row items-center align-middle md:mr-4 md:px-2">
      <img src="/nypsi_transparent.png" alt="nypsi icon" class="h-8" />

      <!-- <p
        in:fade={{ duration: 200 }}
        out:fade={{ duration: 200 }}
        style="opacity: {$page.url.pathname === '/' ? '0' : '100'}%;"
        class="ml-3 hidden text-2xl font-bold text-gray-200 duration-200 md:block"
      >
        nypsi
      </p> -->
    </a>

    <div
      class="mt-2 hidden h-full flex-row items-center align-middle text-sm md:flex [&>a]:mx-3 [&>a]:font-bold [&>a]:text-gray-200"
    >
      <a class="hover-effect" href="/leaderboard">leaderboards</a>
      <a class="hover-effect" href="https://discord.com/invite/hJTDNST" target="_blank">discord</a>
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

  {#if dropDownVisible}
    <div
      in:fly={{ duration: 200, y: -10 }}
      out:fly={{ duration: 200, y: -10 }}
      class="absolute w-full rounded-lg border-b-2 border-white border-opacity-5 bg-gray-900 bg-opacity-75 shadow-lg backdrop-blur-md"
    >
      <div class="flex flex-col text-center font-semibold text-white [&>a]:m-3">
        <a href="/leaderboard">leaderboards</a>
        <a href="https://discord.com/invite/hJTDNST" target="_blank">discord</a>
        <a href="https://ko-fi.com/tekoh/tiers" target="_blank" class="text-red-500">donate</a>
      </div>
    </div>
  {/if}
</nav>
