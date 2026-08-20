<script>
  import DocsTemplate from "$lib/components/wiki/docs-template.svelte"
  import DocsHeader from '$lib/components/wiki/docs-header.svelte';
  import ItemModal from "$lib/components/wiki/item-modal.svelte"
</script>

<DocsTemplate title='marriage' description="learn how to get married with a ring or for free with the love command, and discover the rewards you can share with your partner." />

<DocsHeader header='h2' text="how to get married" />

both players must be unmarried. you can get married for free with `/love`, or you can propose with a <ItemModal item="ring" trailing=".">ring</ItemModal>

<DocsHeader header='h3' text="get married for free" />

you do not need a ring to get married with `/love`:

1. use `/love <@user>` with the person you want to marry.
2. the command gives the two of you a random love percentage. the result for that pair stays the same for 60 seconds.
3. if you get exactly 100% love, a `get married!` button appears for 30 seconds. both players must click it to get married.

if the result is below 100%, wait for it to change and try again. getting 100% is random, so this method is free but may take a while.

<DocsHeader header='h3' text="propose with a ring" />

if you own a <ItemModal item="ring" trailing=",">ring</ItemModal> use `/marry <@user>` to propose. the other player has 30 seconds to accept or reject the proposal.

- if they accept, the ring is used and you get married.
- if they reject, the ring becomes a broken ring.
- if the proposal expires, the ring is returned to you.

once you are married, use `/marry` to see your partner and how long you have been together.

<DocsHeader header='h2' text="divorces" />

use `/divorce` and confirm within 30 seconds to end your marriage. the partner being divorced receives a broken ring as a reminder of the once true love 💔.

be careful when using `/love` while married: getting 100% love with somebody other than your partner will divorce your current partner automatically.

<DocsHeader header='h2' text="rewards" />

when both partners use `/daily` on the same day, the second claim activates a marriage bonus: its rewards are doubled and the first partner receives another reward. married players also receive a special `/daily` bonus on valentine's day.

there is an [achievement](/wiki/economy/achievements) for getting married.
