<script lang="ts">
  import { getUserLocale } from "$lib/api/locale.remote";
  import type { LotteryChartRange, LotteryHistoryResult } from "$lib/api/lottery.remote";
  import Card from "$lib/components/ui/Card.svelte";
  import { History } from "@lucide/svelte";

  interface Props {
    historyData: LotteryHistoryResult;
    currentPage: number;
    range: LotteryChartRange;
  }

  let { historyData, currentPage, range }: Props = $props();

  const locale = await getUserLocale();
</script>

<Card mode="section" class="mx-auto w-full max-w-6xl overflow-x-auto">
  <h2 class="mb-4 flex items-center gap-2 text-xl font-bold">
    <span class="rounded-box bg-base-300 p-2">
      <History class="text-primary" />
    </span>
    <span>lottery history</span>
  </h2>

  {#if historyData.draws.length === 0}
    <p class="text-base-content/70 py-6 text-center text-sm">no lottery history found</p>
  {:else}
    <div class="overflow-x-auto">
      <table class="table-sm table w-full">
        <tbody>
          {#each historyData.draws as draw}
            <tr class="border-base-300 border-b last:border-b-0">
              <td class="px-0 py-2">
                <article
                  class="bg-base-200 rounded-box flex flex-col gap-2 p-3 lg:flex-row lg:justify-between"
                >
                  <div>
                    <header class="mb-1 flex items-center gap-2">
                      <h3 class="text-lg font-bold text-white">draw #{draw.id.toLocaleString()}</h3>
                      {#if draw.type === "superdraw"}
                        <span class="badge badge-warning badge-outline">superdraw</span>
                      {/if}
                    </header>

                    <p class="text-base-content/70 text-sm">
                      {new Date(draw.date).toLocaleDateString(locale)}, {new Date(
                        draw.date,
                      ).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}
                    </p>

                    {#if draw.winner}
                      <p class="mt-1 text-sm">
                        winner:
                        <a class="link link-primary" href="/users/{draw.winner.id}"
                          >{draw.winner.username}</a
                        >
                      </p>
                    {:else}
                      <p class="text-base-content/70 mt-1 text-sm">no winner recorded</p>
                    {/if}
                  </div>

                  <dl class="grid grid-cols-2 gap-x-4 gap-y-1 text-sm lg:text-right">
                    <dt class="text-base-content/60">winning tickets</dt>
                    <dd class="font-semibold text-white">{draw.winnerTickets.toLocaleString()}</dd>

                    <dt class="text-base-content/60">total pool</dt>
                    <dd class="font-semibold text-white">${draw.totalTickets.toLocaleString()}</dd>
                  </dl>
                </article>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <div class="mt-3 flex w-full justify-center">
      <div class="join">
        <a
          class="btn join-item {currentPage <= 1 ? 'btn-disabled pointer-events-none' : ''}"
          href="?range={range}&page={Math.max(1, currentPage - 1)}">«</a
        >
        <span class="btn join-item"
          >page {historyData.page.toLocaleString()} / {historyData.totalPages.toLocaleString()}</span
        >
        <a
          class="btn join-item {currentPage >= historyData.totalPages
            ? 'btn-disabled pointer-events-none'
            : ''}"
          href="?range={range}&page={Math.min(historyData.totalPages, currentPage + 1)}">»</a
        >
      </div>
    </div>
  {/if}
</Card>
