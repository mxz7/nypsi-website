<script lang="ts">
  import { invalidate } from "$app/navigation";
  import tooltip from "$lib/Tooltips.js";
  import ClusterStatus from "$lib/components/ClusterStatus.svelte";
  import { onDestroy, onMount } from "svelte";
  import toast from "svelte-french-toast";

  export let data;

  let loading = false;
  let updateIn = 30;
  let interval: number;

  let descriptionText = "offline";
  let descriptionColour = "#dc2626";

  if (data.status.main) {
    let online = 0;
    let unresponsive = 0;

    data.status.clusters.forEach((cluster) => {
      if (cluster.online) {
        online++;
        if (!cluster.responsive) {
          unresponsive++;
        }
      }
    });

    if (online === data.status.clusters.length && unresponsive === 0) {
      descriptionText = "working as expected";
      descriptionColour = "#16a34a";
    } else if (online > 0 && unresponsive > 0) {
      descriptionText = "having some trouble";
      descriptionColour = "#16a34a";
    }
  }

  function update() {
    updateIn = 30;

    interval = setInterval(() => {
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
  });

  onDestroy(() => {
    clearInterval(interval);
  });
</script>

<svelte:head>
  <title>nypsi status</title>

  <meta property="description" name="description" content={descriptionText} />

  <meta name="og:title" content="status" />
  <meta name="og:description" content={descriptionText} />
  <meta name="og:site_name" content="nypsi" />
</svelte:head>

<div class="flex w-full justify-center">
  <div class="mt-8 flex w-full justify-center md:w-full md:max-w-xl">
    <div class="flex flex-col gap-4">
      <h1 class="text-center text-5xl font-bold md:text-6xl">nypsi status</h1>
      <h2 class="text-center text-lg" style="color: {descriptionColour};">{descriptionText}</h2>
      <p class="-mt-4 text-center text-sm text-slate-500">updating in {updateIn} seconds</p>

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

      <div class="mt-4 flex flex-wrap justify-center gap-6 px-3">
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

      <div class="mt-4 text-center">
        <h2 class=" text-3xl font-semibold">still having trouble?</h2>
        <p class="mt-2">
          join the <a class="text-sky-400 underline" href="https://discord.com/invite/hJTDNST"
            >discord server</a
          > for help/information
        </p>
      </div>
    </div>
  </div>
</div>
