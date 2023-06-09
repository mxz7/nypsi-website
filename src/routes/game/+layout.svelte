<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  let searched: string = $page.params.id;
</script>

<div class="mt-44">
  <div class="mt-6 flex justify-center">
    <form
      class="m-2 flex w-fit flex-row rounded-md bg-gray-950 bg-opacity-50 p-3"
      on:submit|preventDefault={() => {
        goto(`/game/${searched}`);
      }}
    >
      <!-- svelte-ignore a11y-autofocus -->
      <input
        class="ml-2 bg-transparent text-gray-300 placeholder:text-gray-400 focus:outline-none"
        type="text"
        name="id"
        placeholder="enter a game id"
        bind:value={searched}
        required
        autocomplete="off"
        autocapitalize="off"
        autofocus={true}
      />
      <input class="mr-2 text-gray-500 hover:cursor-pointer" type="submit" value="find" />
    </form>
  </div>

  <slot />
</div>
