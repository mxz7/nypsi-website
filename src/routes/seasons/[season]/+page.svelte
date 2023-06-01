<script lang="ts">
  import { page } from "$app/stores";
  import MiniLeaderboard from "$lib/components/MiniLeaderboard.svelte";

  const seasons: { [key: string]: { started: Date; ended?: Date; winners?: { username: string; value: string }[] } } = {
    "1": {
      started: new Date("2021-06-01"),
      ended: new Date("2021-09-01"),
      winners: [
        { username: "Growling_Grizzly", value: "$1,700,000,000" },
        { username: "sae", value: "$608,036,806" },
        { username: "BeA12thMan", value: "$372,780,632" },
        { username: "γlzziɿӘ_ϱnilwoɿӘ", value: "$125,681,883" },
        { username: "cici31415", value: "$103,634,114" },
        { username: "So", value: "$69,440,431" },
        { username: "morris <3", value: "$52,237,509" },
        { username: "deije", value: "$33,288,999" },
        { username: "Azorochi", value: "$31,424,039" },
        { username: "Plasma3", value: "$28,540,100" }
      ]
    },
    "2": {
      started: new Date("2021-09-01"),
      ended: new Date("2022-01-01")
    },
    "3": {
      started: new Date("2022-01-01"),
      ended: new Date("2022-08-01"),
      winners: [
        { username: "Bunnyzzz", value: "$4,213,922,308" },
        { username: "Chris!", value: "$2,421,629,404" },
        { username: "cici314159", value: "$1,913,792,164" },
        { username: "Vancouverⱽᶜ", value: "$1,573,801,518" },
        { username: "Growling_Grizzly", value: "$1,473,934,213" },
        { username: "<c8>Peter<c/>", value: "$1,092,262,226" },
        { username: "Khyat", value: "$1,037,988,068" },
        { username: "aleph-riceboy", value: "$712,670,135" },
        { username: "strelec06", value: "$680,006,329" },
        { username: "5th Place", value: "$626,444,444" }
      ]
    },
    "4": {
      started: new Date("2022-08-01"),
      ended: new Date("2023-01-01"),
      winners: [
        { username: "Zackbot", value: "$23,618,747,419" },
        { username: "Soup", value: "$8,379,631,482" },
        { username: "joee", value: "$8,112,836,847" },
        { username: "vqrh ♡", value: "$3,704,735,735" },
        { username: "HorizonGhóstඞ", value: "$1,399,467,788" },
        { username: "Orion", value: "$843,551,261" },
        { username: "Mob.", value: "$797,257,511" },
        { username: "inkoth", value: "$730,922,051" },
        { username: "hill", value: "$651,902,928" },
        { username: "Empheny", value: "$526,856,290" }
      ]
    },
    "5": {
      started: new Date("2023-01-01"),
      ended: new Date("2023-06-01"),
      winners: [
        { username: "Psychotic", value: "$71,045,986,907" },
        { username: "Rage.", value: "$52,653,876,724" },
        { username: "yea", value: "$32,612,374,730" },
        { username: "joee", value: "$28,114,587,314" },
        { username: "Mug Root Beer(No Caffeine)", value: "$6,629,789,567" },
        { username: "max", value: "$5,612,645,119" },
        { username: "Orion", value: "$4,803,391,042" },
        { username: "Kindred", value: "$4,121,912,195" },
        { username: "Cooler", value: "$2,661,086,832" },
        { username: "— ۞ —", value: "$2,270,744,832" }
      ]
    },
    "6": {
      started: new Date("2023-06-01")
    }
  };

  const season = seasons[$page.params.season];
</script>

<svelte:head>
  <title>nypsi season winners</title>
</svelte:head>

<div class="w-full">
  <div class="text-center w-full mt-16">
    {#if season}
      <h1 class="text-white text-4xl font-bold">season {$page.params.season}</h1>

      <div class="w-52 h-1 bg-red-500 rounded-full mt-3 m-auto" />

      {#if season.ended}
        <h2 class="text-lg text-gray-400 font-bold mt-3">
          {season.started.toLocaleDateString()} - {season.ended.toLocaleDateString()}
        </h2>

        {#if season.winners}
          <div class="text-white mt-16 text-left">
            <MiniLeaderboard
              concatUser={false}
              data={season.winners.map((i) => {
                return {
                  username: i.username,
                  value: i.value,
                  position: season.winners ? season.winners?.indexOf(i) + 1 : 0
                };
              })}
              title="winners"
            />
          </div>
        {/if}
      {:else}
        <h2 class="text-lg text-gray-400 font-bold mt-3">
          started on {season.started.toLocaleDateString()}
        </h2>
      {/if}
    {:else}
      <h1 class="text-gray-400 text-4xl font-bold underline"><a href="/seasons">invalid season</a></h1>
    {/if}
  </div>
</div>
