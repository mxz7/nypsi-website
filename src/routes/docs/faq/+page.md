<script>
  import DocsTemplate from "$lib/components/docs/DocsTemplate.svelte"
</script>

<DocsTemplate title='FAQ' />

## when will the karma shop be open

the karma shop (`/karmashop view`) opens a few times a month. you can use the karma shop command to see when it is next scheduled to be opened. you can also join the [official nypsi server](https://discord.gg/hJTDNST), and give yourself the karma shop role, to be notified when it does open

## how do i get vote reminders

use the below command to open your notification settings. there will be a 'vote reminders' option for you to enable

```
/settings me notifications
```

## how do i disable certain commands

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
