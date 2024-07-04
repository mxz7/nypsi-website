<script lang="ts">
  import Chart from "$lib/components/Chart.svelte";
  import type { ChartOptions } from "chart.js";
  import { sort } from "fast-sort";

  export let data;

  const queryChartOptions: ChartOptions = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        intersect: false,
        mode: "index",
        callbacks: {
          label(tooltipItem) {
            if (tooltipItem.dataset.label.includes("average"))
              return `average query time: ${tooltipItem.formattedValue}ms`;

            return `${tooltipItem.dataset.label}: ${tooltipItem.formattedValue}`;
          },
        },
      },
    },
    maintainAspectRatio: false,
    responsive: true,
    elements: {
      line: {
        tension: 0.2,
      },
      point: {
        radius: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 7,
        },
      },
      2: {
        // min: 0,
        // max: Number(sort(data.queryGraph.data.datasets[1].data).desc()[0]) * 2,
        suggestedMax: Number(sort(data.queryGraph.data.datasets[1].data).desc()[0]) * 1.5,
        suggestedMin: Number(sort(data.queryGraph.data.datasets[1].data).asc()[0]) / 1.5,
        grid: {
          display: false,
        },
        position: "right",
        ticks: {
          callback(tickValue) {
            return Math.floor(Number(tickValue)).toLocaleString();
          },
          // maxTicksLimit: 3,
          // autoSkipPadding: 100,
        },
      },
      1: {
        suggestedMax: Number(sort(data.queryGraph.data.datasets[0].data).desc()[0]) * 1.5,
        suggestedMin: Number(sort(data.queryGraph.data.datasets[0].data).asc()[0]) / 1.5,
        position: "left",
        ticks: {
          callback(tickValue) {
            return Math.floor(Number(tickValue)).toLocaleString();
          },
          // maxTicksLimit: 3,
          // autoSkipPadding: 100,
        },
      },
    },
  };

  const userChartOptions: ChartOptions = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        intersect: false,
        mode: "index",
      },
    },
    maintainAspectRatio: false,
    responsive: true,
    elements: {
      line: {
        tension: 0.2,
      },
      point: {
        radius: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 7,
        },
      },
      2: {
        // min: 0,
        // max: Number(sort(data.queryGraph.data.datasets[1].data).desc()[0]) * 2,
        suggestedMax: Number(sort(data.usersCommandsGraph.data.datasets[1].data).desc()[0]) * 1.5,
        suggestedMin: Number(sort(data.usersCommandsGraph.data.datasets[1].data).asc()[0]) / 1.5,
        grid: {
          display: false,
        },
        position: "right",
        ticks: {
          callback(tickValue) {
            return Math.floor(Number(tickValue)).toLocaleString();
          },
          // maxTicksLimit: 3,
          // autoSkipPadding: 100,
        },
      },
      1: {
        suggestedMax: Number(sort(data.usersCommandsGraph.data.datasets[0].data).desc()[0]) * 1.5,
        suggestedMin: Number(sort(data.usersCommandsGraph.data.datasets[0].data).asc()[0]) / 1.5,
        position: "left",
        ticks: {
          callback(tickValue) {
            return Math.floor(Number(tickValue)).toLocaleString();
          },
          // maxTicksLimit: 3,
          // autoSkipPadding: 100,
        },
      },
    },
  };
</script>

<div class="flex w-full justify-center">
  <div class="mt-14 w-full max-w-6xl">
    <h2 class="text-center text-3xl font-bold">database queries</h2>
    <div class="mt-6 w-full">
      <Chart chartData={data.queryGraph} chartOptions={queryChartOptions} />
    </div>

    <h2 class="mt-16 text-center text-3xl font-bold">active users and commands</h2>
    <div class="mt-6 w-full">
      <Chart chartData={data.usersCommandsGraph} chartOptions={userChartOptions} />
    </div>
  </div>
</div>
