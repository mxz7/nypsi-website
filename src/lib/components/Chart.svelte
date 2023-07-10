<script lang="ts">
  import type { UserSession } from "$lib/types/User";
  import { Chart, registerables, type ChartConfiguration } from "chart.js";
  import { onMount } from "svelte";

  let chartCanvas: HTMLCanvasElement;

  export let chartData: ChartConfiguration;
  export let user: UserSession;

  Chart.register(...registerables);

  onMount(() => {
    new Chart(chartCanvas, {
      ...chartData,
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label(tooltipItem) {
                if (tooltipItem.dataset.label.includes("items in world"))
                  return `in world: ${tooltipItem.formattedValue}`;
                else if (
                  tooltipItem.dataset.label === (user.authenticated ? user.username : "null")
                )
                  return `${user.authenticated ? user.username : "null"}: ${
                    tooltipItem.formattedValue
                  }`;

                return `${tooltipItem.dataset.label} average: $${tooltipItem.formattedValue}`;
              },
            },
          },
        },
        maintainAspectRatio: false,
        elements: {
          line: {
            tension: 0.4,
          },
          point: {
            radius: /Android|iPhone/i.test(navigator.userAgent) ? 1 : 5,
          },
        },
        scales: {
          y2: {
            position: "right",
            ticks: {
              callback(tickValue) {
                return Math.floor(Number(tickValue)).toLocaleString();
              },
            },
          },
          y1: {
            position: "left",
            ticks: {
              callback(tickValue) {
                return `$${Math.floor(Number(tickValue)).toLocaleString()}`;
              },
            },
          },
        },
      },
    });
  });
</script>

<div class="flex justify-center">
  <div class=" w-[1100px] overflow-x-scroll p-4">
    <div class="h-full w-fit px-4 sm:w-full">
      <canvas
        style="width: {/Android|iPhone/i.test(navigator.userAgent) ? '150vw' : '100%'};"
        bind:this={chartCanvas}
      />
    </div>
  </div>
</div>
