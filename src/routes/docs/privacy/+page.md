<script>
  import DocsTemplate from "$lib/components/docs/DocsTemplate.svelte"
  import DocsHeader from '$lib/components/docs/DocsHeader.svelte';
</script>

<DocsTemplate title='privacy policy' description="nypsi discord bot privacy policy detailing what user and guild data is stored, usage, logging, how to view or delete your data, and contact information for data-related requests." />

<DocsHeader header='h2' text="Storing of Data" />

Data can be stored in the database, this is called **persistent data**. Data can also be stored in temporary memory via Redis database or process memory.

The information below refers to **persistent data** only.

<DocsHeader header='h2' text="Usage of Data" />

The bot may use stored data for certain features provided by the service.
This data is not shared with any third party services.
Your data may be viewed by bot staff members for debugging and moderation.

<DocsHeader header='h2' text="What is stored?" />

<DocsHeader header='h3' text="Guilds" />

- Guild ID
- Member Peaks
- Punishments when done so through moderation commands

<DocsHeader header='h3' text="Users" />

- User ID
- Username
- Avatar
- Mention Data
- Username History
- Commands usage
- IP Address
- Email

<DocsHeader header='h4' text="Private Information Concerns" />

<DocsHeader header='h5' text='Email' />

Your email is only stored when the user supplies it with `/settings me email`, or when buying something from the online store. If you do not do this command or buy anything from the store, your email will never be stored in the database.

Emails are needed to send purchased items to the correct account, when buying something on Ko-fi, you are asked for your email which is sent to us, which we then use to pair that purchase to an account.

<DocsHeader header='h5' text='IP Address' />

Storing an IP Address may sound concerning, but is already stored by most websites. It's used internally to match accounts together to prevent punishment evasions. If not for these users, it wouldn't be necessary.

Only the highest level and most trusted staff members can view IP addresses for debugging purposes.

<DocsHeader header='h3' text="Updating Data" />

The data mentioned and data that has not been mentioned may be automatically updated upon user
interaction or through websocket events

<DocsHeader header='h3' text="Mentions" />

To provide functionality to one of the bot's features, messages that mention (@) nypsi users
will be stored in the database.

The message content is truncated and encrypted thus cannot be read without the decryption key
which is stored on a different server

<DocsHeader header='h3' text="Logs" />

Information about what commands you do may be logged for debugging and moderation purposes.
These logs will be stored for no longer than 90 days.

<DocsHeader header='h2' text="Your Rights" />

<DocsHeader header='h3' text="Viewing" />

You can safely view your data at any time with the command `/data request`. This will fetch all of the data regarding your account, except for data that may include other users' information.

<DocsHeader header='h3' text="Deletion" />

A user can request their data deletion via the command `/data delete`. The only exemption to this is under the rare occasion that a user is blacklisted, meaning we must keep a record of their user ID to prevent access to our services.

Please note that his cannot be undone.

To request deletion of guild data, please use the contact details below

<DocsHeader header='h3' text="Transfer" />

On rare occasions, data can be transferred to alternate Discord accounts. This is only used in
specific rare circumstances, as things could go wrong.

Not everything can be transferred.

<DocsHeader header='h2' text="Contact" />

Discord: @m.axz. Alternatively, DM nypsi to create a support ticket to talk to staff members.
