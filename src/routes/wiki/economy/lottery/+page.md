<script>
  import DocsTemplate from "$lib/components/wiki/DocsTemplate.svelte"
  import DocsHeader from '$lib/components/wiki/DocsHeader.svelte';
</script>

<DocsTemplate title='lottery' description="join the nypsi lottery to win daily prizes. buy tickets with commands, earn them from voting or crates. easy entry, auto participation." />

<DocsHeader header='h2' text="how it works" />

the nypsi lottery runs every 8 hours, with a **SUPERDRAW** on saturday 12am gmt/utc. you can see the countdown for this with the `$lottery` command. this will also show you how many tickets you have and the approximate prize pool.

<DocsHeader header='h2' text="obtaining tickets" />

you can buy tickets with `$buy lotto <amount>`. you also get tickets from voting and as a random item from crates.

<DocsHeader header='h2' text="how to use tickets" />

tickets will be used automatically at 12:00am utc/gmt, you do not need to do anything except have them in your inventory

<DocsHeader header='h2' text='discounted lottery tickets' />

you can use `/lottery autobuy` to get a **5%** discount on lottery tickets, these tickets will be automatically bought for you at your specified interval. daily or every lottery

<DocsHeader header='h2' text='superdraw' />

the superdraw is a special lottery running every saturday 12am gmt/utc. tickets for this lottery can be bought, but also receive special contribution from anybody that entered previous lotteries through the week with standard tickets.

up to 10% of your normal tickets during every lottery will be converted to superdraw tickets

normal tickets bought will also be used for the superdraw
