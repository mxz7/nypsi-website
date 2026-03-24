<script lang="ts">
  import { page } from "$app/state";
  import { createFilter } from "./page.remote";
  import Table from "./Table.svelte";

  let { data } = $props();

  createFilter.fields.match.set(100);
</script>

<svelte:head>
  <title>{data.guild.name} chat filter | nypsi</title>
</svelte:head>

<h1 class="flex items-center gap-3 text-3xl font-bold text-white">
  <img
    src={data.guild.icon
      ? `https://cdn.discordapp.com/icons/${data.guild.id}/${data.guild.icon}`
      : "https://cdn.discordapp.com/avatars/678711738845102087/cb2dcd61010f2b89ceb1cd5ff15816cf.png?size=256"}
    alt=""
    class="h-12 w-12 rounded-xl"
  />
  <span>{data.guild.name} chat filter</span>
</h1>

<form {...createFilter} class="-order-1 mt-4 flex w-full flex-col gap-2 lg:order-1 lg:max-w-xs">
  <h2 class="text-lg font-bold">add to filter</h2>

  <input {...createFilter.fields.guildId.as("hidden", page.params.guildId)} />

  <label class="floating-label">
    <span>word</span>
    <input
      placeholder="word"
      class="input input-bordered w-full"
      {...createFilter.fields.content.as("text")}
    />
  </label>

  {#each createFilter.fields.content.issues() as issue}
    <p class="text-error">{issue.message}</p>
  {/each}

  <input
    class="input input-bordered w-full"
    inputmode="numeric"
    defaultValue={100}
    {...createFilter.fields.match.as("number")}
  />

  {#each createFilter.fields.match.issues() as issue}
    <p class="text-error">{issue.message}</p>
  {/each}

  <button
    class="btn {createFilter.pending ? 'btn-disabled' : ''}"
    disabled={!!createFilter.pending}
  >
    {#if createFilter.pending}
      <span class="loading loading-spinner"></span>
    {:else}
      add
    {/if}
  </button>
</form>

{#if data.filter.length > 0}
  <Table filter={data.filter} />
{:else}
  <div class="bg-base-200 text-error mt-4 h-fit w-full rounded-lg p-4 text-center">
    <p>no filter items</p>
  </div>
{/if}
