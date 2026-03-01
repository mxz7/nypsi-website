<script>
  import DocsTemplate from "$lib/components/wiki/DocsTemplate.svelte"
  import DocsHeader from '$lib/components/wiki/DocsHeader.svelte';
</script>

<DocsTemplate title='chat reactions blacklist' description="manage your server's chat reactions by blacklisting users with $cr blacklist commands. view, add, or remove users easily from the blacklist." />

the chat reaction blacklist prevents a list of users in your server from competing in chat reactions

<DocsHeader header='h2' text="viewing the blacklist" />

use `$cr blacklist` to view the users on the blacklist

<DocsHeader header='h2' text="adding to the blacklist" />

use `$cr blacklist add` to add to the blacklist

<DocsHeader header='h2' text="removing from the blacklist" />

use `$cr blacklist del` to remove from the blacklist
