<script lang="ts">
  import { navigating, page } from "$app/stores";
  import { userSearchTerm } from "$lib/data/stores.js";
  import { fade } from "svelte/transition";

  export let data;

  $userSearchTerm = $page.params.id;
</script>

<div class="mb-2 mt-3 flex justify-center">
  <form class="m-2 flex w-fit flex-row rounded-md bg-gray-950 bg-opacity-50 p-3">
    <!-- svelte-ignore a11y-autofocus -->
    <input
      class="bg-transparent text-sm text-gray-300 placeholder:text-gray-400 focus:outline-none"
      type="text"
      name="search"
      placeholder="search"
      bind:value={$userSearchTerm}
      required
      autocorrect="off"
      autocapitalize="off"
      minlength="2"
      maxlength="32"
      disabled={Boolean($navigating)}
    />
    <input
      class="mr-2 text-sm text-gray-500 hover:cursor-pointer"
      type="submit"
      value="find"
      disabled={Boolean($navigating)}
    />
  </form>
</div>

{#if data.error}
  <h2 transition:fade class="-mt-8 text-center text-red-500">you are being rate limited</h2>
{/if}

<slot />
