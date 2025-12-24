<script lang="ts">
  import Card from "$lib/components/ui/Card.svelte";
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

<Card class={selected ? "border-primary/50 border" : ""}>
  <h4 class="card-title {colour}">cluster {clusterData.id}</h4>
  <p class="text-sm">{description}</p>
  {#if description === "working as expected"}
    <dl class="mt-2 space-y-1 text-sm opacity-90">
      <div class="flex gap-1">
        <dt>guilds</dt>
        <dd>{clusterData.guilds.length.toLocaleString()}</dd>
      </div>

      <div class="flex gap-1">
        <dt>shards</dt>
        <dd>{sort(shards).asc().join(", ")}</dd>
      </div>

      <div class="flex gap-1">
        <dt>uptime</dt>
        <dd>{MStoTime(clusterData.uptime)}</dd>
      </div>
    </dl>
  {/if}
</Card>

<style>
  dt::after {
    content: ":";
  }
</style>
