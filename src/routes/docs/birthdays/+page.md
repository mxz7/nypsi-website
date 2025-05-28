<script>
  import DocsTemplate from "$lib/components/docs/DocsTemplate.svelte"
  import DocsHeader from '$lib/components/docs/DocsHeader.svelte';
</script>

<DocsTemplate title='birthdays' description="learn how to set, change, or manage your birthday, privacy, and birthday announcement channels in nypsi using easy slash commands." />

<DocsHeader header='h2' text='setting your birthday' />

to set your birthday use `/birthday set YYYY-MM-DD`, you will then be asked to double check and make
sure that it is correct.

<DocsHeader header='h2' text='i set the wrong birthday' />

if you have set the wrong birthday, you'll have to contact support by sending nypsi a DM and
explaining what you need help with. you may need to show proof of you real birthday to be able to
have your birthday changed.

<DocsHeader header='h2' text="i don't want my birthday to be announced" />

you can use `/birthday toggle` to toggle whether your birthday will be announced in servers or not.

<DocsHeader header='h2' text="setting a birthday announcement channel" />

for this you must have the `manage server` permission. use `/birthday channel #channel` to set the
birthday channel.

<DocsHeader header='h2' text="disabling the birthday announcement channel" />

use `/birthday disable` to disable birthday announcements in your server.
