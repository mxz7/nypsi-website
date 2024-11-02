<script>
  import DocsTemplate from "$lib/components/docs/DocsTemplate.svelte"
</script>

<DocsTemplate title='privacy policy' />

## Storing of Data

Data can be stored in the database, this is called **persistant data**. Data can also be stored in temporary memory via Redis database or process memory.

The information below refers to **persistant data** only.

## Usage of Data

The bot may use stored data for certain features provided by the service.
This data is not shared with any third party services.
Your data may be viewed by bot staff members for debugging and moderation.

## What is Stored?

### Guilds

- Guild ID
- Member Peaks
- Punishments when done so through moderation commands

### Users

- User ID
- Username
- Avatar
- Mention Data
- Username History
- Commands usage

### Updating Data

The data mentioned and data that has not been mentioned may be automatically updated upon user
interaction or through websocket events

### Mentions

To provide functionality to one of the bot's features, messages that mention (@) nypsi users
will be stored in the database.

The message content is truncated and encrypted thus cannot be read without the decryption key
which is stored on a different server

### Logs

Information about what commands you do may be logged for debugging and moderation purposes.
These logs will be stored for no longer than 90 days.

## Your Rights

### Viewing

You can safely view your data at any time with the command `/data request`. This will fetch all of the data regarding your account, except for data that may include other users' information.

### Deletion

A user can request their data deletion via the command `/data delete`. The only exemption to this is under the rare occasion that a user is blacklisted, meaning we must keep a record of their user ID to prevent access to our services.

Please note that his cannot be undone.

To request deletion of guild data, please use the contact details below

### Transfer

On rare occasions, data can be transferred to alternate Discord accounts. This is only used in
specific rare circumstances, as things could go wrong.

Not everything can be transferred.

## Contact

Discord: @m.axz
