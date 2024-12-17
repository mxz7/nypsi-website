<!-- @migration task: review uses of `navigating` -->
<script lang="ts">
  import { goto } from "$app/navigation";
  import { navigating, page } from "$app/state";
  import { guildSearchTerm } from "$lib/state.svelte";

  let { children } = $props();

  guildSearchTerm.value = page.url.searchParams.get("search") || page.params.name || "";
</script>

<div class="mb-2 mt-5 flex justify-center">
  <form
    onsubmit={(e) => {
      e.preventDefault();
      goto(`/guild/${encodeURIComponent(guildSearchTerm.value.replaceAll(" ", "-"))}`);
    }}
  >
    <input
      class="input input-bordered"
      type="text"
      name="search"
      placeholder="guild name"
      bind:value={guildSearchTerm.value}
      required
      autocorrect="off"
      autocapitalize="off"
      minlength="2"
      maxlength="32"
      disabled={Boolean(navigating)}
      title="guild name"
    />
  </form>
</div>

{@render children?.()}
