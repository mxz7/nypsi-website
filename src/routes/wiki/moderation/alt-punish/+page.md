<script>
  import DocsTemplate from "$lib/components/wiki/DocsTemplate.svelte"
  import DocsHeader from '$lib/components/wiki/DocsHeader.svelte';
</script>

<DocsTemplate title='automatic alt punishments' description="automatic alt punishments link user accounts so all are penalized if one is punished, helping prevent ban evasion. easy setup and alt tracking included." />

with this server setting enabled, all of a user's accounts will be punished when one account is punished. this helps prevent mute/ban evasion and the hassle of punishing multiple accounts.

<DocsHeader header='h2' text="configuration" />

by default, automatic group punishments are disabled. the server owner can enable them by using `/settings server alt-punish`.

to add alts to a user, use `$alts <user ID or tag>` and press the "add alt" button, then type the alt's user id.

you can remove alts in the same way, using the "remove alt" button instead.

<DocsHeader header='h2' text="alt list" />

`$alts` can also be used when automatic punishments are disabled. this allows for an easy way to keep track of a user's alts.
