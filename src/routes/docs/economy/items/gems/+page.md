<script>
  import DocsTemplate from "$lib/components/docs/DocsTemplate.svelte"
</script>

<DocsTemplate title='gems' />

## what are gems?

gems are basically just passive boosters. they are always active and give buffs to whoever wields them. the downside of this, however, is that they can shatter. when a gem uses its passive ability (for example, boosting how much money your workers gain) it has a very small chance to shatter. while this chance is small, it adds up over time.

using gems that can shatter based on command usage is risky and should only be done if you have a crystal heart (more info below), want to get a crystal heart, or want to actually receive the effects of the gem, even if it shatters.

having more than 1 of a single colour gem does nothing. for example, having 2 green gems doesn’t stack the effect, although more than one of some are needed to craft higher tier gems.

## how do i get gems?

the way you obtain a gem varies on which gem you want to obtain. each one has multiple different ways of obtaining, all of which are broken down in more detail below.

scratch cards can also drop gems. some gems have a slight chance to spawn depending on which scratch card you use.

## extra information

double cookies from baking only take the highest chance from all gems

### gem-breakdown details

the effects listed of each gem are averaged. this means that at any given time their effects could be higher or lower than what's listed.

<mark style="color:blue;">blue text</mark> = removed when you have a crystal heart (except shattering). any time it is the other half of a percentage (ex: 60% is positive, <mark style="color:blue;">other 40% is negative</mark>), the positive happens 100% of the time with a heart.

<mark style="color:green;">green text</mark> means that, combined, only one gem can be given every 24 hours globally from any of these methods.

ranged values (ex: 1-17%) have an equal chance for all options

<!-- {% tabs %}
{% tab title="green gem" %} -->

### effects

\+20% max storage for all workers

### obtaining

crafting: 10 gem shards

tower: 1.5% chance to spawn per row (max 1 per game), 0.5% chance to drop when clicked

mines: 20% chance to spawn, <mark style="color:green;">0.5% chance to drop when clicked</mark>

1% chance to obtain when buying an item from the store (NOT the shop)

<mark style="color:green;">0.00025% (1/400,000) chance to obtain from doing any command (cooldown of 1 minute per check)</mark>

<mark style="color:green;">0.175% chance to obtain from completing any achievement</mark>

<!-- < 0.01% chance to obtain from fishing with an incredible rod -->

<!-- {% @nypsi/green-gem-chance %} -->

### shattering

cannot shatter

<!-- {% endtab %}

{% tab title="blue gem" %} -->

### effects

60% chance to increase worker output by 17%, <mark style="color:blue;">other 40% decreases output by 20%</mark>

0.1% chance to double cookies baked

### obtaining

crafting: 5 gem shards

<mark style="color:green;">0.03% chance to obtain from $daily</mark>

1% chance to obtain when buying an item from the store (NOT the shop)

<mark style="color:green;">0.00025% (1/400,000) chance to obtain from doing any command (cooldown of 1 minute per check)</mark>

<mark style="color:green;">0.175% chance to obtain from completing any achievement</mark>

<!-- < 0.01% chance to obtain from fishing with an incredible rod -->

<!-- {% @nypsi/blue-gem-chance %} -->

### shattering

0.04% chance every hour

0.004% chance when claiming workers

max shards given from shattering: 3

<!-- {% endtab %} -->

<!-- {% tab title="purple gem" %} -->

### effects

50% chance to increase worker item value by 17%, <mark style="color:blue;">other 50% decreases value by 17%</mark>

50% chance to reduce karma deterioration by 56.25%

0.5% chance to double cookies baked

0.2% chance to roll one more time on hunt/fish/mine

### obtaining

crafting: 15 gem shards

<mark style="color:green;">0.9% chance to obtain from winning the lottery</mark>

0.007% chance to obtain from doing any animal command (cooldown of 1 minute per check)

1% chance to obtain when buying an item from the store (NOT the shop)

<mark style="color:green;">0.1% chance to obtain when buying an item from the karmashop</mark>

<mark style="color:green;">0.00025% (1/400,000) chance to obtain from doing any command (cooldown of 1 minute per check)</mark>

<mark style="color:green;">0.175% chance to obtain from completing any achievement</mark>

<!-- < 0.01% chance to obtain from fishing with an incredible rod -->

<!-- {% @nypsi/purple-gem-chance %} -->

### shattering

0.05% chance every hour

0.014% chance when hunting/fishing/mining

0.005% chance when claiming workers

0.003885% chance when deteriorating karma

max shards given from shattering: 10

<!-- {% endtab %}

{% tab title="pink gem" %} -->

### effects

\+0.92% gamble multiplier <mark style="color:blue;">(20% chance to reduce multi by 3%)</mark>

\+4% sell multiplier <mark style="color:blue;">(20% chance to reduce multi by 3%)</mark>

### obtaining

crafting: 20 gem shards

0.07% chance to obtain from doing any moderation command (cooldown of 1 minute per check)

1% chance to obtain when buying an item from the store (NOT the shop)

<mark style="color:green;">0.00025% (1/400,000) chance to obtain from doing any command (cooldown of 1 minute per check)</mark>

<mark style="color:green;">0.175% chance to obtain from completing any achievement</mark>

<!-- < 0.01% chance to obtain from fishing with an incredible rod -->

<!-- {% @nypsi/pink-gem-chance %} -->

### shattering

0.056% chance every time you gamble

0.056% chance every time you $sell something

max shards given from shattering: 15

<!-- {% endtab %} -->

<!-- {% tab title="white gem" %} -->

### effects

\+70% max worker storage

\+60% chance for +70% more worker items per hour and item value, <mark style="color:blue;">other 40% cuts items/hr and value in half</mark>

\+80% chance to increase max xp gain by 1-17% for each gamble, <mark style="color:blue;">other 20% decreases by 1-7%</mark>

\+2% gamble multiplier <mark style="color:blue;">(20% chance to reduce multi by 1-3%)</mark>

\+2.4% sell multiplier <mark style="color:blue;">(20% chance to reduce multi by 1-6%)</mark>

50% chance to save your daily streak from resetting

0.2% chance to roll one more time on hunt/fish/mine

2% chance to double cookies baked

### obtaining

crafting: 2 blue gems, 2 green gems, 1 pink gem, 1 purple gem

0.02% chance to obtain when buying an item from the store (NOT the shop)

<!-- < 0.01% chance to obtain from fishing with an incredible rod -->

<!-- {% @nypsi/white-gem-chance %} -->

### shattering

0.03% chance every hour

0.0056% chance every time you gamble

0.014% chance when hunting/fishing/mining

0.003% chance when claiming workers

7% chance to shatter from saving your daily streak (crystal heart does NOT prevent this and no gem shards are given)

max shards given from shattering: 30

<!-- {% endtab %} -->

<!-- {% tab title="crystal heart" %} -->

### effects

prevents **all gems** from shattering

\+0-9 max xp gain every gamble

0.1% chance to roll one more time on hunt/fish/mine

5% chance to double cookies baked

removes almost all negative effects possible from other gems

### obtaining

every time you do an action that would cause a gem to break (and have 5 unique gems), there's a 50% chance to trigger the crafting sequence of a crystal heart. otherwise, your gem shatters and you only get shards ):

<!-- {% @nypsi/crystal-heart-chance %} -->

### shattering

cannot shatter

<!-- {% endtab %}
{% endtabs %} -->
