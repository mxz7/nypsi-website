<script>
  import DocsTemplate from "$lib/components/docs/DocsTemplate.svelte"
  import DocsHeader from '$lib/components/docs/DocsHeader.svelte';
</script>

<DocsTemplate title='chat filter' />

<DocsHeader header='h2' text="adding/removing from the chat filter" anchor="adding-removing-from-the-chat-filter" />

to add to the chat filter you would use `$filter + <filtered word>`

likewise to remove, you would use `$filter - <filtered word>`

<DocsHeader header='h2' text="percentage matching" />

nypsi is a bit unique and uses a 'percentage matching' algorithm to attempt to catch people trying to sneakily evade filtered words. it isn't perfect and _will_ take some tuning to get right for your server. note that this only works on words in the chat filter that are **one word**, meaning they don't have a space character.

to change the percentage match, use `$filter match <percentage>`

<DocsHeader header='h3' text="disabling" />

use `$filter match 100` to only filter exact matches.

<DocsHeader header='h2' text="testing the filter" />

you can test the filter with `$filter test <phrase>`, this will allow you to easily test and perfect your percentage match

<DocsHeader header='h2' text="caveats" />

when a user message has more than 69 words (spaces), there will be no fancy similarity checking. just a simple raw includes check. this is due to performance limitations.
