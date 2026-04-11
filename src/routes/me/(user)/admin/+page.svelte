<script lang="ts">
  import { enhance } from "$app/forms";
  import { toast } from "svelte-sonner";

  let { data } = $props();
</script>

<h1 class="text-center text-3xl font-bold text-white">admin controls</h1>

<div class="grid grid-cols-4 gap-4">
  {#if data.adminLevel >= 4}
    <form
      action="?/reboot"
      method="post"
      use:enhance={() => {
        return (event) => {
          if (event.result.status === 200) {
            toast.success("bot will reboot soon, do NOT press the button again", {
              position: "top-center",
            });
          } else {
            toast.error("failed to send reboot command", { position: "top-center" });
          }
        };
      }}
    >
      <button type="submit" class="btn btn-error"> reboot </button>
    </form>

    <form
      action="?/pauseStreaks"
      method="post"
      use:enhance={() => {
        return (event) => {
          if (event.result.status === 200) {
            toast.success("streaks are paused for the next 24 hours", { position: "top-center" });
          } else {
            toast.error("failed to send command", { position: "top-center" });
          }
        };
      }}
    >
      <button type="submit" class="btn"> pause streaks </button>
    </form>
  {/if}
</div>
