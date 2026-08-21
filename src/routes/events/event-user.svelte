<script lang="ts">
  import type { NypsiEvent } from "$lib/server/functions/event";
  import { auth } from "$lib/state.svelte";
  import { scale } from "svelte/transition";

  interface Props {
    position: number;
    user: NypsiEvent["contributions"][number];
  }

  let { position, user }: Props = $props();
</script>

<span class="text-base-content/50 w-8 self-center text-right tabular-nums">#{position}</span>

<div class="avatar self-center">
  <div class="{position === 1 ? 'size-10' : 'size-9'} rounded-full">
    <img
      src={user.user.avatar}
      width={position === 1 ? 40 : 36}
      height={position === 1 ? 40 : 36}
      decoding="async"
      onerror={(e) =>
        ((e.target as HTMLImageElement).src = "https://cdn.discordapp.com/embed/avatars/0.png")}
      alt=""
    />
  </div>
</div>

<div class="list-col-grow min-w-0 self-center">
  <a
    href="/users/{user.user.id}"
    class="link-hover block truncate font-semibold {position === 1 ? 'text-primary text-lg' : ''}"
  >
    <span
      class="block min-w-0 truncate {user.user.id ===
      (auth.value?.authenticated && auth.value?.user.id)
        ? 'text-primary'
        : ''}"
    >
      {user.user.lastKnownUsername}
    </span>
  </a>
</div>

<span class="self-center text-right font-medium whitespace-nowrap tabular-nums">
  {#key user.contribution}
    <span class="inline-block" in:scale={{ duration: 220, start: 0.65 }}>
      {Number(user.contribution).toLocaleString()}
    </span>
  {/key}
</span>
