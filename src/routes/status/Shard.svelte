<script lang="ts">
  import Card from "$lib/components/ui/Card.svelte";
  import dayjs from "dayjs";

  interface Props {
    data: {
      id: number;
      status: "idle" | "connecting" | "resuming" | "ready";
      ping: number;
      lastPing: number;
    };
    guildCount: number;
    selected?: boolean;
  }

  let { data, guildCount, selected = false }: Props = $props();

  let colour = $state("text-error");

  switch (data.status) {
    case "idle":
      colour = "text-success";
      break;

    case "ready":
    case "resuming":
      colour = "text-warning";
      break;
  }
</script>

<Card class={selected ? "border-primary/50 border" : ""}>
  <h5 class="card-title {colour}">shard {data.id}</h5>

  <dl class="space-y-1 text-sm opacity-90">
    <div class="flex gap-1">
      <dt>status</dt>
      <dd>{data.status}</dd>
    </div>

    <div class="flex gap-1">
      <dt>ping</dt>
      <dd>
        {data.ping}ms @
        <time datetime={new Date(data.lastPing).toUTCString()}>
          {dayjs(data.lastPing).format("h:mm:ss A")}
        </time>
      </dd>
    </div>

    <div class="flex gap-1">
      <dt>guilds</dt>
      <dd>{guildCount.toLocaleString()}</dd>
    </div>
  </dl>
</Card>

<style>
  dt::after {
    content: ":";
  }
</style>
