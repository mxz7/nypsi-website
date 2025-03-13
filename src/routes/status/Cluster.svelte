<script lang="ts">
  import { MStoTime } from "$lib/functions/time";
  import { sort } from "fast-sort";

  interface Props {
    clusterData: {
      id: number;
      online: boolean;
      responsive: boolean;
      guilds: { id: string; shard: number }[];
      uptime: number;
      restarting: boolean;
    };
    selected?: boolean;
  }

  let { clusterData, selected = false }: Props = $props();

  let colour = $state("text-error");
  let description = $state("cluster is unavailable");

  const shards: number[] = [];

  if (clusterData.online) {
    if (clusterData.responsive) {
      colour = "text-success";
      description = "working as expected";

      if (clusterData.restarting) {
        colour = "text-warning";
        description = "cluster is restarting";
      }

      for (const guild of clusterData.guilds) {
        if (!shards.includes(guild.shard)) shards.push(guild.shard);
      }
    } else {
      colour = "text-warning";
      description = "online, but not responding to events";
    }
  }
</script>

<div class="card bg-base-200 {selected ? 'border-primary/50 border' : ''}">
  <div class="card-body">
    <h4 class="card-title {colour}">cluster {clusterData.id}</h4>
    <p class="text-sm">{description}</p>
    {#if description === "working as expected"}
      <div class="text-sm opacity-90">
        <p>guilds: {clusterData.guilds.length.toLocaleString()}</p>
        <p>shards: {sort(shards).asc().join(" ")}</p>
        <p>uptime: {MStoTime(clusterData.uptime)}</p>
      </div>
    {/if}
  </div>
</div>
