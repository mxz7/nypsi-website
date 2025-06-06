<script>
  import { page } from "$app/state";
  import { auth } from "$lib/state.svelte";
  import {
    BadgePoundSterling,
    ChartArea,
    Coins,
    Gavel,
    Image,
    LogOut,
    Server,
    UserRound,
  } from "@lucide/svelte";
  import { onMount } from "svelte";

  let { children, data } = $props();

  onMount(() => {
    if (data.user && !auth?.value) {
      auth.value = {
        authenticated: true,
        user: data.user,
      };
    }
  });
</script>

<div class="mx-auto mt-4 flex w-full max-w-6xl gap-8">
  <ul class="menu rounded-box bg-base-200 hidden h-fit w-72 p-4 lg:block">
    <li><h2 class="menu-title">dashboard</h2></li>

    <div class="pl-2">
      <li>
        <a
          class="flex items-center {page.url.pathname.startsWith('/me/stats')
            ? 'text-primary'
            : ''}"
          href="/me/stats"
        >
          <Coins />
          <span>stats</span>
        </a>
      </li>

      <li>
        <a
          class="flex items-center {page.url.pathname.startsWith('/me/graphs')
            ? 'text-primary'
            : ''}"
          href="/me/graphs"
        >
          <ChartArea />
          <span>graphs</span>
        </a>
      </li>

      <li>
        <a
          class="flex items-center {page.url.pathname.startsWith('/me/purchases')
            ? 'text-primary'
            : ''}"
          href="/me/purchases"
        >
          <BadgePoundSterling />
          <span>purchases</span>
        </a>
      </li>

      <li>
        <a
          class="flex items-center {page.url.pathname.startsWith('/me/avatars')
            ? 'text-primary'
            : ''}"
          href="/me/avatars"
        >
          <Image />
          <span>avatars</span>
        </a>
      </li>

      <li>
        <a
          class="flex items-center {page.url.pathname.startsWith('/me/punishments')
            ? 'text-primary'
            : ''}"
          href="/me/punishments"
        >
          <Gavel />
          <span>punishments</span>
        </a>
      </li>

      <div class="divider my-0"></div>

      <li>
        <a
          href="/user/{auth.value?.authenticated ? auth.value.user.id : null}"
          class="flex items-center text-sm"
        >
          <UserRound size={16} />
          <span>profile</span>
        </a>
      </li>

      <div class="divider my-0"></div>

      <li>
        <a href="/me/guilds" class="flex items-center text-sm">
          <Server size={16} />
          <span>manage servers</span>
        </a>
      </li>

      <div class="divider my-0"></div>

      <li>
        <a href="/logout" class="text-error flex items-center text-sm">
          <LogOut size={16} />
          <span>log out</span></a
        >
      </li>
    </div>
  </ul>
  <div class="w-full p-4 lg:p-0">
    {@render children()}
  </div>
</div>
