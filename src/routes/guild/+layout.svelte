<script lang="ts">
  import { navigating, page } from "$app/stores";
  import { guildSearchTerm } from "$lib/state.svelte";
  interface Props {
    children?: import("svelte").Snippet;
  }

  let { children }: Props = $props();

  guildSearchTerm.value = $page.url.searchParams.get("search") || $page.params.name || "";
</script>

<div class="mb-2 mt-5 flex justify-center">
  <form>
    <!-- svelte-ignore a11y_autofocus -->
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
      disabled={Boolean($navigating)}
      title="guild name"
    />
  </form>
</div>

{@render children?.()}
