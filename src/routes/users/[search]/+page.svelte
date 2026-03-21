<script lang="ts">
  import { page } from "$app/state";
  import Main from "$lib/components/ui/Main.svelte";
  import { daysAgo } from "$lib/functions/time";
  import dayjs from "dayjs";
  import { getBaseData } from "./page.remote";
  import Profile from "./profile.svelte";

  const baseData = $derived(await getBaseData(page.params.search));

  const title = $derived(`${baseData.lastKnownUsername}'s profile | nypsi`);
  const lastSeen = $derived.by(() => {
    const d = dayjs(baseData.lastCommand);
    let result: string;

    if (d.isBefore(dayjs().subtract(3, "months"))) {
      result = new Date(baseData.lastCommand).toLocaleDateString();
    } else if (daysAgo(baseData.lastCommand) < 1) {
      const hours = (dayjs().unix() - d.unix()) / 3600;
      if (hours < 1) {
        result = "just now";
      } else {
        const h = Math.floor(hours);
        result = `${h} hour${h > 1 ? "s" : ""} ago`;
      }
    } else {
      const days = daysAgo(baseData.lastCommand);
      result = `${days.toLocaleString()} day${days > 1 ? "s" : ""} ago`;
    }

    return result;
  });
</script>

<svelte:head>
  <title>{title || `${baseData.lastKnownUsername}'s profile | nypsi`}</title>
  <meta name="og:title" content="{baseData.lastKnownUsername}'s nypsi profile" />

  <meta name="description" content="view {baseData.lastKnownUsername}'s nypsi profile" />
  <meta name="og:description" content="view {baseData.lastKnownUsername}'s nypsi profile" />

  <meta name="og:image" content={baseData.avatar} />
  <meta property="og:image:width" content="128" />
  <meta property="og:image:height" content="128" />

  <meta name="robots" content="noindex" />
  <link rel="canonical" href="https://nypsi.xyz/users/{baseData.id}" />
</svelte:head>

<Main class="mx-auto mt-8 w-full max-w-3xl px-2 md:px-0">
  <Profile {baseData} {lastSeen} />
</Main>
