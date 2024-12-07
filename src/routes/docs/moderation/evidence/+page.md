<script>
  import DocsTemplate from "$lib/components/docs/DocsTemplate.svelte"
  import DocsHeader from '$lib/components/docs/DocsHeader.svelte';
</script>

<DocsTemplate title='evidence' />

evidence is a system that allows moderators to upload evidence to a nypsi moderation case

<DocsHeader header='h2' text="what's the point?" />

instead of uploading your evidence to discord in a channel, this will ensure that your evidence is
never deleted, unless you delete it. it is also directly attached to the case, accessible by
clicking a button after using the `$case` command, which means less context switching if you keep
your evidence in a specific channel

<DocsHeader header='h2' text="secure storage" />

evidence is stored in a secure object storage bucket with a long name of random characters.

<DocsHeader header='h2' text="adding evidence to a case" />

when you do the `$case` command, there will be an evidence button to either view evidence, or to add
evidence.

<DocsHeader header='h2' text="getting more storage" />

to get more storage you can contact `@m.axz` on discord.
