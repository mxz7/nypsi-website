<script lang="ts">
  import { page } from "$app/state";
  import { getPunishmentHistory } from "$lib/api/users.remote";
  import Card from "$lib/components/ui/card.svelte";
  import { Gavel } from "@lucide/svelte";

  type Punishment = Awaited<ReturnType<typeof getPunishmentHistory>>["punishments"][number];
  type RelatedUser = Punishment["moderator"];

  let currentPage = $state(1);
  let isLoading = $state(false);
  let history = $derived(await getPunishmentHistory({ userId: page.params.search, page: 1 }));

  function label(value: string) {
    return value.replaceAll("_", " ").toLowerCase();
  }

  function status(punishment: Punishment) {
    if (punishment.endedAt) return "ended";
    if (punishment.expiresAt && new Date(punishment.expiresAt).getTime() <= Date.now()) {
      return "expired";
    }
    return "active";
  }

  async function loadMore() {
    if (isLoading || !history.hasMore) return;

    isLoading = true;
    const nextPage = currentPage + 1;

    try {
      const result = await getPunishmentHistory({ userId: page.params.search, page: nextPage });
      history = {
        punishments: [...history.punishments, ...result.punishments],
        hasMore: result.hasMore,
      };
      currentPage = nextPage;
    } finally {
      isLoading = false;
    }
  }
</script>

{#snippet user(user: RelatedUser)}
  {#if user}
    <a href="/users/{user.id}" class="link link-hover flex items-center gap-2">
      <img
        class="size-6 rounded-full"
        src={user.avatar}
        alt="{user.lastKnownUsername}'s avatar"
        loading="lazy"
        decoding="async"
      />
      <span>{user.lastKnownUsername}</span>
    </a>
  {:else}
    <span class="text-base-content/60">unknown</span>
  {/if}
{/snippet}

<Card mode="section" class="overflow-x-auto shadow">
  <h2 class="mb-4 flex items-center gap-2 text-xl font-bold">
    <span class="rounded-box bg-base-300 p-2">
      <Gavel class="text-primary" />
    </span>
    <span>punishment history</span>
  </h2>

  {#if history.punishments.length === 0}
    <p class="text-base-content/70 py-6 text-center text-sm">no punishments found</p>
  {:else}
    <div class="overflow-x-auto">
      <table class="table w-full table-fixed">
        <thead>
          <tr>
            <th class="w-24">date</th>
            <th class="w-20">status</th>
            <th class="w-28">type</th>
            <th>reason</th>
            <th class="w-36">moderator</th>
            <th class="w-52">end</th>
          </tr>
        </thead>
        <tbody>
          {#each history.punishments as punishment (punishment.id)}
            {@const punishmentStatus = status(punishment)}
            <tr>
              <td class="text-base-content/75 text-xs text-nowrap">
                <time datetime={new Date(punishment.createdAt).toISOString()}>
                  {new Date(punishment.createdAt).toLocaleDateString()}
                </time>
                <span class="text-base-content/50 block">#{punishment.id.toLocaleString()}</span>
              </td>

              <td>
                <span
                  class:badge-error={punishmentStatus === "active"}
                  class:badge-warning={punishmentStatus === "expired"}
                  class:badge-info={punishmentStatus === "ended"}
                  class="badge badge-soft">{punishmentStatus}</span
                >
              </td>

              <td class="text-nowrap">
                <span class="font-medium">{label(punishment.type)}</span>
                {#if punishment.season !== null}
                  <span class="text-base-content/60 block text-xs"
                    >season {punishment.season.toLocaleString()}</span
                  >
                {/if}
              </td>

              <td class="break-words whitespace-normal">{@html punishment.reasonHtml}</td>
              <td class="break-words whitespace-normal">{@render user(punishment.moderator)}</td>

              <td class="text-sm break-words whitespace-normal">
                {#if punishment.endedAt}
                  <p>
                    {punishment.endReason ? label(punishment.endReason) : "ended"} on
                    {new Date(punishment.endedAt).toLocaleDateString()}
                  </p>
                  {#if punishment.endedBy}
                    <div class="mt-1">{@render user(punishment.endedBy)}</div>
                  {/if}
                  {#if punishment.endNote}
                    <p class="text-base-content/60 mt-1 text-xs">{punishment.endNote}</p>
                  {/if}
                {:else if punishment.expiresAt}
                  <span class="text-base-content/75">
                    expires {new Date(punishment.expiresAt).toLocaleDateString()}
                  </span>
                {:else}
                  <span class="text-base-content/60">permanent</span>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <button
      class="btn btn-soft mt-2 w-full"
      disabled={isLoading || !history.hasMore}
      onclick={loadMore}
    >
      {#if isLoading}
        <span class="loading loading-spinner loading-sm"></span>
      {:else if !history.hasMore}
        that's everything!
      {:else}
        load more
      {/if}
    </button>
  {/if}
</Card>
