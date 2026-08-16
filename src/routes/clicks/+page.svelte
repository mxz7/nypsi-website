<script lang="ts">
  import { getClickUpdates, type ClickRow } from "$lib/api/clicks.remote";
  import Card from "$lib/components/ui/card.svelte";
  import Main from "$lib/components/ui/main.svelte";
  import { onMount } from "svelte";
  import { flip } from "svelte/animate";
  import { slide } from "svelte/transition";

  const clickUpdates = getClickUpdates();
  const initialUpdate = await clickUpdates;

  if (initialUpdate.type !== "snapshot") throw new Error("click stream did not return a snapshot");

  let clicks: ClickRow[] = $state(initialUpdate.snapshot.clicks);
  let globalClicks = $state(initialUpdate.snapshot.globalClicks);
  let users = $state(initialUpdate.snapshot.users);

  function applyClick(row: ClickRow) {
    clicks = [row, ...clicks.filter((entry) => entry.key !== row.key)].slice(0, 25);
  }

  onMount(() => {
    const iterator = clickUpdates[Symbol.asyncIterator]();
    let active = true;

    const consumeUpdates = async () => {
      while (active) {
        const { value: update, done } = await iterator.next();
        if (done || !active) break;

        if (update.type === "snapshot") {
          clicks = update.snapshot.clicks;
          globalClicks = update.snapshot.globalClicks;
          users = update.snapshot.users;
        } else {
          applyClick(update.row);
          globalClicks += 1;
          if (update.row.clicks === 1) users += 1;
        }
      }
    };

    void consumeUpdates().catch(() => {});

    return () => {
      active = false;
      void iterator.return?.();
    };
  });
</script>

<svelte:head>
  <title>latest clicks | nypsi</title>
  <meta name="description" content="watch nypsi clicks update live" />
  <meta name="og:title" content="latest clicks | nypsi" />
</svelte:head>

<Main class="max-w-2xl pb-12">
  <header class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <h1 class="text-3xl font-bold text-white">latest clicks</h1>
    </div>

    <div class="text-base-content/50 flex items-center gap-2 text-xs" aria-live="polite">
      {#if clickUpdates.connected}
        <span class="inline-grid *:[grid-area:1/1]" aria-hidden="true">
          <span class="status status-success animate-ping"></span>
          <span class="status status-success"></span>
        </span>
      {:else}
        <span class="status status-warning" aria-hidden="true"></span>
      {/if}
      {clickUpdates.connected ? "updating live" : "reconnecting"}
    </div>
  </header>

  <Card mode="section" class="mt-6 overflow-hidden p-0">
    <div class="stats stats-horizontal w-full bg-transparent">
      <div class="stat place-items-center border-r border-base-300 px-4 py-4">
        <div class="stat-title text-xs">global clicks</div>
        <div class="stat-value text-2xl">{globalClicks.toLocaleString()}</div>
      </div>

      <div class="stat place-items-center px-4 py-4">
        <div class="stat-title text-xs">users</div>
        <div class="stat-value text-2xl">{users.toLocaleString()}</div>
      </div>
    </div>
  </Card>

  <Card mode="section" class="mt-3 overflow-hidden p-2">
    <ul class="list" aria-live="polite">
      {#each clicks as entry (entry.key)}
        <li
          class="list-row border-base-300 rounded-none border-b px-3 py-3 last:border-b-0"
          in:slide={{ duration: 180 }}
          animate:flip={{ duration: 180 }}
        >
          {#if entry.avatar}
            <div class="avatar">
              <div class="w-11 rounded-full">
                <img
                  src={entry.avatar}
                  alt=""
                  width="44"
                  height="44"
                  decoding="async"
                  onerror={(event) =>
                    ((event.currentTarget as HTMLImageElement).src =
                      "https://cdn.discordapp.com/embed/avatars/0.png")}
                />
              </div>
            </div>
          {/if}

          <div class="list-col-grow min-w-0">
            {#if entry.userId}
              <a class="link-hover block truncate font-semibold" href="/users/{entry.userId}">
                {entry.username}
              </a>
            {:else}
              <a
                class="link-hover text-base-content/60 block truncate font-semibold"
                href="/wiki/economy/user-settings/hidden"
              >
                {entry.username}
              </a>
            {/if}
          </div>

          <span
            class="text-base-content/50 self-center whitespace-nowrap text-right text-xs tabular-nums"
          >
            {entry.clicks.toLocaleString()} total clicks
          </span>
        </li>
      {/each}
    </ul>
  </Card>
</Main>
