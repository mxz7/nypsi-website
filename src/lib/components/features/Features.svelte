<script>
  import economy from "$lib/assets/features/economy.png?as=run:0";
  import moderation from "$lib/assets/features/moderation.png?as=run:0";
  import Img from "@zerodevx/svelte-img";
</script>

<div class="flex w-full justify-center bg-base-200" id="features">
  <div class="w-full py-28 lg:max-w-4xl">
    <h2 class="mb-14 text-center text-5xl font-semibold">economy</h2>
    <div class="grid w-full grid-cols-1 px-4 lg:grid-cols-2 lg:px-0">
      <ul class="flex h-full flex-col justify-center gap-3 text-lg">
        <li>resets twice a year with <strong>real money rewards</strong></li>
        <li>over 150+ items to collect</li>
        <li>bakery, gambling, farming, workers, minecraft, cryptocurrency and much more</li>
        <li><a href="/seasons" class="link" target="_blank">view season history</a></li>
        <li><a href="/leaderboard" class="link" target="_blank">view leaderboards</a></li>
      </ul>
      <div class="pt-0 lg:pl-12">
        <Img class="h-auto max-h-full w-auto max-w-full rounded-lg object-contain" src={economy} />
      </div>
    </div>
  </div>
</div>

<div class="flex w-full justify-center bg-base-100" id="features">
  <div class="w-full py-28 lg:max-w-4xl">
    <h2 class="mb-14 text-center text-5xl font-semibold">moderation</h2>
    <div class="grid w-full grid-cols-1 px-4 lg:grid-cols-2 lg:px-0">
      <ul class="flex h-full flex-col justify-center gap-3 text-lg">
        <li>full standard moderation suite</li>
        <li>case system with uploadable evidence screenshots</li>
        <li>customisable automute with custom cooldown time</li>
        <li>chat filter with similarity % to catch people trying to evade detection</li>
        <li>alt management - add known alts to users to punish together</li>
      </ul>
      <div class="pt-0 lg:pl-12">
        <Img
          class="h-auto max-h-full w-auto max-w-full rounded-lg object-contain"
          src={moderation}
        />
      </div>
    </div>
  </div>
</div>
