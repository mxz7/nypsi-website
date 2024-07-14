<script lang="ts">
  import Chart from "$lib/components/Chart.svelte";
  import type { ChartOptions } from "chart.js";
  import dayjs from "dayjs";

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
        grid: {
          display: false,
        },
        position: "right",
        beginAtZero: true,
      },
      1: {
        position: "left",
        beginAtZero: true,
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
        grid: {
          display: false,
        },
        position: "right",
        beginAtZero: true,
      },
      1: {
        position: "left",
        beginAtZero: true,
      },
    },
  };

  const cmdChartOptions: ChartOptions = {
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
        ticks: {
          maxTicksLimit: 7,
          callback(tickValue, index, ticks) {
            return dayjs(tickValue).format("YYYY-MM-DD HH:mm:ss");
          },
        },
      },
      2: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        position: "right",
      },
      1: {
        beginAtZero: true,
        position: "left",
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

    <h2 class="mt-16 text-center text-3xl font-bold">command preprocessing</h2>
    <div class="mt-6 w-full">
      <Chart chartData={data.preprocessGraph} chartOptions={cmdChartOptions} />
    </div>
  </div>
</div>
