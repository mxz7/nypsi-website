<script lang="ts">
  import { enhance } from "$app/forms";
  import toast from "svelte-french-toast";

  let { data } = $props();
</script>

<h1 class="text-center text-3xl font-bold text-white">admin controls</h1>

{#if data.adminLevel >= 4}
  <form
    action="?/reboot"
    method="post"
    use:enhance={() => {
      return (event) => {
        if (event.result.status === 200) {
          toast("bot will reboot soon, do NOT press the button again", {
            position: "top-center",
            icon: "✅",
            style:
              "background-color: oklch(0.15 0.0299 262.929993); color: oklch(0.8936 0.0076 260.730011);",
          });
        } else {
          toast("failed to send reboot command", {
            position: "top-center",
            icon: "❌",
            style:
              "background-color: oklch(0.15 0.0299 262.929993); color: oklch(0.8936 0.0076 260.730011);",
          });
        }
      };
    }}
  >
    <button type="submit" class="btn btn-error"> reboot </button>
  </form>
{/if}
