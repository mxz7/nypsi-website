<script lang="ts">
  import { navigating, page } from "$app/stores";
  import { guildSearchTerm } from "$lib/data/stores.js";

  $guildSearchTerm = $page.url.searchParams.get("search") || $page.params.name || "";
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
      placeholder="guild"
      bind:value={$guildSearchTerm}
      required
      autocorrect="off"
      autocapitalize="off"
      minlength="2"
      maxlength="32"
      disabled={Boolean($navigating)}
      title="guild name"
    />
    <input
      class="mr-2 text-slate-500 hover:cursor-pointer"
      type="submit"
      value="find"
      disabled={Boolean($navigating)}
    />
  </form>
</div>

<slot />
