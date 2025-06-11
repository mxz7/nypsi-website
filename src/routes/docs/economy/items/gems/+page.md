<script>
  import DocsTemplate from "$lib/components/docs/DocsTemplate.svelte"
  import GemChance from "./gem-chance.svelte"
  import DocsHeader from '$lib/components/docs/DocsHeader.svelte';

  let selected = $state("green gem");
  const tabs = ["green gem", "blue gem", "purple gem", "pink gem", "white gem", "crystal heart"];

</script>

<DocsTemplate title='gems' description="discover how to obtain and use gems for passive buffs, storage, and boosts in your game. learn gem effects, risks of shattering, and crafting a crystal heart." />

gems are basically just passive boosters. they are always active and give buffs to whoever wields them. the downside of this, however, is that they can shatter. when a gem uses its passive ability (for example, boosting how much money your workers gain) it has a very small chance to shatter. while this chance is small, it adds up over time.

using gems that can shatter based on command usage is risky and should only be done if you have a crystal heart (more info below), want to get a crystal heart, or want to actually receive the effects of the gem, even if it shatters.

having more than 1 of a single colour gem does nothing. for example, having 2 green gems doesn’t stack the effect, although more than one of some are needed to craft higher tier gems.

<DocsHeader header='h2' text="obtaining" />

the way you obtain a gem varies on which gem you want to obtain. each one has multiple different ways of obtaining, all of which are broken down in more detail below.

scratch cards can also drop gems. some gems have a slight chance to spawn depending on which scratch card you use.

<DocsHeader header='h2' text="extra information" />

double cookies from baking only take the highest chance from all gems

<DocsHeader header='h3' text="gem-breakdown details" />

the effects listed of each gem are averaged. this means that at any given time their effects could be higher or lower than what's listed.

<blue>blue text</blue> = removed when you have a crystal heart (except shattering). any time it is the other half of a percentage (ex: 60% is positive, <blue>other 40% is negative</blue>), the positive happens 100% of the time with a heart.

<br><br><green>green text</green> means that, combined, only one gem can be given every 24 hours globally from any of these methods.

