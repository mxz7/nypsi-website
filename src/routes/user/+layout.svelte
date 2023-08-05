<script lang="ts">
  import { navigating, page } from "$app/stores";
  import { userSearchTerm } from "$lib/data/stores.js";
  import toast from "svelte-french-toast";
  import { fade } from "svelte/transition";

  export let data;

  $: if (data.error === 429) {
    toast.error("you are being rate limited", {
      position: "bottom-center",
      style: "color: #fff; background: #b91c1c;",
    });
  }

  $userSearchTerm = $page.url.searchParams.get("search") || $page.params.id || "";
</script>

<div class="mb-2 mt-3 flex justify-center">
  <form
    class="m-2 flex w-fit flex-row rounded-md border border-accent border-opacity-0 bg-slate-950 bg-opacity-50 p-3 duration-150 focus-within:border focus-within:border-opacity-50"
  >
    <!-- svelte-ignore a11y-autofocus -->
    <input
      class="bg-transparent pr-4 text-slate-300 placeholder:text-slate-400 focus:outline-none"
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
      pattern={String.raw`^[_\.\w0-9]{2,32}$`}
      title="discord username"
    />
    <input
      class="mr-2 text-slate-500 hover:cursor-pointer"
      type="submit"
      value="find"
      disabled={Boolean($navigating)}
    />
  </form>
</div>

{#if data.error === 451}
  <h2 transition:fade class="mt-8 text-center text-2xl font-semibold text-white">
    private profile
  </h2>
{/if}

<slot />
