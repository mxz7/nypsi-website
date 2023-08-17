<script lang="ts">
  import { invalidate } from "$app/navigation";
  import tooltip from "$lib/Tooltips.js";
  import ClusterStatus from "$lib/components/ClusterStatus.svelte";
  import { onMount } from "svelte";
  import toast from "svelte-french-toast";

  export let data;

  let loading = false;
  let updateIn = 30;

  function update() {
    updateIn = 30;

    const interval = setInterval(() => {
      updateIn--;
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      loading = true;
      console.log("updating");
      invalidate("status").then((r) => {
        console.log("updated");
        toast("status updated", {
          position: "bottom-center",
          style: "color: #fff; background-color: #020617;",
        });
        loading = false;
        update();
      });
    }, 30000);
  }

  onMount(() => {
    update();
    console.log("mount");
  });
</script>

<div class="flex w-full justify-center">
  <div class="mt-8 flex w-full justify-center md:w-full md:max-w-xl">
    <div class="flex flex-col gap-4">
      <h1 class="w-full text-center text-3xl font-bold md:text-6xl">nypsi status</h1>
      <p class="text-center text-sm text-slate-500">updating in {updateIn} seconds</p>

      <div class="mt-12 flex w-full justify-center gap-3">
        <div
          class="shadow- flex h-28 w-28 flex-col items-center justify-center gap-4 rounded-lg"
          style="background-color: {data.status.main ? '#16a34a' : '#dc2626'};"
          use:tooltip={{
            content: data.status.main ? "working as expected" : "having problems",
            theme: "tooltip",
          }}
        >
          <p class="font-mono font-bold">main</p>
          <p class="font-mono text-sm">{data.status.main ? "online" : "offline"}</p>
        </div>
      </div>

      <div class="mt-4 flex flex-wrap justify-center gap-6">
        {#each data.status.clusters as cluster}
          <ClusterStatus clusterData={cluster}></ClusterStatus>
        {/each}
        <div
          class="shadow- flex h-28 w-28 flex-col items-center justify-center gap-4 rounded-lg"
          style="background-color: {data.status.main ? '#16a34a' : '#dc2626'};"
          use:tooltip={{
            content: data.database.online
              ? `query took: ${data.database.latency.toFixed(2)}ms`
              : "having problems",
            theme: "tooltip",
          }}
        >
          <p class="font-mono font-bold">database</p>
          <p class="font-mono text-sm">{data.database.online ? "online" : "offline"}</p>
        </div>
      </div>
    </div>
  </div>
</div>
