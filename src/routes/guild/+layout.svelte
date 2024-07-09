<script lang="ts">
  import { navigating, page } from "$app/stores";
  import { guildSearchTerm } from "$lib/data/stores.js";

  $guildSearchTerm = $page.url.searchParams.get("search") || $page.params.name || "";
</script>

<div class="mb-2 mt-5 flex justify-center">
  <form>
    <!-- svelte-ignore a11y-autofocus -->
    <input
      class="input input-bordered"
      type="text"
      name="search"
      placeholder="guild name"
      bind:value={$guildSearchTerm}
      required
      autocorrect="off"
      autocapitalize="off"
      minlength="2"
      maxlength="32"
      disabled={Boolean($navigating)}
      title="guild name"
    />
  </form>
</div>

<slot />
