<script lang="ts">
  import type { getBaseData } from "$lib/api/users.remote";
  import Card from "$lib/components/ui/Card.svelte";
  import { formatNumberPretty } from "$lib/functions/string";
  import {
    Clock,
    CreditCard,
    DollarSign,
    Flame,
    Gamepad2,
    Globe,
    Trophy,
    Vote,
    type IconProps,
  } from "@lucide/svelte";
  import type { Component } from "svelte";

  type Props = {
    baseData: Awaited<ReturnType<typeof getBaseData>>;
    lastSeen: string;
    commandUses: number;
    achievementCompletion: number;
  };

  let { baseData, lastSeen, commandUses, achievementCompletion }: Props = $props();

  type CardData = {
    label: string;
    value: string;
    icon: Component<IconProps, {}, "">;
  };

  const cards: CardData[] = $derived([
    {
      label: "balance",
      value: `$${formatNumberPretty(Number(baseData.Economy.money))}`,
      icon: DollarSign,
    },
    {
      label: "bank",
      value: `$${formatNumberPretty(Number(baseData.Economy.bank))}`,
      icon: CreditCard,
    },
    {
      label: "net worth",
      value: `$${formatNumberPretty(Number(baseData.Economy.netWorth))}`,
      icon: Globe,
    },
    {
      label: "last seen",
      value: lastSeen,
      icon: Clock,
    },
    {
      label: "daily streak",
      value: baseData.Economy.dailyStreak.toLocaleString(),
      icon: Flame,
    },
    {
      label: "vote streak",
      value: baseData.Economy.voteStreak.toLocaleString(),
      icon: Vote,
    },
    {
      label: "command uses",
      value: commandUses.toLocaleString(),
      icon: Gamepad2,
    },
    {
      label: "completion",
      value: `${achievementCompletion.toPrecision(3)}%`,
      icon: Trophy,
    },
  ]);
</script>

{#snippet item(card: CardData)}
  {@const Icon = card.icon}
  <li>
    <Card mode="article" class="flex flex-col-reverse shadow">
      <dt class="flex items-center gap-1">
        <Icon class="text-primary size-6" />

        <h2 class="text-base-content/50 text-sm font-medium">{card.label}</h2>
      </dt>

      <dd class="text-lg font-medium">{card.value}</dd>
    </Card>
  </li>
{/snippet}

<dl class="grid list-none grid-cols-2 gap-2 md:grid-cols-4">
  {#each cards as card}
    {@render item(card)}
  {/each}
</dl>
