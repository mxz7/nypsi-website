<script>
  import chatReaction from "$lib/assets/features/chatreaction.png";
  import economy from "$lib/assets/features/economy.png";
  import moderation from "$lib/assets/features/moderation.png";
  import pings from "$lib/assets/features/pings.png";
  import reactionRoles from "$lib/assets/features/reactionroles.png";
  import rolePersist from "$lib/assets/features/rolepersist.png";
  import scratchCard from "$lib/assets/features/scratchcard.png";
  import {
    BadgeDollarSign,
    Bell,
    Book,
    Clipboard,
    Coins,
    Hammer,
    Keyboard,
    Speech,
  } from "lucide-svelte";
</script>

<div class="flex w-full justify-center bg-base-200" id="features">
  <div class="w-full py-28 lg:max-w-4xl">
    <h2
      class="mb-14 flex w-full items-center justify-center gap-4 text-center text-5xl font-semibold"
    >
      <div class="rounded-lg bg-base-300 p-3">
        <BadgeDollarSign class="text-primary" size={32} strokeWidth={2.5} />
      </div>
      <span>economy</span>
    </h2>
    <div class="grid w-full grid-cols-1 px-6 lg:grid-cols-2 lg:px-0">
      <ul class="flex h-full flex-col justify-center gap-3 text-lg">
        <li>resets twice a year with <strong>real money rewards</strong></li>
        <li>over 150+ items to collect</li>
        <li>bakery, gambling, farming, workers, minecraft, cryptocurrency and much more</li>
        <li><a href="/seasons" class="link" target="_blank">view season history</a></li>
        <li><a href="/leaderboard" class="link" target="_blank">view leaderboards</a></li>
      </ul>
      <div class="pt-0 lg:pl-12">
        <img
          class="h-auto max-h-full w-auto max-w-full rounded-lg object-contain"
          src={economy}
          alt="networth command"
          loading="lazy"
        />
      </div>
    </div>
  </div>
</div>

<div class="flex w-full justify-center bg-base-100" id="features">
  <div class="w-full py-28 lg:max-w-4xl">
    <h2
      class="mb-14 flex w-full items-center justify-center gap-4 text-center text-5xl font-semibold"
    >
      <div class="rounded-lg bg-base-300 p-3">
        <Keyboard class="text-primary" size={32} strokeWidth={2.5} />
      </div>
      <span>chat reactions</span>
    </h2>
    <div class="grid w-full grid-cols-1 px-6 lg:grid-cols-2 lg:px-0">
      <ul class="flex h-full flex-col justify-center gap-3 text-lg">
        <li>fun typing game for all server members</li>
        <li>
          uses word lists from <a href="https://monkeytype.com" target="_blank" class="link"
            >monkeytype</a
          >
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
        <img
          class="h-auto max-h-full w-auto max-w-full rounded-lg object-contain"
          src={chatReaction}
          alt="chat reaction message"
          loading="lazy"
        />
      </div>
    </div>
  </div>
</div>

<div class="flex w-full justify-center bg-base-200" id="features">
  <div class="w-full py-28 lg:max-w-4xl">
    <h2
      class="mb-14 flex w-full items-center justify-center gap-4 text-center text-5xl font-semibold"
    >
      <div class="rounded-lg bg-base-300 p-3">
        <Coins class="text-primary" size={32} strokeWidth={2.5} />
      </div>
      <span>gambling</span>
    </h2>
    <div class="grid w-full grid-cols-1 px-6 lg:grid-cols-2 lg:px-0">
      <ul class="flex h-full flex-col justify-center gap-3 text-lg">
        <li>
          many different gambling games including blackjack, mines, dragon tower, races and scratch
          cards
        </li>
        <li>earn xp to level up</li>
        <li>contribute earned rewards to guilds for higher bonuses</li>
        <li>use boosters to push the limits</li>
      </ul>
      <div class="pt-0 lg:pl-12">
        <img
          class="h-auto max-h-full w-auto max-w-full rounded-lg object-contain"
          src={scratchCard}
          alt="scratch card finished game"
          loading="lazy"
        />
      </div>
    </div>
  </div>
</div>

