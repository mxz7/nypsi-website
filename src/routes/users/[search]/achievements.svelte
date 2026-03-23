<script lang="ts">
  import { page } from "$app/state";
  import { getAchievementsRemote } from "$lib/api/achievements.remote";
  import { getAchievements } from "$lib/api/users.remote";
  import Card from "$lib/components/ui/Card.svelte";
  import parseEmoji from "$lib/functions/parseEmoji";

  const [achievementsData, userAchievements] = $derived(
    await Promise.all([getAchievementsRemote(), getAchievements(page.params.search)]),
  );

  const userProgress = $derived.by(
    () => new Map(userAchievements.map((achievement) => [achievement.achievementId, achievement])),
  );

  const groupedAchievements = $derived.by(() => {
    const allAchievements = Object.values(achievementsData).toSorted((a, b) =>
      a.name
        .replaceAll("*", "")
        .localeCompare(b.name.replaceAll("*", ""), undefined, { sensitivity: "base" }),
    );
    const groups: (typeof allAchievements)[] = [];

    for (let i = 0; i < allAchievements.length; i += 5) {
      groups.push(allAchievements.slice(i, i + 5));
    }

    return groups;
  });

  const completionCount = $derived.by(
    () => userAchievements.filter((achievement) => achievement.completedAt).length,
  );

  const totalAchievements = $derived.by(() => Object.values(achievementsData).length);

  const completionPercentage = $derived.by(() => {
    if (totalAchievements === 0) {
      return 0;
    }

    return (completionCount / totalAchievements) * 100;
  });
</script>

<section class="space-y-2">
  <p class="text-base-content/60 text-sm">
    {completionCount.toLocaleString()} / {totalAchievements.toLocaleString()} completed ({completionPercentage.toPrecision(
      3,
    )}%)
  </p>

  <ol class="grid w-full grid-cols-1 gap-2 md:grid-cols-3">
    {#each groupedAchievements as group}
      <li>
        <Card mode="article" class="space-y-1 p-2 shadow">
          <ol class="space-y-1">
            {#each group as achievement}
              {@const progress = userProgress.get(achievement.id)}
              {@const completed = Boolean(progress?.completedAt)}
              {@const currentProgress = Number(progress?.progress || 0)}

              <li
                class={`border-primary/5 bg-base-300/35 flex items-center justify-between gap-2 rounded-lg border px-2 py-1.5 ${
                  completed ? "" : "opacity-75"
                }`}
                title={achievement.description}
              >
                <div class="flex min-w-0 items-center gap-2">
                  <img
                    src={parseEmoji(achievement.emoji)}
                    class={`h-5 w-5 shrink-0 object-contain ${completed ? "" : "grayscale"}`}
                    alt={achievement.id}
                    loading="lazy"
                    decoding="async"
                  />
                  <p class="truncate text-xs font-medium">
                    {achievement.name.replaceAll("*", "")}
                  </p>
                </div>

                <p class=" text-xs text-nowrap {completed && 'text-success'}">
                  {#if completed}
                    done
                  {:else}
                    {Math.min(
                      currentProgress,
                      achievement.target,
                    ).toLocaleString()}/{achievement.target.toLocaleString()}
                  {/if}
                </p>
              </li>
            {/each}
          </ol>
        </Card>
      </li>
    {/each}
  </ol>
</section>
