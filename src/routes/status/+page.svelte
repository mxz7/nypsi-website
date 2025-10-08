<script lang="ts">
  import { invalidate } from "$app/navigation";
  import { MStoTime } from "$lib/functions/time.js";
  import { RefreshCw } from "@lucide/svelte";
  import dayjs from "dayjs";
  import { onDestroy, onMount } from "svelte";
  import toast from "svelte-french-toast";
  import Cluster from "./Cluster.svelte";
  import Shard from "./Shard.svelte";

  let { data } = $props();

  let interval: ReturnType<typeof setInterval>;

  let descriptionText = $state("offline");
  let descriptionColour = $state("text-error");

  let guildIdSearch = $state("");
  let age: number = $state(data.status.age);

  let reloading = $state(false);

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
      descriptionColour = "text-warning";
    } else if (online === data.status.clusters.length && unresponsive === 0) {
      if (restarting > 0) {
        if (restarting === data.status.clusters.length) descriptionText = "restarting";
        else descriptionText = "some clusters are restarting";
        descriptionColour = "text-warning";
      } else {
        descriptionText = "working as expected";
        descriptionColour = "text-success";
      }
    } else if (online > 0 && unresponsive > 0) {
      descriptionText = "having some trouble";
      descriptionColour = "text-warning";
    }
  }

  const guild: {
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
  } = $derived.by(() => {
    const cluster = data.status.clusters.find((i) => i.guilds.find((i) => i.id === guildIdSearch));
    if (!cluster) return;

    const shard = cluster.shards.find(
      (i) => i.id === cluster.guilds.find((i) => i.id === guildIdSearch).shard,
    );

    return {
      cluster: {
        id: cluster.id,
        online: cluster.online,
        responsive: cluster.responsive,
      },
      id: guildIdSearch,
      shard,
    };
  });

  $effect(() => {
    age = data.status.age;
  });

  onMount(() => {
    interval = setInterval(() => {
      age++;
      console.log(age);
    }, 1000);
  });

  onDestroy(() => {
    clearInterval(interval);
  });
</script>

<svelte:head>
  <title>status | nypsi</title>
  <meta name="og:title" content="status | nypsi" />
</svelte:head>

<div class="mt-16 flex w-full justify-center">
  <div class="w-full px-4 lg:max-w-3xl lg:px-0">
    <div class="flex">
      <div class="flex-1">
        <h1 class="text-5xl font-bold text-white">status</h1>
        <p class="font-mono text-xs opacity-50">{dayjs(data.status.time).format("HH:mm:ss")}</p>
        <h2 class="mt-4 text-xl {descriptionColour}">
          {descriptionText}
        </h2>
      </div>

      <div class="flex-none">
        <button
          onclick={async () => {
            reloading = true;
            await invalidate("status");
            reloading = false;

            toast("status updated", {
              position: "top-center",
              icon: "✅",
              style:
                "background-color: oklch(0.15 0.0299 262.929993); color: oklch(0.8936 0.0076 260.730011);",
            });
          }}
          disabled={age < 30 || reloading}
          class="btn text-sm"
        >
          <RefreshCw size={16} class={reloading ? "animate-spin" : ""} />
          <span>refresh</span>
        </button>
      </div>
    </div>

    <input
      type="text"
      name="server"
      bind:value={guildIdSearch}
      placeholder="server ID"
      class="input input-bordered mt-4"
    />

    {#if guildIdSearch}
      {#if guild}
        <div class="card bg-base-200 mt-4 w-fit shadow-xl">
          <div class="card-body">
            <h2 class="card-title text-success">{guild.id}</h2>
            <p>
              cluster {guild.cluster.id}, shard {guild.shard.id}
            </p>
          </div>
        </div>
      {:else}
        <div class="card bg-base-200 mt-4 w-96 shadow-xl">
          <div class="card-body">
            <h2 class="card-title text-error">unknown server</h2>
            <p class="text-error text-sm opacity-90">
              to get your server ID, enable discord developer mode, right click on your server, and
              click copy id
            </p>
          </div>
        </div>
      {/if}
    {/if}

    <div class="divider"></div>

    <div class="grid w-full grid-cols-2 gap-4">
      <div class="card bg-base-200">
        <div class="card-body">
          <h3 class="card-title {data.status.main ? 'text-success' : 'text-error'}">main</h3>

          <p>
            uptime: {MStoTime(data.status.uptime)}
          </p>

          {#if data.status.load}
            <p>load: {data.status.load}</p>
          {/if}
        </div>
      </div>

      <div class="card bg-base-200">
        <div class="card-body">
          <h3 class="card-title {data.database.online ? 'text-success' : 'text-error'}">
            database
          </h3>

          <p class="text-xs lg:text-base">query: {data.database.latency.toFixed(2)}ms</p>
        </div>
      </div>
    </div>

    <div class="divider">clusters</div>

    <div class="grid w-full grid-cols-2 gap-4 lg:grid-cols-3">
      {#each data.status.clusters as cluster}
        <Cluster selected={guild?.cluster?.id === cluster.id} clusterData={cluster}></Cluster>
      {/each}
    </div>

    <div class="divider">shards</div>

    <div class="grid w-full grid-cols-2 gap-4 lg:grid-cols-3">
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

<!-- <div class="flex w-full justify-center text-center">
  <h3 class="mt-8 text-lg font-semibold text-gray-300">clusters</h3>

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
</div> -->
