<script>
  import DocsTemplate from "$lib/components/docs/DocsTemplate.svelte"
  import DocsHeader from '$lib/components/docs/DocsHeader.svelte';
</script>

<DocsTemplate title='FAQ' />

<DocsHeader header='h2' text="when will the karma shop be open?" />

the karma shop (`/karmashop view`) opens a few times a month. you can use the karma shop command to see when it is next scheduled to be opened. you can also join the [official nypsi server](https://discord.gg/hJTDNST), and give yourself the karma shop role, to be notified when it does open

<DocsHeader header='h2' text="my server does not qualify to track mentions" />

this means that your server is either too large (> 150,000 members), or the server owner has not used nypsi in a while. if you have too many members and want to use this feature, please contact me (`@m.axz`), otherwise, ask the server owner to do some commands.

<DocsHeader header='h2' text="how do i get vote reminders?" />

use the below command to open your notification settings. there will be a 'vote reminders' option for you to enable

```
/settings me notifications
```

<DocsHeader header='h2' text="how do i disable certain commands?" />

in order to disable a command, run the command below.

```
$disablecmd + <cmd>
```

to undo, type the following command:

```
$disablecmd - <cmd>
```

you can also enable slash command only mode, which allows you to customise which commands are allowed within your discord server settings

```
/settings server slash-only
```
