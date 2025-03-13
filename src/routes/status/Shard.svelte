<script lang="ts">
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

<div class="card bg-base-200 {selected ? 'border-primary/50 border' : ''}">
  <div class="card-body">
    <h5 class="card-title {colour}">shard {data.id}</h5>

    <div class="text-xs opacity-90">
      <p>status: {data.status}</p>
      <p>ping: {data.ping}ms @ {dayjs(data.lastPing).format("h:mm:ss A")}</p>
      <p>guilds: {guildCount.toLocaleString()}</p>
    </div>
  </div>
</div>
