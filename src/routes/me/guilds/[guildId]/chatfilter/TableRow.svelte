<script lang="ts">
  import { enhance } from "$app/forms";
  import { Pencil, Trash } from "lucide-svelte";
  import toast from "svelte-french-toast";

  interface Props {
    filterItem: {
      content: string;
      percentMatch?: number;
    };
  }

  let { filterItem }: Props = $props();

  let loading = $state(false);
</script>

<tr class="hover">
  <td>{filterItem.content}</td>
  <td>{filterItem.percentMatch || 100}%</td>
  <td class="flex">
    <button class="btn btn-ghost btn-sm {loading ? 'btn-disabled' : ''}" disabled={loading}>
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
        {#if loading}
          <span class="loading loading-spinner loading-xs text-error"></span>
        {:else}
          <Trash class="text-error" size={16} />
        {/if}
      </button>
    </form>
  </td>
</tr>
