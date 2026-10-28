<script lang="ts">
  import Chart from "#lib/components/chart.svelte";
  import type { ChartOptions } from "#lib/types/chart.js";
  import dayjs from "dayjs";

  let { data } = $props();

  const queryChartOptions: ChartOptions = {
    legend: false,
    points: 2,
    xFormat: (value) => dayjs(value).format("YYYY-MM-DD HH:mm:ss"),
  };

  const userChartOptions: ChartOptions = {
    legend: false,
    points: 1,
  };

  const gamesChartOptions: ChartOptions = {
    legend: false,
    points: 1,
    xFormat: (value) => dayjs(value).format("YYYY-MM-DD"),
    sortTooltip: true,
  };
</script>

<div class="flex w-full justify-center">
  <div class="mt-14 w-full max-w-6xl">
    <h2 class="text-center text-3xl font-bold">database queries</h2>
    <div class="mt-6 h-96 w-full">
      <Chart chartData={data.queryGraph} chartOptions={queryChartOptions} />
    </div>

    <h2 class="mt-16 text-center text-3xl font-bold">active users and commands</h2>
    <div class="mt-6 h-96 w-full">
      <Chart chartData={data.usersCommandsGraph} chartOptions={userChartOptions} />
    </div>

    <h2 class="mt-16 text-center text-3xl font-bold">command preprocessing</h2>
    <div class="mt-6 h-96 w-full">
      <Chart chartData={data.preprocessGraph} chartOptions={queryChartOptions} />
    </div>

    <h2 class="mt-16 text-center text-3xl font-bold">games by type (daily)</h2>
    <div class="mt-6 h-96 w-full">
      <Chart chartData={data.gamesGraph} chartOptions={gamesChartOptions} />
    </div>
  </div>
</div>