ranged values (ex: 1-17%) have an equal chance for all options

  <ul class="menu menu-horizontal rounded-box bg-base-300 text-xs lg:text-sm mb-2 mt-4">
    {#each tabs as tab}
      <li>
        <button class={selected === tab ? "menu-active" : ""} onclick={() => selected = tab}>{tab}</button>
      </li>
    {/each}
  </ul>

{#if selected === "green gem"}

<DocsHeader header='h3' text="effects" />

\+20% max storage for all workers

\+20% max storage for all plants

<DocsHeader header='h3' text="obtaining" />

crafting: 10 gem shards

tower: 1.5% chance to spawn per row (max 1 per game), 0.5% chance to drop when clicked

mines: 20% chance to spawn, <green>0.5% chance to drop when clicked</green>

1% chance to obtain when buying an item from the store (NOT the shop)

<green>0.00025% (1/400,000) chance to obtain from doing any command (cooldown of 1 minute per check)</green>

<br><br><green>0.175% chance to obtain from completing any achievement</green>

<!-- < 0.01% chance to obtain from fishing with an incredible rod -->

<GemChance type="green_gem"/>

<DocsHeader header='h3' text="shattering" />

0.01% chance when claiming farm items

max shards given from shattering: 5

{/if}

{#if selected === "blue gem"}

<DocsHeader header='h3' text="effects" />

60% chance to increase worker output by 17%, <blue>other 40% decreases output by 20%</blue>

0.1% chance to double cookies baked

<DocsHeader header='h3' text="obtaining" />

crafting: 5 gem shards

<green>0.03% chance to obtain from $daily</green>

1% chance to obtain when buying an item from the store (NOT the shop)

<green>0.00025% (1/400,000) chance to obtain from doing any command (cooldown of 1 minute per check)</green>

<br><br><green>0.175% chance to obtain from completing any achievement</green>

<!-- < 0.01% chance to obtain from fishing with an incredible rod -->

<GemChance type="blue_gem"/>

<DocsHeader header='h3' text="shattering" />

0.04% chance every hour

0.004% chance when claiming workers

max shards given from shattering: 3

{/if}

{#if selected === "purple gem"}

<DocsHeader header='h3' text="effects" />

50% chance to increase worker item value by 17%, <blue>other 50% decreases value by 17%</blue>

50% chance to reduce karma deterioration by 56.25%

0.5% chance to double cookies baked

0.2% chance to roll one more time on hunt/fish/mine

\+20% storage for all plants **when combined with a** pink gem

<DocsHeader header='h3' text="obtaining" />

crafting: 15 gem shards

<green>0.9% chance to obtain from winning the lottery</green>

0.007% chance to obtain from doing any animal command (cooldown of 1 minute per check)

1% chance to obtain when buying an item from the store (NOT the shop)

<green>0.1% chance to obtain when buying an item from the karmashop</green>

<br><br><green>0.00025% (1/400,000) chance to obtain from doing any command (cooldown of 1 minute per check)</green>

<br><br><green>0.175% chance to obtain from completing any achievement</green>

<!-- < 0.01% chance to obtain from fishing with an incredible rod -->

<GemChance type="purple_gem"/>

<DocsHeader header='h3' text="shattering" />

0.05% chance every hour

0.006% chance when hunting/fishing/mining

0.005% chance when claiming workers

0.005% chance when claiming farm items

0.003885% chance when deteriorating karma

max shards given from shattering: 10

{/if}

{#if selected === "pink gem"}

<DocsHeader header='h3' text="effects" />

\+0.92% gamble multiplier <blue>(20% chance to reduce multi by 3%)</blue> **if you do not have a white gem**

\+4% sell multiplier <blue>(20% chance to reduce multi by 3%)</blue> **if you do not have a white gem**

\+20% storage for all plants **when combined with a** purple gem

80% chance to increase farm production by 25% (20% chance to reduce production by 20%)

<DocsHeader header='h3' text="obtaining" />

crafting: 20 gem shards

0.07% chance to obtain from doing any moderation command (cooldown of 1 minute per check)

1% chance to obtain when buying an item from the store (NOT the shop)

<green>0.00025% (1/400,000) chance to obtain from doing any command (cooldown of 1 minute per check)</green>

<br><br><green>0.175% chance to obtain from completing any achievement</green>

<!-- < 0.01% chance to obtain from fishing with an incredible rod -->

<GemChance type="pink_gem"/>

<DocsHeader header='h3' text="shattering" />

0.032% chance every time you gamble **if you do not have a white gem**

0.032% chance every time you $sell something

0.01% chance when claiming farm items (0.015% if you also have a purple gem)

max shards given from shattering: 15

{/if}

{#if selected === "white gem"}

<DocsHeader header='h3' text="effects" />

\+70% max worker storage

\+60% chance for +70% more worker items per hour and item value, <blue>other 40% cuts items/hr and value in half</blue>

\+80% chance to increase max xp gain by 1-17% for each gamble, <blue>other 20% decreases by 1-7%</blue>

\+2% gamble multiplier <blue>(20% chance to reduce multi by 1-3%)</blue>

\+2.4% sell multiplier <blue>(20% chance to reduce multi by 1-6%)</blue>

50% chance to save your daily streak from resetting

0.2% chance to roll one more time on hunt/fish/mine

2% chance to double cookies baked

<DocsHeader header='h3' text="obtaining" />

crafting: 2 blue gems, 2 green gems, 1 pink gem, 1 purple gem

0.02% chance to obtain when buying an item from the store (NOT the shop)

<!-- < 0.01% chance to obtain from fishing with an incredible rod -->

<GemChance type="white_gem"/>

<DocsHeader header='h3' text="shattering" />

0.03% chance every hour

0.0072% chance every time you gamble

0.0072% chance every time you $sell something

0.006% chance when hunting/fishing/mining

0.003% chance when claiming workers

7% chance to shatter from saving your daily streak (crystal heart does NOT prevent this and no gem shards are given)

max shards given from shattering: 30

{/if}

{#if selected === "crystal heart"}

<DocsHeader header='h3' text="effects" />

prevents **all gems** from shattering

\+0-9 max xp gain every gamble

0.1% chance to roll one more time on hunt/fish/mine

5% chance to double cookies baked

removes almost all negative effects possible from other gems

<DocsHeader header='h3' text="obtaining" />

every time you do an action that would cause a gem to break (and have 5 unique gems), there's a 50% chance to trigger the crafting sequence of a crystal heart. otherwise, your gem shatters and you only get shards ):

<GemChance type="crystal_heart"/>

<DocsHeader header='h3' text="shattering" />

cannot shatter

{/if}

<style>
  @reference "../../../../../app.css";

  blue {
    color: #6097d2;
  }
  green {
    @apply text-success;
  }
</style>
