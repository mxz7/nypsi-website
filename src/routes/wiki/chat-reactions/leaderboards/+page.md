<script>
  import DocsTemplate from "$lib/components/wiki/DocsTemplate.svelte"
  import DocsHeader from '$lib/components/wiki/DocsHeader.svelte';
</script>

<DocsTemplate title='chat reactions leaderboards' description="chat reactions leaderboards: learn how to track, view, and reset server and global chat reaction stats using nypsi commands for your discord server." />

<DocsHeader header='h2' text="types of chat reaction leaderboards" />

<DocsHeader header='h3' text="server stats" />

first of all, there are your server leaderboards which track stats for your servers only. you can
access this with `$cr lb`

these stats can be reset by server admins at any time and are not related to anything outside of the
server.

<DocsHeader header='h3' text="speed stats" />

speed statistics are only affected by **randomly started chat reactions**. to view the leaderboard
you can do `$top cr/crdaily (global)`.

when you get a new leaderboard position nypsi will notify you with a message in chat

<DocsHeader header='h2' text="resetting server leaderboards" />

to reset your server's leaderboards, use `$cr stats reset`
