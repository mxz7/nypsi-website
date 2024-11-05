<script>
  import DocsTemplate from "$lib/components/docs/DocsTemplate.svelte"
</script>

<DocsTemplate title='chat filter' />

## adding/removing from the chat filter

to add to the chat filter you would use `$filter + <filtered word>`

likewise to remove, you would use `$filter - <filtered word>`

## percentage matching

nypsi is a bit unique and uses a 'percentage matching' algorithm to attempt to catch people trying to sneakily evade filtered words. it isn't perfect and _will_ take some tuning to get right for your server. note that this only works on words in the chat filter that are **one word**, meaning they don't have a space character.

to change the percentage match, use `$filter match <percentage>`

### disabling

use `$filter match 100` to only filter exact matches.

## testing the filter

you can test the filter with `$filter test <phrase>`, this will allow you to easily test and perfect your percentage match
