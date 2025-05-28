<script>
  import DocsTemplate from "$lib/components/docs/DocsTemplate.svelte"
  import DocsHeader from '$lib/components/docs/DocsHeader.svelte';
</script>

<DocsTemplate title='moderation cases' description="manage discord moderation cases: view case data, top staff stats, delete all cases, mark cases as deleted, and see user punishment history with simple commands" />

<DocsHeader header='h2' text="case data" />

when a moderation case is created, the staff member (actor)'s tag is stored in the case, instead of their ID. this means that
if the staff member is to change their discord name, that will not be reflected on the moderation case.

this decision was made so that if a staff member were to leave, there is still context for the case, instead of a user ID
being shown.

```
/case <case ID>
```

the command above allows you to view information about a case

<DocsHeader header='h2' text="cases stats" />

the top cases command for staff members filters data by the staff's tag, for the reason explained above. this means that if a
staff member is to change their name, their top cases stats will not be updated.

```
$topcases
```

top cases can be used to show the staff members that are handing out the most punishments, as well as showing the members
that are receiving the most punishments.

<DocsHeader header='h2' text="deleting all cases" />

if you would like to delete all cases for your server (restart moderation data), the server owner must run the command below.

```
$dac
```

a confirmation message will then be shown to prevent any accidental resets. please note that this is irreversible.

<DocsHeader header='h2' text="deleting a single case" />

deleting a single case entirely is not possible, however, it is marked as being deleted, and is shown as deleted in a user's
punishment history. to do this, use the `/case` command to view the case, then press the delete button to mark the case as
deleted. please not that this is irreversible.

<DocsHeader header='h2' text="punishment history" />

```
/history <user>
```

this command shows the target user's punishment history
