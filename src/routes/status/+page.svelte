<script lang="ts">
  import { invalidate } from "$app/navigation";
  import tooltip from "$lib/Tooltips.js";
  import Cluster from "$lib/components/status/Cluster.svelte";
  import Shard from "$lib/components/status/Shard.svelte";
  import { onDestroy, onMount } from "svelte";
  import toast from "svelte-french-toast";
  import { writable } from "svelte/store";

  export let data;

  let updateIn = 30;
  let interval: number;

  let descriptionText = "offline";
  let descriptionColour = "#dc2626";

  let guildIdSearch = writable("");
  let guild: {
    id: string;
    cluster: {
      id: number;
      online: boolean;
      responsive: boolean;
    };
    shard: {
      id: number;
      status: "idle" | "connecting" | "resuming" | "ready";
      ping: number;
      lastPing: number;
    };
  };

  if (data.status.main) {
    let online = 0;
    let unresponsive = 0;
    let restarting = 0;

    data.status.clusters.forEach((cluster) => {
      if (cluster.online) {
        online++;
        if (!cluster.responsive) {
          unresponsive++;
        }

        if (cluster.restarting) restarting++;
      }

      cluster.shards.forEach((shard) => {
        if (shard.status !== "idle") unresponsive++;
      });
    });

    if (data.status.maintenance) {
      descriptionText = "in maintenance mode";
      descriptionColour = "#d97706";
    } else if (online === data.status.clusters.length && unresponsive === 0) {
      if (restarting > 0) {
        if (restarting === data.status.clusters.length) descriptionText = "restarting";
        else descriptionText = "some clusters are restarting";
        descriptionColour = "#d97706";
      } else {
        descriptionText = "working as expected";
        descriptionColour = "#16a34a";
      }
    } else if (online > 0 && unresponsive > 0) {
      descriptionText = "having some trouble";
      descriptionColour = "#d97706";
    }
  }

  guildIdSearch.subscribe((value) => {
    guild = null;
    if (!value) return;
    const cluster = data.status.clusters.find((i) => i.guilds.find((i) => i.id === value));
    if (!cluster) return;
    const shard = cluster.shards.find(
      (i) => i.id === cluster.guilds.find((i) => i.id === value).shard,
    );

    guild = {
      cluster: {
        id: cluster.id,
        online: cluster.online,
        responsive: cluster.responsive,
      },
      id: value,
      shard,
    };
  });

  function update() {
    updateIn = 30;

    interval = setInterval(() => {
      updateIn--;

      if (updateIn <= 0) {
        clearInterval(interval);

        console.log("updating");
        invalidate("status").then(() => {
          $guildIdSearch = "";
          console.log("updated");
          toast.success("status updated", {
            position: "bottom-center",
          });

          update();
        });
      }
    }, 1000);
  }

  onMount(() => {
    update();
  });

  onDestroy(() => {
    clearInterval(interval);
  });
</script>

<svelte:head>
  <title>status / nypsi</title>

  <meta property="description" name="description" content={descriptionText} />

  <meta name="og:title" content="nypsi status" />
  <meta name="og:description" content={descriptionText} />

  <meta
    name="og:image"
    content="https://singlecolorimage.com/get/{descriptionColour.slice(1)}/128x128"
  />
  <meta property="og:image:width" content="128" />
  <meta property="og:image:height" content="128" />
</svelte:head>

<div class="flex w-full justify-center text-center">
  <div class="mt-14 w-full px-4 sm:max-w-xl">
    <h1 class="text-4xl font-semibold">nypsi status</h1>
    <p class="mt-2 text-sm opacity-25">updates in {updateIn} seconds</p>
    <h2 class="mt-4 text-xl" style="color: {descriptionColour};">{descriptionText}</h2>

    <input
      type="text"
      bind:value={$guildIdSearch}
      placeholder="server ID"
      class="my-2 rounded-lg bg-gray-950 bg-opacity-50 p-2 text-gray-400 placeholder:text-gray-600 focus:outline-none"
    />

    {#if $guildIdSearch}
      {#if !guild}
        <div class="mb-12 mt-6 flex w-full justify-center">
          <div class="mx-4 w-fit max-w-sm rounded border border-red-600 bg-red-300 p-2 text-left">
            <h2 class=" font-semibold text-red-600">unknown server</h2>
            <p class="text-sm text-red-600">
              to get your server ID, enable discord developer mode, right click on your server, and
              click copy id
            </p>
          </div>
        </div>
      {:else}
        <div class="mb-12 mt-6 flex w-full justify-center">
          <div class="mx-4 w-fit max-w-sm rounded bg-slate-950 bg-opacity-50 p-4 text-left">
            <h2 class="font-semibold">{guild.id}</h2>
            <p class="text-sm">
              cluster: {guild.cluster.id}
              <br />
              shard: {guild.shard.id}
            </p>
          </div>
        </div>
      {/if}
    {/if}

    <div class="mt-4 flex w-full justify-center gap-4">
      <div
        class="flex h-16 w-20 items-center justify-center rounded bg-slate-950 bg-opacity-50 text-sm shadow"
        style="color: {data.status.main ? '#16a34a' : '#dc2626'};"
        use:tooltip={{
          content: data.status.main ? "working as expected" : "having problems",
          theme: "tooltip",
        }}
      >
        <p>main</p>
      </div>
      {#await data.database then database}
        <div
          class="flex h-16 w-20 items-center justify-center rounded-lg bg-slate-950 bg-opacity-50 text-sm shadow"
          style="color: {database.online ? '#16a34a' : '#dc2626'};"
          use:tooltip={{
            content: database.online
              ? `query took: ${database.latency.toFixed(2)}ms`
              : "having problems",
            theme: "tooltip",
          }}
        >
          <p>database</p>
        </div>
      {/await}
    </div>

    <h3 class="mt-8 text-lg font-semibold text-gray-300">clusters</h3>

    <div class="mt-4 flex w-full flex-wrap justify-center gap-4">
      {#each data.status.clusters as cluster}
        <Cluster selected={guild?.cluster?.id === cluster.id} clusterData={cluster}></Cluster>
      {/each}
    </div>

    <h3 class="mt-8 text-lg font-semibold text-gray-300">shards</h3>

    <div class="mt-4 flex w-full flex-wrap justify-center gap-4">
      {#each [].concat.apply( [], data.status.clusters.map((i) => i.shards), ) as shard}
        <Shard
          selected={guild?.shard?.id === shard.id}
          guildCount={data.status.clusters
            .find((i) => i.shards.includes(shard))
            .guilds.filter((i) => i.shard === shard.id).length}
          data={shard}
        />
      {/each}
    </div>
  </div>
</div>
