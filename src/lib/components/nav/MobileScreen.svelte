<script lang="ts">
  import { navigating, page } from "$app/stores";
  import { paths, type PathsData } from "$lib/data/docs";
  import { auth } from "$lib/state.svelte";
  import {
    ArrowLeft,
    BadgePoundSterling,
    ChartArea,
    Coins,
    LogOut,
    UserRound,
    X,
  } from "lucide-svelte";
  import { fade, fly } from "svelte/transition";

  let { visible = $bindable(false) } = $props();

  navigating.subscribe(() => (visible = false));
</script>

{#snippet renderDocsPath(path: { name: string; path: string; children?: PathsData })}
  <li>
    {#if path.children}
      <details open={$page.url.pathname.startsWith(path.path)}>
        <summary class={$page.url.pathname.startsWith(path.path) ? "text-primary" : ""}
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
        class={path.path === $page.url.pathname ? "text-primary" : ""}
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
    class="fixed left-0 top-0 z-20 h-full w-[70%] overflow-y-scroll rounded-box border-r border-primary border-opacity-15 bg-base-200 bg-opacity-95 p-2 shadow-xl shadow-base-300"
  >
    <button class="btn btn-ghost" onclick={() => (visible = !visible)}>
      <X strokeWidth={2.5} />
    </button>

    <br />

    {#if $page.url.pathname.startsWith("/docs")}
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
    {:else}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <ul class="menu font-medium">
        <li><a href="/" class={$page.url.pathname === "/" ? "text-primary" : ""}>home</a></li>
        <li>
          <a
            href="/leaderboard"
            class={$page.url.pathname.startsWith("/leaderboard") ? "text-primary" : ""}
            >leaderboards</a
          >
        </li>
        <li>
          <a href="/item/dave" class={$page.url.pathname.startsWith("/item") ? "text-primary" : ""}
            >items</a
          >
        </li>
        <li>
          <a href="/status" class={$page.url.pathname.startsWith("/status") ? "text-primary" : ""}
            >status</a
          >
        </li>
        <li><a href="/docs/faq">docs</a></li>
        <li><a href="/discord" target="_blank">discord</a></li>

        <li>
          <a href="https://ko-fi.com/tekoh/tiers" target="_blank">
            <span
              class="bg-gradient-to-br from-violet-500 to-purple-500 bg-clip-text font-bold text-transparent"
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
                  class="flex items-center {$page.url.pathname.startsWith('/me/stats')
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
                  class="flex items-center {$page.url.pathname.startsWith('/me/graphs')
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
                  class="flex items-center {$page.url.pathname.startsWith('/me/purchases')
                    ? 'text-primary'
                    : ''}"
                  href="/me/purchases"
                >
                  <BadgePoundSterling size={16} />
                  <span>purchases</span>
                </a>
              </li>

              <li class="mt-2">
                <a
                  href="/user/{auth.value?.authenticated ? auth.value.user.id : null}"
                  class="flex items-center"
                >
                  <UserRound size={16} />
                  <span>profile</span>
                </a>
              </li>
            </ul>
          </li>
          <li>
            <a href="/logout" class="flex items-center text-xs text-error">
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
    class="fixed left-0 top-0 z-10 h-full w-full backdrop-blur-sm"
    role="button"
    onclick={() => (visible = !visible)}
  ></div>
{/if}
