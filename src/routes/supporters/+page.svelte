<script>
  import parseEmoji from "$lib/functions/parseEmoji";
  import { tags } from "$lib/state.svelte";
  import tooltip from "$lib/Tooltips";
  import { BadgeDollarSign, Code } from "@lucide/svelte";
  import { onMount } from "svelte";

  let { data } = $props();

  onMount(() => {
    tags.value = data.tags;
  });
</script>

<svelte:head>
  <title>supporters | nypsi</title>
  <meta name="og:title" content="nypsi supporters" />

  <meta name="description" content={data.supporters.map((i) => i.username).join(", ")} />
</svelte:head>

<div class="mt-8 flex w-full justify-center">
  <main class="w-full px-4 lg:max-w-5xl lg:px-0">
    <h1 class="flex items-center gap-4 text-4xl font-semibold text-white">
      <BadgeDollarSign size={32} />
      <span>supporters</span>
    </h1>
    <p class="text-sm opacity-50">these members have donated real money to nypsi</p>

    <ol class="mt-4 grid grid-cols-3 gap-3 text-sm sm:grid-cols-4 lg:grid-cols-5">
      {#each data.supporters as supporter}
        <li>
          <a
            class="link-hover flex min-w-0 items-center overflow-hidden text-ellipsis whitespace-nowrap"
            href="/users/{supporter.id}"
          >
            {#if supporter.tagId}
              <span
                class="user-tag"
                use:tooltip={{
                  placement: "top",
                  content: data.tags[supporter.tagId]?.name,
                  followCursor: true,
                }}
              >
                <img
                  class="h-4 w-4 object-contain"
                  height="32"
                  width="32"
                  src={parseEmoji(data.tags[supporter.tagId]?.emoji)}
                  alt=""
                  decoding="async"
                />
              </span>
            {/if}
            <span class="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
              >{supporter.username}</span
            >
          </a>
        </li>
      {/each}
    </ol>

    <h2 class="mt-14 flex items-center gap-4 text-4xl font-semibold text-white">
      <Code size={32} />
      <span>contributors</span>
    </h2>
    <p class="text-sm opacity-50">these members have added features to the bot or website</p>

    <ol class="mt-4 grid grid-cols-3 gap-3 text-sm sm:grid-cols-4 lg:grid-cols-5">
      {#each data.contributors as supporter}
        <li>
          <a
            class="link-hover flex items-center overflow-hidden text-ellipsis whitespace-nowrap"
            href="/users/{supporter.id}"
          >
            {#if supporter.Tags[0]?.tagId}
              <span
                class="user-tag"
                use:tooltip={{
                  placement: "top",
                  content: data.tags[supporter.Tags[0].tagId]?.name,
                  followCursor: true,
                }}
              >
                <img
                  class="h-4 w-4 object-contain"
                  height="32"
                  width="32"
                  src={parseEmoji(data.tags[supporter.Tags[0].tagId]?.emoji)}
                  alt=""
                  decoding="async"
                />
              </span>
            {/if}
            <span class="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
              >{supporter.lastKnownUsername}</span
            >
          </a>
        </li>
      {/each}
    </ol>
  </main>
</div>

<style>
  @reference "../../app.css";

  .user-tag {
    @apply mr-1 flex items-center;
  }

  .user-tag::before {
    content: "[";
  }

  .user-tag::after {
    content: "]";
  }
</style>
