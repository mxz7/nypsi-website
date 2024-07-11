<script lang="ts">
  import Chart from "$lib/components/Chart.svelte";
  import type { ChartOptions } from "chart.js";
  import dayjs from "dayjs";
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
            if (tooltipItem.formattedValue.includes("(")) return null;

            return `${tooltipItem.dataset.label}: ${tooltipItem.formattedValue}`;
          },
          title(meow) {
            return dayjs(meow[0].label).format("YYYY-MM-DD HH:mm:ss");
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
        radius: 2,
      },
    },
    scales: {
      x: {
        min: data.queryGraph.data.labels[0] as number,
        max: data.queryGraph.data.labels[data.queryGraph.data.labels.length - 1] as number,
        ticks: {
          maxTicksLimit: 7,
          callback(tickValue, index, ticks) {
            return dayjs(tickValue).format("YYYY-MM-DD HH:mm:ss");
          },
        },
      },
      2: {
        beginAtZero: true,
        suggestedMax:
          // @ts-ignore
          Number(sort(data.queryGraph.data.datasets[1].data).desc((i) => i.y)[0].y) * 1.5,
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
        beginAtZero: true,
        suggestedMax:
          // @ts-ignore
          Number(sort(data.queryGraph.data.datasets[0].data).desc((i) => i.y)[0].y) * 1.5,
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
