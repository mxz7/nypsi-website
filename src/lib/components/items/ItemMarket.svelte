<script lang="ts">
  import { getOrders } from "$lib/api/market.remote";
  import { formatNumberPretty } from "$lib/functions/string";

  interface Props {
    itemId: string;
  }

  let { itemId }: Props = $props();

  let page = $state(1);
  let isLoading = $state(false);

  let orders = $derived(await getOrders({ itemId, page: 1 }));

  async function getMore() {
    if (isLoading) return;
    isLoading = true;
    page += 1;
    const newOrders = await getOrders({ itemId, page });
    orders = [...orders, ...newOrders];

    isLoading = false;
  }
</script>

{#snippet owner(order: Awaited<ReturnType<typeof getOrders>>[number])}
  {#if order.owner.id !== "0"}
    <a href="/users/{order.owner.id}" class="link link-hover flex items-center gap-2">
      <img
        class="h-6 w-6 rounded-full"
        src={order.owner.avatar}
        alt="{order.owner.username}'s avatar"
        decoding="async"
        loading="lazy"
      />
      <span>{order.owner.username}</span>
    </a>
  {:else}
    [hidden]
  {/if}
{/snippet}

{#snippet status(order: Awaited<ReturnType<typeof getOrders>>[number])}
  {#if order.completed}
    <span class="badge badge-soft badge-success">completed</span>
  {:else}
    <span class="badge badge-soft badge-info">available</span>
  {/if}
{/snippet}

{#snippet action(order: Awaited<ReturnType<typeof getOrders>>[number])}
  {#if !order.messageId}
    <span
      class="text-error tooltip tooltip-error"
      data-tip="this order wasn't posted in the market channel">-</span
    >
  {:else}
    <a
      href="https://discord.com/channels/747056029795221513/1008467335973179482/{order.messageId}"
      class="link link-info"
      target="_blank">jump</a
    >
  {/if}
{/snippet}

{#if orders.length === 0}
  <p class="text-center">no sell orders found</p>
{:else}
  <table class="table w-full">
    <thead>
      <tr>
        <th>date</th>
        <th>status</th>
        <th>type</th>
        <th>amount</th>
        <th>price</th>
        <th>action</th>
        <th>owner</th>
      </tr>
    </thead>
    <tbody>
      {#each orders as order}
        <tr>
          <td class="text-base-content/75 text-xs">
            <time datetime={order.createdAt.toUTCString()}
              >{order.createdAt.toLocaleDateString()}</time
            >
          </td>

          <td>{@render status(order)}</td>

          <td>{order.orderType}ing</td>

          <td>{order.itemAmount.toLocaleString()}x</td>

          <td>${formatNumberPretty(Number(order.price))}{order.itemAmount > 1 ? " ea." : ""}</td>

          <td>{@render action(order)}</td>

          <td class="truncate">{@render owner(order)}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  <button
    class="btn btn-soft mt-2 w-full {isLoading ? 'btn-disabled' : ''}"
    disabled={isLoading}
    onclick={getMore}
  >
    {#if isLoading}
      <span class="loading loading-spinner loading-sm"></span>
    {:else}
      load more
    {/if}
  </button>
{/if}
