<script lang="ts">
  import tooltip from "$lib/Tooltips.js";
  import Loading from "$lib/components/Loading.svelte";
  import Profile from "$lib/components/users/Profile.svelte";
  import { fly } from "svelte/transition";

  export let data;
</script>

<svelte:head>
  <title>dashboard | nypsi</title>
</svelte:head>

<div class="flex w-full justify-center">
  <div class="overflow-show mt-4 flex h-40 w-full justify-center sm:mt-8">
    <div class="flex h-fit w-full flex-col sm:w-[50vw]">
      {#await data.streamed.userData}
        <div class="relative mt-10 h-full w-full">
          <Loading
            fadeInSettings={{ delay: 50, duration: 100 }}
            fadeOutSettings={{ duration: 100 }}
          />
        </div>
      {:then userData}
        {#if userData.message === "success"}
          <a
            href="/user/{userData.id}"
            class="w-full px-3"
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
</div>

<slot />
