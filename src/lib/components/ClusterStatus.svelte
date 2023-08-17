<script lang="ts">
  import tooltip from "$lib/Tooltips";

  export let clusterData: { id: number; online: boolean; responsive: boolean };

  let colour = "#dc2626";
  let text = "offline";
  let tooltipText = "cluster is unavailable";

  if (clusterData.online) {
    if (clusterData.responsive) {
      colour = "#16a34a";
      text = "online";
      tooltipText = "working as expected";
    } else {
      colour = "#d97706";
      text = "not responding";
      tooltipText = "online, but not responding to events";
    }
  }
</script>

<div
  class="flex h-28 w-28 flex-col items-center justify-center gap-4 rounded-lg shadow"
  style="background-color: {colour};"
  use:tooltip={{ content: tooltipText, theme: "tooltip" }}
>
  <p class="font-mono font-semibold">cluster {clusterData.id}</p>
  <p class="font-mono text-sm">{text}</p>
</div>
