<script lang="ts">
  import { page } from "$app/state";

  interface Props {
    tableData: {
      user: string;
      caseId: number;
      type: string;
      moderator: string;
      command: string;
    }[];
  }

  let { tableData }: Props = $props();

  const usernames = $state<{ id: string; promise: Promise<{ username?: string }> }[]>([]);

  $effect(() => {
    tableData.forEach((data) => {
      if (!usernames.find((i) => i.id === data.user)) {
        usernames.push({
          id: data.user,
          promise: fetch(`/api/users/username/${data.user}`).then((res) => res.json()),
        });
      }

      if (!usernames.find((i) => i.id === data.moderator))
        usernames.push({
          id: data.moderator,
          promise: fetch(`/api/users/username/${data.moderator}`).then((res) => res.json()),
        });
    });
  });
</script>

<div class="overflow-x-auto">
  <table class="table-zebra table">
    <!-- head -->
    <thead>
      <tr>
        <th>id</th>
        <th>moderator</th>
        <th>type</th>
        <th>target</th>
        <th>reason</th>
      </tr>
    </thead>
    <tbody>
      {#each tableData as data}
        {@const moderatorUsername = usernames.find((i) => i.id === data.moderator)}
        {@const targetUsername = usernames.find((i) => i.id === data.user)}
        <tr>
          <td>{data.caseId}</td>
          <td>
            <a href="/users/{data.moderator}" class="link-hover" target="_blank">
              {#if moderatorUsername}
                {#await moderatorUsername.promise}
                  {data.moderator}
                {:then promiseResult}
                  {#if promiseResult.username}
                    {promiseResult.username}
                  {:else}
                    {data.moderator}
                  {/if}
                {/await}
              {:else}
                {data.moderator}
              {/if}
            </a>
          </td>
          <td>{data.type}</td>
          <td>
            <a href="/users/{data.user}" class="link-hover" target="_blank">
              {#if targetUsername}
                {#await targetUsername.promise}
                  {data.moderator}
                {:then promiseResult}
                  {#if promiseResult.username}
                    {promiseResult.username}
                  {:else}
                    {data.user}
                  {/if}
                {/await}
              {:else}
                {data.user}
              {/if}
            </a>
          </td>
          <td class="text-xs">{data.command}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
<div class="mt-2 flex w-full justify-center">
  <div class="join">
    <a
      class="btn join-item"
      href="/me/guilds/{page.params.guildId}/modlogs?page={parseInt(
        page.url.searchParams.get('page') || '1',
      ) - 1 || 1}">«</a
    >
    <span class="btn join-item">page {page.url.searchParams.get("page") || "1"}</span>
    <a
      class="btn join-item"
      href="/me/guilds/{page.params.guildId}/modlogs?page={parseInt(
        page.url.searchParams.get('page') || '1',
      ) + 1}">»</a
    >
  </div>
</div>
