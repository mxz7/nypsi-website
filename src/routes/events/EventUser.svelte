<script lang="ts">
  import type { NypsiEvent } from "$lib/server/functions/event";
  import { auth } from "$lib/state.svelte";
  import { cubicOut } from "svelte/easing";
  import { Tween } from "svelte/motion";

  interface Props {
    position: number;
    user: NypsiEvent["contributions"][number];
  }

  let { position, user }: Props = $props();

  const value = new Tween(Number(user.contribution), { easing: cubicOut, duration: 1500 });

  $effect(() => {
    value.set(Number(user.contribution));
  });
</script>

<li class="bg-base-300 flex w-full items-center gap-3 rounded-lg p-3">
  <span class="w-8 shrink-0 text-right text-slate-400">#{position}</span>

  <!-- Make user info flex-grow, truncate inside span -->
  <div class="flex min-w-0 flex-1 items-center gap-2">
    <img
      src={user.user.avatar}
      class="{position === 1 ? 'h-9 w-9' : 'h-6 w-6'} h-6 w-6 shrink-0 rounded-full"
      onerror={(e) =>
        ((e.target as HTMLImageElement).src = "https://cdn.discordapp.com/embed/avatars/0.png")}
      alt=""
    />
    <a
      href="/users/{user.user.id}"
      class="link-hover truncate overflow-hidden text-ellipsis whitespace-nowrap {position === 1
        ? 'text-primary text-lg font-semibold'
        : ''}"
    >
      <span
        class="block min-w-0 truncate overflow-hidden text-ellipsis whitespace-nowrap {user.user
          .id === (auth.value?.authenticated && auth.value?.user.id)
          ? 'text-primary'
          : ''}"
      >
        {user.user.lastKnownUsername}
      </span>
    </a>
  </div>

  <span class="shrink-0 text-right">
    {Math.round(value.current).toLocaleString()}
  </span>
</li>
