<script lang="ts">
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
    Popcorn,
  } from "@lucide/svelte";
  import FeaturesSection from "./FeaturesSection.svelte";
</script>

<section id="features">
  <FeaturesSection
    title="economy"
    list={[
      "resets twice a year with real money rewards",
      "over 150+ items to collect",
      "bakery, gambling, farming, workers, minecraft, cryptocurrency and much more",
      "season history",
      "leaderboards",
    ]}
    image="economy"
    Icon={BadgeDollarSign}
    flipped={false}
  />

  <FeaturesSection
    title="cats"
    list={[
      "collect popular silly cats you know and love from tiktok and instagram",
      "dave is the bot owner's personal cat (:",
      "there's also flowers if you're not a cat person. you loser.",
    ]}
    image="cats"
    Icon={Cat}
    flipped={true}
  />

  <FeaturesSection
    title="farms"
    list={[
      "grow plants and make money from your yield",
      "take care of your plants with watering and fertiliser",
      "upgrade your farms with silos and hoes for even more production",
    ]}
    image="farm"
    Icon={Leaf}
    flipped={false}
  />

  <FeaturesSection
    title="movies & tv shows"
    list={[
      "show information for any movie or tv show",
      "rate your favourites",
      "find places to watch",
      "powered by <a href='https://themoviedb.org' target='_blank' class='link'>the movie db</a>",
    ]}
    image="tmdb"
    Icon={Popcorn}
    flipped={true}
  />

  <FeaturesSection
    title="chat reactions"
    list={[
      "fun typing game for all server members",
      "uses word lists from <a href='https://monkeytype.com' target='_blank' class='link'>monkeytype</a> - or <a href='/docs/chat-reactions/word-lists' target='_blank' class='link'>create your own</a>",
      "customisable timings",
      "duel specific players with $cr duel",
      "view leaderboards with $cr lb",
    ]}
    image="chatreaction"
    Icon={Keyboard}
    flipped={false}
  />

  <FeaturesSection
    title="guess the flag"
    list={[
      "fun game to play on your own or against others",
      "uses a global list of every country's flag",
      "helps you to learn all the flags (i'm still shit at them)",
    ]}
    image="guesstheflag"
    Icon={Flag}
    flipped={true}
  />

  <FeaturesSection
    title="gambling"
    list={[
      "many different gambling games including blackjack, mines, dragon tower, races and scratch cards",
      "earn xp to level up",
      "contribute earned rewards to guilds for higher bonuses",
      "use boosters to push the limits",
    ]}
    image="gambling"
    Icon={Coins}
    flipped={false}
  />

  <FeaturesSection
    title="moderation"
    list={[
      "full standard moderation suite",
      "case system with uploadable evidence screenshots",
      "customisable automute with custom cooldown time",
      "chat filter with similarity % to catch people trying to evade detection",
      "alt management - add known alts to users to punish together",
    ]}
    image="moderation"
    Icon={Hammer}
    flipped={true}
  />

  <FeaturesSection
    title="reaction roles"
    list={[
      "modern implementation using buttons rather than emojis reactions",
      "use an emoji or a text label",
      "unique and many modes preventing users from collecting all roles",
      "role whitelist - require members to have a specific role before using",
    ]}
    image="reactionroles"
    Icon={Book}
    flipped={false}
  />

  <FeaturesSection
    title="mention history"
    list={[
      "no more annoying ghost pings 🙄",
      "works in every server",
      "your messages are safe with two layer encryption",
    ]}
    image="mentions"
    Icon={Bell}
    flipped={true}
  />
</section>
