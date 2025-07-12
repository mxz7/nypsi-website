<script lang="ts">
  import { navigating, page } from "$app/state";
  import { paths, type PathsData } from "$lib/data/docs";
  import { auth, guildsData } from "$lib/state.svelte";
  import {
    ArrowLeft,
    BadgePoundSterling,
    ChartArea,
    Coins,
    Image,
    LogOut,
    Server,
    ShieldAlert,
    UserRound,
    X,
  } from "@lucide/svelte";
  import { fade, fly } from "svelte/transition";

  let { visible = $bindable(false) } = $props();

  $effect(() => {
    if (navigating.to) visible = false;
  });
</script>

{#snippet renderDocsPath(path: { name: string; path: string; children?: PathsData })}
  <li>
    {#if path.children}
      <details open={page.url.pathname.startsWith(path.path)}>
        <summary class={page.url.pathname.startsWith(path.path) ? "text-primary" : ""}
          >{path.name.replaceAll("-", " ")}</summary
        >
        <ul>
          {#each Object.values(path.children) as child}
            {@render renderDocsPath(child)}
          {/each}
        </ul>
      </details>
    {:else}
      <a
        data-sveltekit-preload-code="eager"
        class={path.path === page.url.pathname ? "text-primary" : ""}
        href={path.path}
      >
        {path.name.replaceAll("-", " ")}
      </a>
    {/if}
  </li>
{/snippet}

{#if visible}
  <div
    in:fly={{ x: -200, duration: 250 }}
    out:fly={{ x: -200, duration: 250 }}
    class="rounded-box border-primary/15 bg-base-200/95 shadow-base-300 fixed top-0 left-0 z-20 h-full w-[70%] overflow-y-scroll border-r p-2 shadow-xl"
  >
    <button class="btn btn-ghost" onclick={() => (visible = !visible)}>
      <X strokeWidth={2.5} />
    </button>

    <br />

    {#if page.url.pathname.startsWith("/docs")}
      <ul class="menu font-medium">
        <li>
          <a class="opacity-70" href="/">
            <ArrowLeft size={16} />
            <span>back home</span>
          </a>
        </li>
      </ul>

      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <ul class="menu font-medium">
        <h2 class="menu-title">nypsi docs</h2>

        {#each paths.filter((p) => !p.path.includes("privacy") && !p.path.includes("terms")) as path}
          {@render renderDocsPath(path)}
        {/each}
      </ul>
    {:else if page.url.pathname.startsWith("/me/guilds") && guildsData.value}
      <ul class="menu font-medium">
        <li>
          <a class="opacity-70" href="/me/stats">
            <ArrowLeft size={16} />
            <span>back</span>
          </a>
        </li>
      </ul>

      <ul class="menu font-medium">
        <h2 class="menu-title">server management</h2>

        {#each guildsData.value as guild}
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
    {:else}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <ul class="menu font-medium">
        <li><a href="/" class={page.url.pathname === "/" ? "text-primary" : ""}>home</a></li>
        <li>
          <a
            href="/leaderboards"
            class={page.url.pathname.startsWith("/leaderboards") ? "text-primary" : ""}
            >leaderboards</a
          >
        </li>
        <li>
          <a href="/items" class={page.url.pathname.startsWith("/items") ? "text-primary" : ""}
            >items</a
          >
        </li>
        <li>
          <a href="/events" class={page.url.pathname.startsWith("/events") ? "text-primary" : ""}
            >events</a
          >
        </li>
        <li>
          <a href="/status" class={page.url.pathname.startsWith("/status") ? "text-primary" : ""}
            >status</a
          >
        </li>
        <li><a href="/docs">docs</a></li>
        <li><a href="/discord" target="_blank">discord</a></li>

        <li>
          <a href="https://ko-fi.com/nypsi/tiers" target="_blank">
            <span
              class="bg-linear-to-br from-violet-500 to-purple-500 bg-clip-text font-bold text-transparent"
              >premium</span
            >
          </a>
        </li>

        {#if auth.value?.authenticated}
          <li class="mt-1">
            <h2 class="menu-title">dashboard</h2>

            <ul>
              <li>
                <a
                  class="flex items-center {page.url.pathname.startsWith('/me/stats')
                    ? 'text-primary'
                    : ''}"
                  href="/me/stats"
                >
                  <Coins size={16} />
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
                  <ChartArea size={16} />
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
                  <BadgePoundSterling size={16} />
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
                  <Image size={16} />
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
                  <Image size={16} />
                  <span>punishments</span>
                </a>
              </li>

              {#if auth.value.authenticated && auth.value.user.adminLevel > 0}
                <li>
                  <a
                    class="flex items-center {page.url.pathname.startsWith('/me/admin')
                      ? 'text-primary'
                      : 'text-error'}"
                    href="/me/admin"
                  >
                    <ShieldAlert size={16} />
                    <span>admin</span>
                  </a>
                </li>
              {/if}

              <li class="mt-2">
                <a
                  href="/user/{auth.value?.authenticated ? auth.value.user.id : null}"
                  class="flex items-center"
                >
                  <UserRound size={16} />
                  <span>profile</span>
                </a>
              </li>

              <li>
                <a href="/me/guilds" class="flex items-center">
                  <Server size={16} />
                  <span>manage servers</span>
                </a>
              </li>
            </ul>
          </li>
          <li>
            <a href="/logout" class="text-error flex items-center text-xs">
              <LogOut size={12} />
              <span>log out</span></a
            >
          </li>
        {/if}
      </ul>
    {/if}
  </div>

  <!-- svelte-ignore a11y_click_events_have_key_events  -->
  <!-- svelte-ignore a11y_interactive_supports_focus -->
  <div
    in:fade={{ duration: 250 }}
    out:fade={{ duration: 250 }}
    class="fixed top-0 left-0 z-10 h-full w-full backdrop-blur-xs"
    role="button"
    onclick={() => (visible = !visible)}
  ></div>
{/if}
