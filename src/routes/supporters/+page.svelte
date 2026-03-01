<script>
  import Card from "$lib/components/ui/Card.svelte";
  import Main from "$lib/components/ui/Main.svelte";
  import parseEmoji from "$lib/functions/parseEmoji";
  import { tags } from "$lib/state.svelte";
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

<Main class="max-w-6xl">
  <Card mode="section">
    <h1 class="flex items-center gap-4 text-4xl font-semibold text-white">
      <span class="bg-base-300 rounded-box p-2">
        <BadgeDollarSign size={32} class="text-primary" />
      </span>

      <span>supporters</span>
    </h1>

    <p class="text-base-content/75 text-sm">these members have donated real money to nypsi</p>

    <ol class="mt-4 grid grid-cols-3 gap-3 text-sm sm:grid-cols-4 lg:grid-cols-5">
      {#each data.supporters as supporter}
        <li>
          <a
            class="link-hover flex min-w-0 items-center text-ellipsis whitespace-nowrap"
            href="/users/{supporter.id}"
          >
            {#if supporter.tagId}
              <span
                class="tooltip mr-1 flex items-center"
                data-tip={data.tags[supporter.tagId]?.name}
              >
                [
                <img
                  class="h-4 w-4 object-contain"
                  height="32"
                  width="32"
                  src={parseEmoji(data.tags[supporter.tagId]?.emoji)}
                  alt=""
                  decoding="async"
                />
                ]
              </span>
            {/if}
            <span class="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
              >{supporter.username}</span
            >
          </a>
        </li>
      {/each}
    </ol>
  </Card>

  <Card mode="section" class="mt-16">
    <h2 class="flex items-center gap-4 text-4xl font-semibold text-white">
      <span class="bg-base-300 rounded-box p-2">
        <Code size={32} class="text-primary" />
      </span>
      <span>contributors</span>
    </h2>

    <p class="text-base-content/75 text-sm">
      these members have added features to the bot or website
    </p>

    <ol class="mt-4 grid grid-cols-3 gap-3 text-sm sm:grid-cols-4 lg:grid-cols-5">
      {#each data.contributors as supporter}
        <li>
          <a
            class="link-hover flex items-center text-ellipsis whitespace-nowrap"
            href="/users/{supporter.id}"
          >
            {#if supporter.Tags[0]?.tagId}
              <span
                class="tooltip mr-1 flex items-center"
                data-tip={data.tags[supporter.Tags[0].tagId]?.name}
              >
                [
                <img
                  class="h-4 w-4 object-contain"
                  height="32"
                  width="32"
                  src={parseEmoji(data.tags[supporter.Tags[0].tagId]?.emoji)}
                  alt=""
                  decoding="async"
                />
                ]
              </span>
            {/if}
            <span class="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
              >{supporter.lastKnownUsername}</span
            >
          </a>
        </li>
      {/each}
    </ol>
  </Card>
</Main>
