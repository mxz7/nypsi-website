<script lang="ts">
  import { page } from "$app/stores";
  import tooltip from "$lib/Tooltips.js";
  import Profile from "$lib/components/users/Profile.svelte";
  import { auth } from "$lib/data/stores.js";
  import { onMount } from "svelte";

  let graphsAllowed = $state(false);

  let { data, children } = $props();

  $auth = { authenticated: Boolean(data.user), user: data.user };

  onMount(() => {
    if (data.baseData?.Premium?.level > 0) graphsAllowed = true;
  });
</script>

<div class="mt-4 flex w-full justify-center">
  <div class="w-full px-4 lg:max-w-5xl lg:px-0">
    {#if data.baseData}
      <a
        href="/user/{data.baseData.id}"
        use:tooltip={{
          content: "click to view your profile",
          theme: "tooltip",
          placement: "bottom",
        }}
      >
        <Profile baseData={data.baseData} userData={data.userData} items={data.items} />
      </a>
    {/if}

    <div class="mb-4 mt-3 flex w-full flex-row justify-center">
      {#if graphsAllowed}
        <a
          class="grow {$page.url.pathname.includes('/graphs')
            ? 'border-b-primary'
            : ''} border-b border-slate-700 pb-2 text-center hover:border-primary"
          href="/me/graphs"
        >
          graphs
        </a>
      {:else}
        <a
          class="grow cursor-not-allowed border-b border-slate-700 pb-2 text-center hover:border-error"
          href="/me"
          use:tooltip={{
            theme: "tooltip",
            placement: "top",
            allowHTML: true,
            content:
              'you require <a href="https://ko-fi.com/tekoh/tiers" target="_blank" class="text-primary link">premium</a> to view graphs',
            interactive: true,
          }}
        >
          graphs
        </a>
      {/if}

      <a
        class="grow border-b border-slate-700 pb-2 text-center hover:border-primary {$page.url.pathname.includes(
          '/stats',
        )
          ? 'border-b-primary'
          : ''}"
        href="/me/stats"
      >
        stats
      </a>

      <a
        class="grow border-b border-slate-700 pb-2 text-center hover:border-primary {$page.url.pathname.includes(
          '/purchasehistory',
        )
          ? 'border-b-primary'
          : ''}"
        href="/me/purchasehistory"
      >
        purchases
      </a>
    </div>

    {@render children?.()}
  </div>
</div>
