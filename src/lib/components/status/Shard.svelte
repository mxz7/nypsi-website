<script lang="ts">
  import tooltip from "$lib/Tooltips";

  export let data: {
    id: number;
    status: "idle" | "connecting" | "resuming" | "ready";
    ping: number;
    lastPing: number;
  };
  export let guildCount: number;
  export let selected = false;

  let colour = "#dc2626";

  let tooltipText =
    `status: ${data.status}<br>` +
    `ping: ${data.ping}ms<br>` +
    `last ping: ${new Date(data.lastPing).toLocaleTimeString()}<br>` +
    `guilds: ${guildCount.toLocaleString()}`;

  switch (data.status) {
    case "idle":
      colour = "#16a34a";
      break;

    case "ready":
    case "resuming":
      colour = "#d97706";
      break;
  }
</script>

<div
  class="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-950 bg-opacity-50 text-center text-sm shadow
  {selected ? 'border border-accent border-opacity-60' : ''}"
  style="color: {colour};"
  use:tooltip={{ content: tooltipText, allowHTML: true, theme: "tooltip" }}
>
  <p class="font-mono font-semibold">{data.id}</p>
</div>
