<svelte:head>
  <title>terms of service / nypsi</title>
</svelte:head>

<div class="flex w-full justify-center">
  <div
    class="font-xl w-full pt-14 md:max-w-xl [&>h2]:my-4 [&>h2]:font-semibold [&>h3]:my-2 [&>h3]:font-semibold [&>h3]:text-gray-300"
  >
    <h1 class="mb-6 text-center text-2xl font-semibold">Privacy Policy</h1>

    <h2>Usage of Data</h2>
    <p>The bot may use stored data for certain features provided by the service.</p>
    <p>This data is not shared with any third party services.</p>

    <h2>Automatically Gathered Information</h2>
    <p>Only states values stored in a persistant storage when configured to do so by the user.</p>
    <h3>Guilds</h3>
    <ul>
      <li>Guild ID</li>
      <li>Member Peaks</li>
      <li class="text-sm">Default settings generated for the guild by the bot.</li>
    </ul>

    <h3>Users</h3>
    <ul>
      <li>User ID</li>
      <li>Username</li>
      <li>Avatar</li>
      <li>Mention Data</li>
      <li>Username History</li>
    </ul>

    <h3>Updating Data</h3>
    <p>
      The data mentioned and data that has not been mentioned may be automatically updated upon user
      interaction or through websocket events
    </p>

    <h2>Removal of Data</h2>
    <p>
      A user can request their data deletion via the command `/data delete`. The only exemption to
      this is under the rare occasion that a user is blacklisted, meaning we must keep a record of
      their user ID to prevent access to our services.
      <br /><br />
      To request deletion of guild data, please use the contact details below
    </p>

    <h2>Contact</h2>
    <a href="https://discord.com/invite/hJTDNST" class="text-sky-300 underline">Discord</a>
  </div>
</div>
