<script>
  import DocsTemplate from "$lib/components/docs/DocsTemplate.svelte"
</script>

<DocsTemplate title='reaction roles' desc='reaction roles allow you to set up buttons where members can click to receive designated roles' />

## setup

first, you must create a reaction role. to do this, you should use the **command below**. this will
start a process asking you questions to generate the initial message, such as the title, description
and channel. the title is not required, but the description and channel are.

```
/reactionroles create
```

## adding roles

to add a role once you've created a reaction role using the command above, use the command below.
the suggestions given by nypsi will assist you in choosing the correct options.

```
/reactionroles addrole <message id> <role> <label|emoji>
```

## changing mode

to change the mode of a reaction role, use the command below. possible modes: **many** **unique**.
unique will ensure that the member only has one of the available roles, while many will allow them
to have as many as they want

```
/reactionroles update <message id> mode <many|unique>
```

## updating the message

when you make a change to a reactionrole, you may notice that it doesn't update the message. you
have to use `/reactionroles send <message id>` to resend the message.

this allows you to make changes without users seeing and being disturbed by every change
