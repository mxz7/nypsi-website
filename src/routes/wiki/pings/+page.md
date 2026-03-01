<script>
  import DocsTemplate from "$lib/components/docs/DocsTemplate.svelte"
  import DocsHeader from '$lib/components/docs/DocsHeader.svelte';
</script>

<DocsTemplate title='pings' description="pings and mentions in nypsi are tracked more reliably than discord's native system, with saved notifications, secure encrypted message previews, and support details for servers of different sizes." />

pings / mentions works by saving messages in servers that are qualified to the database. nypsi can then retrieve these to show you your notifications. this is wayyy more reliable than how discord does it, where your notifications are often out of order or even just straight up missing.

<DocsHeader header='h2' text="my server does not qualify to track mentions" />

this means that your server is either too large (> 150,000 members), or the server owner has not used nypsi in a while. if you have too many members and want to use this feature, please contact me (`@m.axz`), otherwise, ask the server owner to do some commands.

<DocsHeader header='h2' text="all servers is missing a server" />

this is because nypsi is not in that server, nypsi cannot track mentions of a server that nypsi isn't in. perhaps convince the server admins to add nypsi 😏. [invite link](https://nypsi.xyz/invite)

<DocsHeader header='h2' text="security" />

the (short) message preview is encrypted before entering the database, preventing anyone with just the database from accessing and reading these messages.
