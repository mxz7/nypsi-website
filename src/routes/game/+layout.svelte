<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  let searched: string = $page.params.id;
</script>

<div class="mb-14 mt-14">
  <div class="mt-6 flex justify-center">
    <form
      on:submit|preventDefault={() => {
        goto(`/game/${searched}`);
      }}
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

  <slot />
</div>
