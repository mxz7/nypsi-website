<script lang="ts">
  import parseEmoji from "$lib/functions/parseEmoji";
  import { onMount } from "svelte";

  let achievements: {
    id: string;
    name: string;
    emoji: string;
    target: number;
    description: string;
    prize?: string[];
  }[][] = $state([]);

  onMount(async () => {
    const achievementsData: {
      id: string;
      name: string;
      emoji: string;
      target: number;
      description: string;
      prize?: string[];
    }[] = await fetch(
      "https://raw.githubusercontent.com/mxz7/nypsi/refs/heads/main/data/achievements.json",
    ).then((r) => r.json().then((r) => Object.values(r)));

    for (let i = 0; i < achievementsData.length; i += 5) {
      const chunk = achievementsData.slice(i, i + 5);
      achievements.push(chunk);
    }
  });
</script>

<div class="grid w-full grid-cols-2 gap-4 text-sm lg:grid-cols-4">
  {#if achievements.length === 0}
    <span class="loading loading-spinner"></span>
  {:else}
    {#each achievements as achievements}
      <div class="grid grid-cols-1 gap-1">
        {#each achievements as achievement}
          <div class="flex items-center gap-2">
            <img
              src={parseEmoji(achievement.emoji)}
              class="w-5"
              alt={achievement.id}
              loading="lazy"
              decoding="async"
            />
            <span class="font-medium">{achievement.name.replaceAll("*", "")}</span>
          </div>
        {/each}
      </div>
    {/each}
  {/if}
</div>
