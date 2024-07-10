<script>
  import parseEmoji from "$lib/functions/parseEmoji";
  import tooltip from "$lib/Tooltips";
  import { BadgeDollarSign, Code } from "lucide-svelte";

  export let data;
</script>

<svelte:head>
  <title>supporters / nypsi</title>
</svelte:head>

<div class="mt-8 flex w-full justify-center">
  <div class="w-full px-4 lg:max-w-5xl lg:px-0">
    <h1 class="flex items-center gap-4 text-4xl font-semibold text-white">
      <BadgeDollarSign size={32} />
      <span>supporters</span>
    </h1>
    <p class="text-sm opacity-50">these members have donated real money to nypsi</p>

    <div class="mt-4 flex flex-wrap gap-3 text-sm">
      {#each data.supporters as supporter}
        <a class="flex items-center duration-300 hover:text-white" href="/user/{supporter.id}">
          {#if supporter.Tags[0]?.tagId}
            <span>[</span>
            <img
              class="h-4"
              src={parseEmoji(data.tags[supporter.Tags[0].tagId]?.emoji)}
              alt=""
              use:tooltip={{
                placement: "top",
                content: data.tags[supporter.Tags[0].tagId]?.name,
                followCursor: true,
              }}
            />
            <span class="mr-1">]</span>
          {/if}
          <span>{supporter.lastKnownUsername}</span>
        </a>
      {/each}
    </div>

    <h2 class="mt-14 flex items-center gap-4 text-4xl font-semibold text-white">
      <Code size={32} />
      <span>contributors</span>
    </h2>
    <p class="text-sm opacity-50">these members have added features to the bot or website</p>

    <div class="mt-4 flex flex-wrap gap-3 text-sm">
      {#each data.contributors as supporter}
        <a class="flex items-center duration-300 hover:text-white" href="/user/{supporter.id}">
          {#if supporter.Tags[0]?.tagId}
            <span>[</span>
            <img
              class="h-4"
              src={parseEmoji(data.tags[supporter.Tags[0].tagId]?.emoji)}
              alt=""
              use:tooltip={{
                placement: "top",
                content: data.tags[supporter.Tags[0].tagId]?.name,
                followCursor: true,
              }}
            />
            <span class="mr-1">]</span>
          {/if}
          <span>{supporter.lastKnownUsername}</span>
        </a>
      {/each}
    </div>
  </div>
</div>
