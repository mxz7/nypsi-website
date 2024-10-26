<script lang="ts">
  import { navigating, page } from "$app/stores";
  import { userSearchTerm } from "$lib/data/stores.js";
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();

  $userSearchTerm = $page.url.searchParams.get("search") || $page.params.id || "";
</script>

<div class="mb-2 mt-3 flex justify-center">
  <form>
    <input
      class="input input-bordered"
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
  </form>
</div>

{@render children?.()}
