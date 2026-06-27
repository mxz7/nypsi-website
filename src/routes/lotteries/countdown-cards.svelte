<script lang="ts">
  import { getUserLocale } from "$lib/api/locale.remote";
  import Card from "$lib/components/ui/Card.svelte";
  import { MStoTime } from "$lib/functions/time";
  import { Crown, Timer } from "@lucide/svelte";

  interface Props {
    now: number;
  }

  let { now }: Props = $props();

  const locale = $derived(await getUserLocale());

  function getNextLotteryDate(from: Date) {
    const date = new Date(from);
    const utcHour = date.getUTCHours();
    const nextLotteryHour = (Math.floor(utcHour / 8) + 1) * 8;

    if (nextLotteryHour >= 24) {
      date.setUTCDate(date.getUTCDate() + 1);
      date.setUTCHours(nextLotteryHour - 24, 0, 0, 0);
    } else {
      date.setUTCHours(nextLotteryHour, 0, 0, 0);
    }

    return date;
  }

  function getNextSuperdrawDate(from: Date) {
    const target = new Date(from);
    target.setUTCHours(0, 0, 0, 0);

    const day = target.getUTCDay();
    const daysUntilSaturday = (6 - day + 7) % 7;

    target.setUTCDate(target.getUTCDate() + daysUntilSaturday);

    if (target.getTime() <= from.getTime()) {
      target.setUTCDate(target.getUTCDate() + 7);
    }

    return target;
  }

  const nextLotteryAt = $derived(getNextLotteryDate(new Date(now)));
  const nextSuperdrawAt = $derived(getNextSuperdrawDate(new Date(now)));

  const adjustedNextLotteryAt = $derived.by(() => {
    const lotteryDate = new Date(nextLotteryAt);

    if (lotteryDate.getTime() === nextSuperdrawAt.getTime()) {
      lotteryDate.setUTCHours(lotteryDate.getUTCHours() + 8);
    }

    return lotteryDate;
  });

  const nextLotteryMs = $derived(Math.max(0, adjustedNextLotteryAt.getTime() - now));
  const nextSuperdrawMs = $derived(Math.max(0, nextSuperdrawAt.getTime() - now));

  const superdrawScheduleText = $derived.by(() => {
    const weekday = nextSuperdrawAt.toLocaleDateString(locale, { weekday: "long" });
    const time = nextSuperdrawAt.toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${weekday.toLowerCase()} at ${time}`;
  });
</script>

<section class="grid gap-4 lg:grid-cols-2">
  <Card mode="section">
    <h2 class="mb-4 flex items-center gap-2 text-xl font-bold">
      <span class="rounded-box bg-base-300 p-2">
        <Timer class="text-primary" />
      </span>
      <span>next lottery</span>
    </h2>

    <p class="mb-1 text-3xl font-bold text-white tabular-nums">
      {MStoTime(nextLotteryMs, { long: true, showSeconds: false })}
    </p>
    <p class="text-base-content/60 mt-2 text-xs">every 8 hours</p>
  </Card>

  <Card
    mode="section"
    class="border-amber-300/40 bg-linear-to-br from-amber-200/15 via-yellow-300/10 to-amber-500/20"
  >
    <h2 class="mb-4 flex items-center gap-2 text-xl font-bold text-amber-200">
      <span class="rounded-box bg-amber-500/20 p-2">
        <Crown class="text-amber-300" />
      </span>
      <span>next superdraw</span>
    </h2>

    <p class="mb-1 text-3xl font-extrabold text-amber-300 tabular-nums">
      {MStoTime(nextSuperdrawMs, { long: true, showSeconds: false })}
    </p>
    <p class="mt-auto text-xs text-amber-100/70">every {superdrawScheduleText}</p>
  </Card>
</section>