<div class="flex w-full justify-center bg-base-100" id="features">
  <div class="w-full py-28 lg:max-w-4xl">
    <h2
      class="mb-14 flex w-full items-center justify-center gap-4 text-center text-5xl font-semibold"
    >
      <div class="rounded-lg bg-base-300 p-3">
        <Hammer class="text-primary" size={32} strokeWidth={2.5} />
      </div>
      <span>moderation</span>
    </h2>
    <div class="grid w-full grid-cols-1 px-6 lg:grid-cols-2 lg:px-0">
      <ul class="flex h-full flex-col justify-center gap-3 text-lg">
        <li>full standard moderation suite</li>
        <li>case system with uploadable evidence screenshots</li>
        <li>customisable automute with custom cooldown time</li>
        <li>chat filter with similarity % to catch people trying to evade detection</li>
        <li>alt management - add known alts to users to punish together</li>
      </ul>
      <div class="pt-0 lg:-order-1 lg:pr-12">
        <img
          class="h-auto max-h-full w-auto max-w-full rounded-lg object-contain"
          src={moderation}
          alt="modlogs"
          loading="lazy"
        />
      </div>
    </div>
  </div>
</div>

<div class="flex w-full justify-center bg-base-200" id="features">
  <div class="w-full py-28 lg:max-w-4xl">
    <h2
      class="mb-14 flex w-full items-center justify-center gap-4 text-center text-5xl font-semibold"
    >
      <div class="rounded-lg bg-base-300 p-3">
        <Book class="text-primary" size={32} strokeWidth={2.5} />
      </div>
      <span>reaction roles</span>
    </h2>
    <div class="grid w-full grid-cols-1 px-6 lg:grid-cols-2 lg:px-0">
      <ul class="flex h-full flex-col justify-center gap-3 text-lg">
        <li>modern implementation using buttons rather than emojis reactions</li>
        <li>use an emoji or a text label</li>
        <li>unique and many modes preventing users from collecting all roles</li>
        <li>role whitelist - require members to have a specific role before using</li>
      </ul>
      <div class="pt-0 lg:pl-12">
        <img
          class="h-auto max-h-full w-auto max-w-full rounded-lg object-contain"
          src={reactionRoles}
          alt="reaction roles"
          loading="lazy"
        />
      </div>
    </div>
  </div>
</div>

<div class="flex w-full justify-center bg-base-100" id="features">
  <div class="w-full py-28 lg:max-w-4xl">
    <h2
      class="mb-14 flex w-full items-center justify-center gap-4 text-center text-5xl font-semibold"
    >
      <div class="rounded-lg bg-base-300 p-3">
        <Clipboard class="text-primary" size={32} strokeWidth={2.5} />
      </div>
      <span>role persist</span>
    </h2>
    <div class="grid w-full grid-cols-1 px-6 lg:grid-cols-2 lg:px-0">
      <ul class="flex h-full flex-col justify-center gap-3 text-lg">
        <li>prevent members from losing specific roles when they leave the server</li>
        <li>
          it's as easy as doing /role persist add {"<role>"}
        </li>
        <li>role data is deleted after 30 days</li>
      </ul>
      <div class="pt-0 lg:-order-1 lg:pr-12">
        <img
          class="h-auto max-h-full w-auto max-w-full rounded-lg object-contain"
          src={rolePersist}
          alt="role persist list"
          loading="lazy"
        />
      </div>
    </div>
  </div>
</div>

<div class="flex w-full justify-center bg-base-200" id="features">
  <div class="w-full py-28 lg:max-w-4xl">
    <h2
      class="mb-14 flex w-full items-center justify-center gap-4 text-center text-5xl font-semibold"
    >
      <div class="rounded-lg bg-base-300 p-3">
        <Bell class="text-primary" size={32} strokeWidth={2.5} />
      </div>
      <span>mention history</span>
    </h2>
    <div class="grid w-full grid-cols-1 px-6 lg:grid-cols-2 lg:px-0">
      <ul class="flex h-full flex-col justify-center gap-3 text-lg">
        <li>no more annoying ghost pings 🙄</li>
        <li>works in every server</li>
        <li>your messages are safe with two layer encryption</li>
      </ul>
      <div class="pt-0 lg:pl-12">
        <img
          class="h-auto max-h-full w-auto max-w-full rounded-lg object-contain"
          src={pings}
          alt="pings command"
          loading="lazy"
        />
      </div>
    </div>
  </div>
</div>
