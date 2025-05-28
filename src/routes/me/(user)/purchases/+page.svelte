<script lang="ts">
  let { data } = $props();
</script>

<svelte:head>
  <title>purchases | nypsi</title>
</svelte:head>

<h1 class="text-center text-3xl font-bold text-white">purchases</h1>

<div class="flex items-end">
  {#if data.premium.premium}
    <a
      href="https://help.ko-fi.com/hc/en-us/articles/4405488403473-How-do-I-Cancel-or-Manage-My-Membership-to-a-Creator-#how-do-i-cancel-or-manage-my-membership-to-a-creator--0-0"
      target="_blank"
      class="link text-center text-xs">manage membership</a
    >
  {/if}

  <p class="mb-1 grow pr-1 text-right text-sm text-slate-300 sm:text-lg">
    total spent <span class="text-primary font-semibold">
      {Intl.NumberFormat(data.locale || "en-UK", { style: "currency", currency: "GBP" }).format(
        data.totalSpend,
      )}
    </span>
  </p>
</div>

{#if data.history.length === 0}
  <p>you have not bought anything from our store {"):"}</p>
{:else}
  <div class="mt-4 overflow-x-auto">
    <table class="table">
      <!-- head -->
      <thead>
        <tr>
          <th>date</th>
          <th>item</th>

          {#if data.history.find((i) => i.source !== "kofi")}
            <th>source</th>
          {/if}
          <th>cost</th>
        </tr>
      </thead>
      <tbody>
        {#each data.history as purchase}
          <tr>
            <td>{new Date(purchase.createdAt).toLocaleDateString()}</td>
            <td>{purchase.amount ? `${purchase.amount}x ${purchase.item}` : purchase.item}</td>
            {#if data.history.find((i) => i.source !== "kofi")}
              <td>{purchase.source}</td>
            {/if}
            <td
              >{Intl.NumberFormat(data.locale || "en-UK", {
                style: "currency",
                currency: "GBP",
              }).format(purchase.cost)}</td
            >
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <p class="pl-1 text-xs text-slate-500">since {new Date("2023-07-20").toLocaleDateString()}</p>
{/if}
