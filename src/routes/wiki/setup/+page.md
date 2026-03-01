<script>
  import DocsTemplate from "$lib/components/docs/DocsTemplate.svelte"
  import DocsHeader from '$lib/components/docs/DocsHeader.svelte';
</script>

<DocsTemplate title='setting up nypsi for your server' description="set up nypsi discord bot for your server with easy guides on commands, moderation, chat filters, and customization. start managing your community today!" />

congratulations on using nypsi!!! the best discord bot. of course. this page is to help you get set up and configure nypsi for your server the way you want.

<DocsHeader header='h2' text="inviting nypsi" />

if you haven't already, a good start would be to invite nypsi to your server. you can do that [here](/invite)

<DocsHeader header='h2' text="slash commands vs prefix commands" />

prefix commands are the 'old' way of using discord bots, where you would use some sort of symbol (nypsi uses $ by default), and then the command. discord introduced the very official method of doing commands called 'slash commands. a lot of discord users don't like using slash commands, since they're slower and bulkier than prefix commands. the upside is that they're great for complex commands, as they have autocomplete!!!

if you decide to not want to allow prefix commands to be used at all, you can disable them with the slash commands only mode. use `/settings server slash-only` to customise this.

if you want to allow prefix commands, it may be a good idea to choose different or multiple prefixes, depending on the other bots in your server or just whatever you prefer. prefixes can be customised with `$prefix`.

nypsi doesn't allow users to use prefixes for _some_ commands, an example of this is `/tmdb`. this is because it is WAY easier to use the slash command variant. in a lot of cases, it will still work if you do the prefix command version, but it's a lot of guessy work as it wasn't intended.

<DocsHeader header='h2' text="disabling commands" />

if you don't want your server members to be able to use certain commands in your server, you can disable them with the `$disable` command. this gets a little funky since you use the same command to then enable them again. it works in a very similar fashion to the prefix command.

to stop the slash command variant coming up, you'll have to change that in your discord server settings.

<DocsHeader header='h2' text="disabling channels" />

you can stop nypsi from allowing users to do commands in certain channels of your server. you can customise the list of disabled channels with `/settings server disabled-channels`.

any members with the **manage messages** permission will still be able to bypass this, and be able to use commands in the disabled channels.

<DocsHeader header='h2' text="moderation" />

if you don't intend on using nypsi for moderation, you can skip this section.

nypsi has quite a decent moderation system that should be perfectly fine for _most_ servers, however if you have a large server, a lot of members / staff with very advanced needs. nypsi may not work for you, moderation-wise.

<DocsHeader header='h3' text="moderation logs" />

first of all, a good idea would be to get moderation logs (modlogs) set up and working. this is easily done with `$modlogs`. the channel will then receive a feed of most moderation actions: bans, kicks, warns, mutes etc.

<DocsHeader header='h3' text="mute role" />

the mute role can also be another common thing to customise. allowing you to designate a different or customised role to mute users with.

[click here for specific mute role information](/docs/moderation/muterole)

<DocsHeader header='h3' text="chat filter" />

nypsi's chat filter, is as i would describe it, "medium powerful". it's pretty good, better than just a: if message content includes (filtered message) -> delete.

you're able to use string similarity to prevent people from trying to get around the filter by using different spelling variations. people will of course still get around it no matter what. you can never stop that. but it will help a lot.

[click here for specific chat filter information](/docs/moderation/chat-filter)

<DocsHeader header='h3' text="auto mute" />

auto mutes work with the chat filter. nypsi will mute people in accordance to the automute settings. it's quite powerful in the way that you're able to use a _violations type system_, where you can give users an increasingly longer mute, and customise how long it takes for the violation level to expire.

[click here for specific auto mute information](/docs/moderation/auto-mute)

<DocsHeader header='h3' text="alt punishments" />

now, a pretty cool feature of nypsi is to be able to group accounts together. it's quite common for discord users to use alt accounts to bypass punishments. this allows you to fight that.

if you're aware of a user's alts, you can group them together with the `$alts` command.

[click here for specific alt punishments information](/docs/moderation/alt-punish)

<DocsHeader header='h3' text="evidence" />

nypsi allows you to attach evidence to moderation case. 'evidence' being an image of some sort, probably a screenshot. this can be useful when managing a medium-large server and need to keep track of evidence of punishments.

[click here for specific evidence information](/docs/moderation/evidence)

<DocsHeader header='h2' text="further reading" />

this should be a lot of the essential information, but nypsi can do more for your server:

- [birthdays](/docs/birthdays)
- [chat reactions](/docs/chat-reactions/setup)
- [reaction roles](/docs/reaction-roles)
- custom countdowns ($countdown)
- christmas countdown ($christmas)
- channel counters ($counter)
