<script>
  import DocsTemplate from "$lib/components/docs/DocsTemplate.svelte"
  import DocsHeader from '$lib/components/docs/DocsHeader.svelte';
</script>

<DocsTemplate title='chat reactions word lists' description="customize nypsi chat reactions with monkeytype english word lists or your own. learn commands to add, remove, reset, and manage your chat word lists." />

<DocsHeader header='h2' text="default" />

by default nypsi will use the english_1k word list from [monkeytype](https://monkeytype.com).

nypsi also comes with english_5k and english_10k from monkeytype, which you can easily change to

<DocsHeader header='h2' text="changing the word list type" />

to change the word list type, you can use the command below. if the word list is set to custom, but
the word list is empty, it will revert back to using english_1k

_if you want to use a custom word list, the type must be set to 'custom'_

```
$cr words type
```

<DocsHeader header='h2' text="adding to word list" />

to add to the server's custom word list, use the below command

```
$cr words add <word>
```

<DocsHeader header='h2' text="removing from word list" />

to remove from the server's custom word list, use the below command

```
$cr words del <word>
```

<DocsHeader header='h2' text="viewing the word list" />

to view the current word list, use the command below

```
$cr words list
```

<DocsHeader header='h2' text="resetting the word list" />

if you'd like to delete everything from your custom word list, use the command below

```
$cr words reset
```
