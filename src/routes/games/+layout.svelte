<script lang="ts">
  import { preventDefault } from "svelte/legacy";

  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  interface Props {
    children?: import("svelte").Snippet;
  }

  let { children }: Props = $props();

  let searched: string = $state(page.params.id);
</script>

<div class="mt-5 mb-3 flex w-full justify-center">
  <form
    onsubmit={preventDefault(() => {
      goto(`/games/${searched}`);
    })}
  >
    <input
      class="input input-bordered"
      type="text"
      name="id"
      placeholder="enter a game id"
      bind:value={searched}
      autocorrect="off"
      autocapitalize="off"
    />
  </form>
</div>

{@render children?.()}
