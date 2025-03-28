<script lang="ts">
  import type { IconProps } from "@lucide/svelte";
  import {
    BadgeDollarSign,
    Bell,
    Book,
    Cat,
    Coins,
    Flag,
    Hammer,
    Keyboard,
    Leaf,
  } from "@lucide/svelte";
  import type { Component } from "svelte";
</script>

{#snippet section(
  title: string,
  list: string[],
  image: string,
  Icon: Component<IconProps, {}, "">,
  flipped: boolean,
)}
  <section class="{flipped ? '' : 'bg-base-200'} w-full">
    <div class="mx-auto w-full py-28 lg:max-w-5xl">
      <h2>
        <div class="bg-base-300 rounded-lg p-3">
          <Icon class="text-primary" size={32} strokeWidth={2.5} />
        </div>
        <span>{title}</span>
      </h2>
      <div class="grid w-full grid-cols-1 px-3 lg:grid-cols-2 lg:px-0">
        <ul>
          {#each list as item}
            <li>{@html item}</li>
          {/each}
        </ul>
        <div class="pt-0 {flipped ? 'lg:-order-1 lg:pr-12' : 'lg:pl-12'}">
          <picture>
            <source srcset="https://cdn.nypsi.xyz/static/features/{image}.avif" type="image/avif" />
            <img
              src="https://cdn.nypsi.xyz/static/features/{image}.webp"
              alt="networth command"
              loading="lazy"
              decoding="async"
            />
          </picture>
        </div>
      </div>
    </div>
  </section>
{/snippet}

<section id="features">
  {@render section(
    "economy",
    [
      "resets twice a year with <strong>real money rewards</strong>",
      "over 150+ items to collect",
      "bakery, gambling, farming, workers, minecraft, cryptocurrency and much more",
      "<a href='/seasons' class='link' target='_blank'>view season history</a>",
      "<a href='/leaderboard' class='link' target='_blank'>view leaderboards</a>",
    ],
    "economy",
    BadgeDollarSign,
    false,
  )}

  {@render section(
    "chat reactions",
    [
      "fun typing game for all server members",
      "uses word lists from <a href='https://monkeytype.com' target='_blank' class='link'>monkeytype</a> - or <a href='/docs/chat-reactions/word-lists' target='_blank' class='link'>create your own</a>",
      "customisable timings",
      "duel specific players with $cr duel",
      "view leaderboards with $cr lb",
      "compete in official tournaments for a <a href='/badges#keyboard' class='link'>keyboard tag</a>",
    ],
    "chatreaction",
    Keyboard,
    true,
  )}

  {@render section(
    "gambling",
    [
      "many different gambling games including blackjack, mines, dragon tower, races and scratch cards",
      "earn xp to level up",
      "contribute earned rewards to guilds for higher bonuses",
      "use boosters to push the limits",
    ],
    "gambling",
    Coins,
    false,
  )}

  {@render section(
    "moderation",
    [
      "full standard moderation suite",
      "case system with uploadable evidence screenshots",
      "customisable automute with custom cooldown time",
      "chat filter with similarity % to catch people trying to evade detection",
      "alt management - add known alts to users to punish together",
    ],
    "moderation",
    Hammer,
    true,
  )}

  {@render section(
    "reaction roles",
    [
      "modern implementation using buttons rather than emojis reactions",
      "use an emoji or a text label",
      "unique and many modes preventing users from collecting all roles",
      "role whitelist - require members to have a specific role before using",
    ],
    "reactionroles",
    Book,
    false,
  )}

  {@render section(
    "guess the flag",
    [
      "fun game to play on your own or against others",
      "uses a global list of every country's flag",
      "helps you to learn all the flags (i'm still shit at them)",
    ],
    "guesstheflag",
    Flag,
    true,
  )}

  {@render section(
    "mention history",
    [
      "no more annoying ghost pings 🙄",
      "works in every server",
      "your messages are safe with two layer encryption",
    ],
    "mentions",
    Bell,
    false,
  )}

  {@render section(
    "farms",
    [
      "grow plants and make money from your yield",
      "take care of your plants with watering and fertiliser",
      "upgrade your farms with silos and hoes for even more production",
    ],
    "farm",
    Leaf,
    true,
  )}

  {@render section(
    "cats",
    [
      "collect popular silly cats you know and love from tiktok and instagram",
      "dave is the bot owner's personal cat (:",
      "there's also flowers if you're not a cat person. you loser.",
    ],
    "cats",
    Cat,
    false,
  )}
</section>

<style>
  @reference "../../../app.css";

  ul {
    @apply flex h-full w-full flex-col justify-center gap-2 md:gap-3 md:text-lg;
  }

  h2 {
    @apply mb-14 flex w-full items-center justify-center gap-4 text-center text-4xl font-bold text-white md:text-5xl;
  }

  img {
    @apply h-auto max-h-full w-auto max-w-full rounded-lg object-contain;
  }
</style>
