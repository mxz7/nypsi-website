<script>
  import DocsTemplate from "$lib/components/docs/DocsTemplate.svelte"
  import Achievements from "./achievements.svelte"
  import DocsHeader from '$lib/components/docs/DocsHeader.svelte';
</script>

<DocsTemplate title='achievements' />

achievements are goals that when completed, give you some rewards.

<DocsHeader header='h2' text="how can i see achievements?"/>

you can use the `/achievements` command to view your unlocked achievements and your progress on them. if you want to know about a particular achievement, you can use:

```
/achievements view < name of achievement >
```

this will show the details of the achievement as well as the rewards you get for completing them. there are currently 34 unique achievements in nypsi with each having 5 levels amounting to a total of 170 achievements. you can get a list of all achievements using `/achievements all`.

<DocsHeader header='h2' text="what rewards can i get from achievements?" />

achievements can give a variety of rewards including crates, scratch cards, xp and exclusive tags.

<DocsHeader header='h2' text="all achievements" />

<Achievements />
