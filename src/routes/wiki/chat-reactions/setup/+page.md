<script>
  import DocsTemplate from "$lib/components/wiki/DocsTemplate.svelte"
  import DocsHeader from '$lib/components/wiki/DocsHeader.svelte';
</script>

<DocsTemplate title='chat reactions setup' description="setup, customize, and manage chat reactions with commands: enable auto reactions, adjust cooldowns, set channels, and track stats for your server." />

<DocsHeader header='h2' text="enabling automatic start" />

running the command below will enable automatic chat reactions in the current channel, if you have
not changed any of the settings, it will use the default settings.

```
$cr settings enable
```

<DocsHeader header='h2' text="starting a chat reaction manually" />

you can start a chat reaction manually with `$cr start`. this will still track towards statistics
and the chat reactions leaderboard (`$cr lb`), but will not track towards speed leaderboards
(`$top cr (daily)`)

<DocsHeader header='h2' text="setting the channels" />

_to use multiple channels for chat reactions you must have a premium membership_

you can use the command below to enable/disable it for a channel. it acts as a toggle

```
$cr settings channel #cmds
```

<DocsHeader header='h2' text="changing the cooldown" />

the cooldown is the **base** delay in seconds between chat reactions happening across your server.

default: 300

```
$cr settings cooldown 300
```

<DocsHeader header='h2' text="changing the offset" />

the offset is the maximum amount of seconds that can be added or subtracted from the base delay.

default: 60

```
$cr settings offset 60
```

<DocsHeader header='h2' text="changing the max game length" />

the max game length is how long it will take in seconds without any response for the game to end

default: 60

```
$cr settings length 60
```
