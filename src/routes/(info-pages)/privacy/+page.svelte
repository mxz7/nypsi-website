<svelte:head>
  <title>privacy / nypsi</title>
</svelte:head>

<div class="flex w-full justify-center">
  <div class="w-full px-3 pt-14 md:max-w-3xl md:px-0">
    <h1>Privacy Policy</h1>

    <h2>Storing of Data</h2>
    <p>
      Data can be stored in the database, this is called <span class="font-semibold"
        >persistant data</span
      >. Data can also be stored in temporary memory via Redis database or process memory.
    </p>

    <p>The information below refers to <span class="font-bold">persistant data</span> only.</p>

    <h2>Usage of Data</h2>
    <p>The bot may use stored data for certain features provided by the service.</p>
    <p>This data is not shared with any third party services.</p>
    <p>Your data may be viewed by bot staff members for debugging and moderation.</p>

    <h2>What is Stored?</h2>
    <h3>Guilds</h3>
    <ul>
      <li>Guild ID</li>
      <li>Member Peaks</li>
      <li>Punishments when done so through moderation commands</li>
    </ul>

    <h3>Users</h3>
    <ul>
      <li>User ID</li>
      <li>Username</li>
      <li>Avatar</li>
      <li>Mention Data</li>
      <li>Username History</li>
      <li>Commands usage</li>
    </ul>

    <h3>Updating Data</h3>
    <p>
      The data mentioned and data that has not been mentioned may be automatically updated upon user
      interaction or through websocket events
    </p>

    <h3>Mentions</h3>
    <p>
      To provide functionality to one of the bot's features, messages that mention (@) nypsi users
      will be stored in the database.
    </p>

    <p>
      The message content is truncated and encrypted thus cannot be read without the decryption key
      which is stored on a different server
    </p>

    <h3>Logs</h3>
    <p>
      Information about what commands you do may be logged for debugging and moderation purposes.
      These logs will be stored for no longer than 90 days.
    </p>

    <h2>Your Rights</h2>

    <h3>Viewing</h3>
    <p>
      You can safely view your data at any time with the command <span class="font-mono">
        /data request
      </span>. This will fetch all of the data regarding your account, except for data that may
      include other users' information.
    </p>

    <h3>Deletion</h3>
    <p>
      A user can request their data deletion via the command <span class="font-mono"
        >/data delete</span
      >. The only exemption to this is under the rare occasion that a user is blacklisted, meaning
      we must keep a record of their user ID to prevent access to our services.
    </p>

    <p>Please note that his cannot be undone.</p>

    <p>To request deletion of guild data, please use the contact details below</p>

    <h3>Transfer</h3>
    <p>
      On rare occasions, data can be transferred to alternate Discord accounts. This is only used in
      specific rare circumstances, as things could go wrong.
    </p>

    <p>Not everything can be transferred.</p>

    <h2>Contact</h2>
    Discord: @m.axz
  </div>
</div>

<style>
  h1 {
    @apply mb-6 text-center text-5xl font-bold text-white;
  }

  h2 {
    @apply my-4 text-2xl font-semibold text-white;
  }

  h3 {
    @apply my-3 text-lg font-semibold text-white;
  }

  p {
    @apply my-2;
  }
</style>
