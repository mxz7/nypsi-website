<script lang="ts">
  import tooltip from "$lib/Tooltips";
  import { sort } from "fast-sort";

  export let clusterData: {
    id: number;
    online: boolean;
    responsive: boolean;
    guilds: { id: string; shard: number }[];
  };
  export let selected = false;

  let colour = "#dc2626";
  let text = "offline";
  let tooltipText = "cluster is unavailable";
  const shards: number[] = [];

  if (clusterData.online) {
    if (clusterData.responsive) {
      colour = "#16a34a";
      text = "online";
      tooltipText = "working as expected";

      for (const guild of clusterData.guilds) {
        if (!shards.includes(guild.shard)) shards.push(guild.shard);
      }

      tooltipText += `<br /><br />${clusterData.guilds.length.toLocaleString()} guilds<br />shards: ${sort(
        shards,
      )
        .asc()
        .join()}`;
    } else {
      colour = "#d97706";
      text = "not responding";
      tooltipText = "online, but not responding to events";
    }
  }
</script>

<div
  class="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-950 bg-opacity-50 text-center text-sm shadow
  {selected ? 'border border-accent border-opacity-60' : ''}"
  style="color: {colour};"
  use:tooltip={{ content: tooltipText, allowHTML: true, theme: "tooltip" }}
>
  <p class="font-mono font-semibold">{clusterData.id}</p>
</div>
