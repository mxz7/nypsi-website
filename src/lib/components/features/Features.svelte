<script>
  import {
    BadgeDollarSign,
    Bell,
    Book,
    Clipboard,
    Coins,
    Hammer,
    Keyboard,
    Leaf,
  } from "@lucide/svelte";
</script>

<div id="features">
  <div class="bg-base-200 w-full">
    <div class="mx-auto w-full py-28 lg:max-w-5xl">
      <h2>
        <div class="bg-base-300 rounded-lg p-3">
          <BadgeDollarSign class="text-primary" size={32} strokeWidth={2.5} />
        </div>
        <span>economy</span>
      </h2>
      <div class="grid w-full grid-cols-1 px-3 lg:grid-cols-2 lg:px-0">
        <ul>
          <li>resets twice a year with <strong>real money rewards</strong></li>
          <li>over 150+ items to collect</li>
          <li>bakery, gambling, farming, workers, minecraft, cryptocurrency and much more</li>
          <li><a href="/seasons" class="link" target="_blank">view season history</a></li>
          <li><a href="/leaderboard" class="link" target="_blank">view leaderboards</a></li>
        </ul>
        <div class="pt-0 lg:pl-12">
          <picture>
            <source srcset="https://cdn.nypsi.xyz/static/features/economy.avif" type="image/avif" />
            <img
              src="https://cdn.nypsi.xyz/static/features/economy.webp"
              alt="networth command"
              loading="lazy"
              decoding="async"
              width="814"
              height="954"
            />
          </picture>
        </div>
      </div>
    </div>
  </div>

  <div class="mx-auto w-full py-28 lg:max-w-5xl">
    <h2>
      <div class="bg-base-300 rounded-lg p-3">
        <Keyboard class="text-primary" size={32} strokeWidth={2.5} />
      </div>
      <span>chat reactions</span>
    </h2>
    <div class="grid w-full grid-cols-1 px-3 lg:grid-cols-2 lg:px-0">
      <ul>
        <li>fun typing game for all server members</li>
        <li>
          uses word lists from
          <a href="https://monkeytype.com" target="_blank" class="link"> monkeytype </a>
          - or
          <a href="/docs/chat-reactions/word-lists" target="_blank" class="link">
            create your own
          </a>
        </li>
        <li>customisable timings</li>
        <li>duel specific players with $cr duel</li>
        <li>view leaderboards with $cr lb</li>
        <li>
          compete in official tournaments for a <a href="/badges#keyboard" class="link"
            >keyboard tag</a
          >
        </li>
      </ul>
      <div class="pt-0 lg:-order-1 lg:pr-12">
        <picture>
          <source
            srcset="https://cdn.nypsi.xyz/static/features/chatreaction.avif"
            type="image/avif"
          />
          <img
            src="https://cdn.nypsi.xyz/static/features/chatreaction.webp"
            alt="chat reaction"
            loading="lazy"
            decoding="async"
            width="682"
            height="510"
          />
        </picture>
      </div>
    </div>
  </div>

  <div class="bg-base-200 w-full">
    <div class="mx-auto w-full py-28 lg:max-w-5xl">
      <h2>
        <div class="bg-base-300 rounded-lg p-3">
          <Coins class="text-primary" size={32} strokeWidth={2.5} />
        </div>
        <span>gambling</span>
      </h2>
      <div class="grid w-full grid-cols-1 px-3 lg:grid-cols-2 lg:px-0">
        <ul>
          <li>
            many different gambling games including blackjack, mines, dragon tower, races and
            scratch cards
          </li>
          <li>earn xp to level up</li>
          <li>contribute earned rewards to guilds for higher bonuses</li>
          <li>use boosters to push the limits</li>
        </ul>
        <div class="pt-0 lg:pl-12">
          <picture>
            <source
              srcset="https://cdn.nypsi.xyz/static/features/scratchcard.avif"
              type="image/avif"
            />
            <img
              src="https://cdn.nypsi.xyz/static/features/scratchcard.webp"
              alt="finished scratch card"
              loading="lazy"
              decoding="async"
              width="674"
              height="716"
            />
          </picture>
        </div>
      </div>
    </div>
  </div>

  <div class="mx-auto w-full py-28 lg:max-w-5xl">
    <h2>
      <div class="bg-base-300 rounded-lg p-3">
        <Hammer class="text-primary" size={32} strokeWidth={2.5} />
      </div>
      <span>moderation</span>
    </h2>
    <div class="grid w-full grid-cols-1 px-3 lg:grid-cols-2 lg:px-0">
      <ul>
        <li>full standard moderation suite</li>
        <li>case system with uploadable evidence screenshots</li>
        <li>customisable automute with custom cooldown time</li>
        <li>chat filter with similarity % to catch people trying to evade detection</li>
        <li>alt management - add known alts to users to punish together</li>
      </ul>
      <div class="pt-0 lg:-order-1 lg:pr-12">
        <picture>
          <source
            srcset="https://cdn.nypsi.xyz/static/features/moderation.avif"
            type="image/avif"
          />
          <img
            src="https://cdn.nypsi.xyz/static/features/moderation.webp"
            alt="modlogs"
            loading="lazy"
            decoding="async"
            width="924"
            height="1150"
          />
        </picture>
      </div>
    </div>
  </div>

  <div class="bg-base-200 w-full">
    <div class="mx-auto w-full py-28 lg:max-w-5xl">
      <h2>
        <div class="bg-base-300 rounded-lg p-3">
          <Book class="text-primary" size={32} strokeWidth={2.5} />
        </div>
        <span>reaction roles</span>
      </h2>
      <div class="grid w-full grid-cols-1 px-3 lg:grid-cols-2 lg:px-0">
        <ul>
          <li>modern implementation using buttons rather than emojis reactions</li>
          <li>use an emoji or a text label</li>
          <li>unique and many modes preventing users from collecting all roles</li>
          <li>role whitelist - require members to have a specific role before using</li>
        </ul>
        <div class="pt-0 lg:pl-12">
          <picture>
            <source
              srcset="https://cdn.nypsi.xyz/static/features/reactionroles.avif"
              type="image/avif"
            />
            <img
              src="https://cdn.nypsi.xyz/static/features/reactionroles.webp"
              alt="reaction roles"
              loading="lazy"
              decoding="async"
              width="872"
              height="1158"
            />
          </picture>
        </div>
      </div>
    </div>
  </div>

  <div class="mx-auto w-full py-28 lg:max-w-5xl">
    <h2>
      <div class="bg-base-300 rounded-lg p-3">
        <Clipboard class="text-primary" size={32} strokeWidth={2.5} />
      </div>
      <span>role persist</span>
    </h2>
    <div class="grid w-full grid-cols-1 px-3 lg:grid-cols-2 lg:px-0">
      <ul>
        <li>prevent members from losing specific roles when they leave the server</li>
        <li>
          it's as easy as doing /role persist add {"<role>"}
        </li>
        <li>role data is deleted after 30 days</li>
      </ul>
      <div class="pt-0 lg:-order-1 lg:pr-12">
        <picture>
          <source
            srcset="https://cdn.nypsi.xyz/static/features/rolepersist.avif"
            type="image/avif"
          />
          <img
            src="https://cdn.nypsi.xyz/static/features/rolepersist.webp"
            alt="role persist list"
            loading="lazy"
            decoding="async"
            width="550"
            height="316"
          />
        </picture>
      </div>
    </div>
  </div>

  <div class="bg-base-200 w-full">
    <div class="mx-auto w-full py-28 lg:max-w-5xl">
      <h2>
        <div class="bg-base-300 rounded-lg p-3">
          <Bell class="text-primary" size={32} strokeWidth={2.5} />
        </div>
        <span>mention history</span>
      </h2>
      <div class="grid w-full grid-cols-1 px-3 lg:grid-cols-2 lg:px-0">
        <ul>
          <li>no more annoying ghost pings 🙄</li>
          <li>works in every server</li>
          <li>your messages are safe with two layer encryption</li>
        </ul>
        <div class="pt-0 lg:pl-12">
          <picture>
            <source srcset="https://cdn.nypsi.xyz/static/features/pings.avif" type="image/avif" />
            <img
              src="https://cdn.nypsi.xyz/static/features/pings.webp"
              alt="pings command"
              loading="lazy"
              decoding="async"
              width="606"
              height="706"
            />
          </picture>
        </div>
      </div>
    </div>
  </div>

  <div class="mx-auto w-full py-28 lg:max-w-5xl">
    <h2>
      <div class="bg-base-300 rounded-lg p-3">
        <Leaf class="text-primary" size={32} strokeWidth={2.5} />
      </div>
      <span>farms</span>
    </h2>
    <div class="grid w-full grid-cols-1 px-3 lg:grid-cols-2 lg:px-0">
      <ul>
        <li>grow plants and make money from your yield</li>
        <li>take care of your plants with watering and fertiliser</li>
      </ul>
      <div class="pt-0 lg:-order-1 lg:pr-12">
        <picture>
          <source srcset="https://cdn.nypsi.xyz/static/features/farm.avif" type="image/avif" />
          <img
            src="https://cdn.nypsi.xyz/static/features/farm.webp"
            alt="role persist list"
            loading="lazy"
            decoding="async"
            width="1196"
            height="668"
          />
        </picture>
      </div>
    </div>
  </div>
</div>

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
