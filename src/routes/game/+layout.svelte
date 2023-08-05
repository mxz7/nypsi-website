<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  let searched: string = $page.params.id;
</script>

<div class="mb-14 mt-14">
  <div class="mt-6 flex justify-center">
    <form
      class="m-2 flex w-fit flex-row rounded-md bg-slate-950 bg-opacity-50 p-3"
      on:submit|preventDefault={() => {
        goto(`/game/${searched}`);
      }}
    >
      <!-- svelte-ignore a11y-autofocus -->
      <input
        class="ml-2 bg-transparent text-slate-300 placeholder:text-slate-400 focus:outline-none"
        type="text"
        name="id"
        placeholder="enter a game id"
        bind:value={searched}
        autocorrect="off"
        autocapitalize="off"
        autofocus={true}
      />
      <input class="mr-2 text-slate-500 hover:cursor-pointer" type="submit" value="find" />
    </form>
  </div>

  <slot />
</div>
