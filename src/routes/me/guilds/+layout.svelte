<script>
  import { page } from "$app/state";
  import { auth } from "$lib/state.svelte";
  import { ArrowLeft } from "@lucide/svelte";
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
    <li><h2 class="menu-title">server management</h2></li>

    <li class="m-0">
      <a class="text-sm opacity-70" href="/me">
        <ArrowLeft size={16} />
        <span>back</span>
      </a>
    </li>

    {#each data.guilds as guild}
      <li class={(parseInt(guild.permissions) & 0x20) == 0x20 ? "" : "disabled"}>
        <a
          class="flex items-center {page.url.pathname.startsWith(`/me/guilds/${guild.id}`)
            ? 'text-primary font-medium'
            : ''} {(parseInt(guild.permissions) & 0x20) == 0x20 ? '' : 'cursor-not-allowed'}"
          href="/me/guilds/{guild.id}"
        >
          <img
            src={guild.icon
              ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}`
              : "https://cdn.discordapp.com/avatars/678711738845102087/cb2dcd61010f2b89ceb1cd5ff15816cf.png?size=256"}
            alt=""
            height="256"
            width="256"
            class="h-8 w-8 rounded-xl"
            loading="lazy"
            decoding="async"
          />
          <span>{guild.name}</span>
        </a>
      </li>
    {/each}
  </ul>

  <div class="w-full p-4 lg:p-0">
    {@render children()}
  </div>
</div>
