<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import tooltip from "$lib/Tooltips.js";
  import Loading from "$lib/components/Loading.svelte";
  import Profile from "$lib/components/users/Profile.svelte";
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";

  let graphsAllowed = false;

  export let data;

  onMount(async () => {
    const userData = await Promise.resolve(data.streamed.userData);

    if (userData.message === "success" && userData?.Premium?.level > 0) {
      graphsAllowed = true;
      if ($page.url.pathname.endsWith("/me")) goto("/me/graphs");
    }
  });
</script>

<div class="mb-8 flex w-full flex-col justify-center">
  <div class="overflow-show mt-4 flex h-40 w-full justify-center sm:mt-8 md:h-[30vh]">
    <div class="flex h-fit w-full flex-col sm:w-[50vw]">
      {#await data.streamed.userData}
        <div class="relative h-full w-full">
          <Loading
            fadeInSettings={{ delay: 50, duration: 100 }}
            fadeOutSettings={{ duration: 100 }}
          />
        </div>
      {:then userData}
        {#if userData.message === "success"}
          <a
            href="/user/{userData.id}"
            class="w-full px-3 sm:px-0 sm:shadow sm:shadow-gray-950"
            use:tooltip={{
              content: "click to view your profile",
              theme: "tooltip",
              placement: "bottom",
            }}
            in:fly|global={{ delay: 100, duration: 500, y: 15 }}
          >
            <Profile {userData} items={data.items} />
          </a>
        {:else}
          <h1 class="break-words text-center font-semibold text-white">
            you haven't used nypsi!! what are you doing with your life honestly wow
          </h1>
        {/if}
      {/await}
    </div>
  </div>

  <div class="flex w-full justify-center">
    <div class="mt-3 flex w-full flex-row justify-center px-4 text-gray-200 sm:w-[60vw]">
      {#if graphsAllowed}
        <a
          class="grow {$page.url.pathname.includes('/graphs')
            ? 'border-b-accent'
            : ''} border-b border-gray-700 pb-2 text-center hover:border-accent"
          href="/me/graphs"
        >
          graphs
        </a>
      {:else}
        <a
          class="grow cursor-not-allowed border-b border-gray-700 pb-2 text-center hover:border-red-500"
          href="/me"
          use:tooltip={{
            theme: "tooltip",
            placement: "top",
            allowHTML: true,
            content:
              'you require <a href="https://ko-fi.com/tekoh/tiers" target="_blank" class="text-sky-300 underline">premium</a> to view graphs',
            interactive: true,
          }}
        >
          graphs
        </a>
      {/if}
      <!-- 
      <a
        class="grow border-b border-gray-700 pb-2 text-center hover:border-accent {$page.url.pathname.includes(
          '/stats'
        )
          ? 'border-b-accent'
          : ''}"
        href="/me/stats"
      >
        stats
      </a> -->

      <a
        class="grow border-b border-gray-700 pb-2 text-center hover:border-accent {$page.url.pathname.includes(
          '/purchasehistory',
        )
          ? 'border-b-accent'
          : ''}"
        href="/me/purchasehistory"
      >
        purchases
      </a>
    </div>
  </div>
</div>

<slot />
