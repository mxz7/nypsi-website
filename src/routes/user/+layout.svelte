<script lang="ts">
  import { navigating } from "$app/stores";
  import { userSearchTerm } from "$lib/state.svelte";
  interface Props {
    children?: import("svelte").Snippet;
  }

  let { children }: Props = $props();
</script>

<div class="mb-2 mt-3 flex justify-center">
  <form>
    <input
      class="input input-bordered"
      type="text"
      name="search"
      placeholder="search"
      bind:value={userSearchTerm.value}
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
