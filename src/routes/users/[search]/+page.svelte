<script lang="ts">
  import { page } from "$app/state";
  import { getAchievementsRemote } from "$lib/api/achievements.remote";
  import {
    getAchievements,
    getBaseData,
    getCommandUses,
    getMarriagePartner,
  } from "$lib/api/users.remote";
  import Main from "$lib/components/ui/Main.svelte";
  import { daysAgo } from "$lib/functions/time";
  import dayjs from "dayjs";
  import Profile from "./profile.svelte";
  import StatsGrid from "./stats-grid.svelte";

  const [baseData, achievements, commandsData, marriagePartner] = $derived(
    await Promise.all([
      getBaseData(page.params.search),
      getAchievements(page.params.search),
      getCommandUses(page.params.search),
      getMarriagePartner(page.params.search),
    ]),
  );

  const achievementsData = await getAchievementsRemote();

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
        result = `${h === 1 ? "an" : h} hour${h > 1 ? "s" : ""} ago`;
      }
    } else {
      const days = daysAgo(baseData.lastCommand);
      result = `${days.toLocaleString()} day${days > 1 ? "s" : ""} ago`;
    }

    return result;
  });
  const commandUses = $derived(commandsData.reduce((a, b) => a + b._sum.uses, 0));
  const achievementCompletion = $derived(
    (achievements.filter((a) => a.completedAt).length / Object.values(achievementsData).length) *
      100,
  );
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

<Main class="mx-auto mt-8 w-full max-w-3xl space-y-4 px-2 md:px-0">
  <Profile {baseData} {lastSeen} {marriagePartner} />

  {#if baseData.Economy}
    <StatsGrid {baseData} {lastSeen} {commandUses} {achievementCompletion} />
  {/if}
</Main>
