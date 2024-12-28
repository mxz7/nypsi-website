<script lang="ts">
  import { superForm } from "sveltekit-superforms";
  import Table from "./Table.svelte";

  let { data } = $props();

  const { form, errors, submitting, enhance } = superForm(data.newFilterForm);
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

<div class="flex w-full gap-8">
  <Table chatFilter={data.filter} />
  <form method="post" class="mt-4 flex flex-col gap-2" use:enhance>
    <label class="form-control w-full max-w-xs">
      <div class="label">
        <span class="label-text">add to filter</span>
      </div>
      <input
        type="text"
        placeholder="word"
        class="input input-bordered w-full max-w-xs"
        name="content"
        bind:value={$form.content}
      />
    </label>

    <input
      type="number"
      defaultValue="100"
      max="100"
      min="1"
      class="input input-bordered w-full max-w-xs"
      name="match"
      bind:value={$form.match}
    />

    {#if $errors.content}
      <p class="text-error">{$errors.content[0]}</p>
    {/if}

    {#if $errors.match}
      <p class="text-error">{$errors.match[0]}</p>
    {/if}

    <button class="btn {$submitting ? 'btn-disabled' : ''}" disabled={$submitting}>
      {#if $submitting}
        <span class="loading loading-spinner"></span>
      {:else}
        add
      {/if}
    </button>
  </form>
</div>
