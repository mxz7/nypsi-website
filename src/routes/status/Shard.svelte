<script lang="ts">
  import dayjs from "dayjs";

  export let data: {
    id: number;
    status: "idle" | "connecting" | "resuming" | "ready";
    ping: number;
    lastPing: number;
  };
  export let guildCount: number;
  export let selected = false;

  let colour = "text-error";

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

<div class="card bg-base-200 {selected ? 'border border-primary border-opacity-50' : ''}">
  <div class="card-body">
    <h5 class="card-title {colour}">shard {data.id}</h5>

    <div class="text-xs opacity-90">
      <p>status: {data.status}</p>
      <p>ping: {data.ping}ms @ {dayjs(data.lastPing).format("h:mm:ss A")}</p>
      <p>guilds: {guildCount.toLocaleString()}</p>
    </div>
  </div>
</div>
