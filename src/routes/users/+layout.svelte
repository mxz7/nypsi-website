<!-- @migration task: review uses of `navigating` -->
<script lang="ts">
  import { goto } from "$app/navigation";
  import { navigating } from "$app/state";
  import { items, userSearchTerm } from "$lib/state.svelte";
  import { onMount } from "svelte";

  let { children, data } = $props();

  onMount(() => {
    if (!items.value) items.value = data.items;
  });
</script>

<div class="mt-5 mb-2 flex justify-center">
  <form
    onsubmit={(e) => {
      e.preventDefault();
      goto(`/user/${userSearchTerm.value}`);
    }}
  >
    <input
      class="input input-bordered"
      type="text"
      name="search"
      placeholder="username"
      bind:value={userSearchTerm.value}
      required
      autocorrect="off"
      autocapitalize="off"
      minlength="2"
      maxlength="32"
      disabled={Boolean(navigating.to)}
      pattern={String.raw`^[_\.\w0-9]{2,32}$`}
      title="discord username"
    />
  </form>
</div>

{@render children?.()}
