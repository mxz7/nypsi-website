<script lang="ts">
  import { enhance } from "$app/forms";
  import { sort } from "fast-sort";
  import { Pencil, Trash } from "@lucide/svelte";
  import toast from "svelte-french-toast";

  interface Props {
    filter: { content: string; percentMatch?: number }[];
  }

  let { filter }: Props = $props();

  let loading = $state(false);
  let editContent = $state("");
  let editMatchPercentage = $state(100);

  let modal: HTMLDialogElement;
</script>

<table class="mt-4 table w-full flex-1 text-xs">
  <thead>
    <tr>
      <th>content</th>
      <th>percent</th>
      <th>actions</th>
    </tr>
  </thead>
  <tbody>
    {#each sort(filter).asc((i) => i) as filterItem}
      <tr class="hover">
        <td>{filterItem.content}</td>
        <td>{filterItem.percentMatch || 100}%</td>
        <td class="flex">
          <button
            class="btn btn-ghost btn-sm {loading ? 'btn-disabled' : ''}"
            disabled={loading}
            onclick={() => {
              editContent = filterItem.content;
              editMatchPercentage = filterItem.percentMatch || 100;
              modal.showModal();
            }}
          >
            <Pencil class="text-warning" size={16} />
          </button>

          <form
            action="?/delete"
            method="post"
            use:enhance={() => {
              loading = true;
              return async ({ update, result }) => {
                if (result.type === "success") {
                  toast.success(`deleted ${filterItem.content}`, {
                    position: "bottom-center",
                    style:
                      "--tw-bg-opacity: 1; background-color: var(--fallback-b3,oklch(var(--b3)/var(--tw-bg-opacity))); color: oklch(0.841536 0.007965 265.755);",
                    duration: 5000,
                  });
                }

                await update();
                loading = false;
              };
            }}
          >
            <input type="text" name="content" value={filterItem.content} class="hidden" id="" />
            <button class="btn btn-ghost btn-sm {loading ? 'btn-disabled' : ''}" disabled={loading}>
              <Trash class="text-error" size={16} />
            </button>
          </form>
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<dialog id="my_modal_2" class="modal" bind:this={modal}>
  <div class="modal-box">
    <h3 class="text-lg font-bold">edit match percentage</h3>
    <form
      action="?/edit"
      method="post"
      class="flex flex-col gap-2"
      use:enhance={() => {
        loading = true;

        return async ({ update, result }) => {
          modal.close();
          if (result.type === "success") {
            toast.success(`updated ${editContent}`, {
              position: "bottom-center",
              style:
                "--tw-bg-opacity: 1; background-color: var(--fallback-b3,oklch(var(--b3)/var(--tw-bg-opacity))); color: oklch(0.841536 0.007965 265.755);",
              duration: 5000,
            });
          } else if (result.type === "failure") {
            toast.error(`error: ${result.data.message}`, {
              position: "bottom-center",
              style:
                "--tw-bg-opacity: 1; background-color: var(--fallback-b3,oklch(var(--b3)/var(--tw-bg-opacity))); color: oklch(0.841536 0.007965 265.755);",
              duration: 5000,
            });
          }

          await update();
          loading = false;
        };
      }}
    >
      <input type="text" name="content" class="hidden" bind:value={editContent} />
      <input
        type="number"
        name="percent"
        class="input input-bordered w-full"
        id="percent"
        bind:value={editMatchPercentage}
      />
      <button class="btn {loading ? 'btn-disabled' : ''}" disabled={loading}>
        {#if loading}
          <span class="loading loading-spinner"></span>
        {:else}
          update
        {/if}
      </button>
    </form>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
