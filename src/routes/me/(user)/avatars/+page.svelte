<script lang="ts">
  import DeleteButton from "./DeleteButton.svelte";

  let { data } = $props();
</script>

<svelte:head>
  <title>avatar history | nypsi</title>
</svelte:head>

<h1 class="text-center text-3xl font-bold text-white">avatar history</h1>

{#if !data.levelCheck}
  <p class="text-error">you are not a high enough level for avatar tracking</p>
{/if}

{#if !data.tracking}
  <p class="text-error">you have tracking disabled</p>
{/if}

<div class="mt-4 grid w-full grid-cols-2 gap-3 md:grid-cols-4">
  {#each data.avatars as avatar}
    <div class="rounded-box bg-base-200 p-3 pb-1">
      <img
        src={avatar.value}
        alt=""
        class="rounded-box w-full"
        loading="lazy"
        decoding="async"
        height="256"
        width="256"
      />

      <div class="flex w-full items-center pt-1">
        <p class="btn btn-xs text-xs font-normal text-slate-400">
          {avatar.createdAt.toLocaleDateString()}
        </p>
        <div class="grow"></div>
        <DeleteButton {avatar} />
      </div>
    </div>
  {/each}
</div>
