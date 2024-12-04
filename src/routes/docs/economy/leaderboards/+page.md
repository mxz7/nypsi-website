<script>
  import DocsTemplate from "$lib/components/docs/DocsTemplate.svelte"
  import DocsHeader from '$lib/components/docs/DocsHeader.svelte';
</script>

<DocsTemplate title='leaderboards' />

<DocsHeader header='h2' text="how are they generated?" />

the leaderboards that you can see on the [website](https://nypsi.xyz/leaderboard) and in the bot (`$top`) are generated in real time, fetching data from the database as you request it

<DocsHeader header='h2' text="stats" />

the leaderboard positions shown in `$stats lb` command is not real time information, this is updated hourly by the bot or whenever someone fetches a global leaderboard.
