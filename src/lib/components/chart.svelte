<script lang="ts">
  import { prepareChart, type ChartRow, type PlotPoint } from "#lib/functions/chart/chart-data.js";
  import type { ChartData, ChartOptions } from "#lib/types/chart.js";
  import { curveMonotoneX } from "d3-shape";
  import { Area, Axis, Chart, Highlight, Points, Spline, Svg, Text, Tooltip } from "layerchart/svg";
  import { SvelteSet } from "svelte/reactivity";

  interface Props {
    chartData: ChartData;
    chartOptions?: ChartOptions;
  }

  let { chartData, chartOptions = {} }: Props = $props();
  const hidden = new SvelteSet<number>();
  const plot = $derived(prepareChart(chartData, hidden));
  const sparkline = $derived(chartOptions.sparkline ?? false);
  const valueFormat = $derived(
    chartOptions.valueFormat ?? ((value: number) => value.toLocaleString()),
  );
  const gradientId = $props.id();

  function xFormat(value: number) {
    const label = plot.rows.find((row) => row.x === value)?.label ?? value;
    return chartOptions.xFormat?.(label) ?? String(label);
  }

  function ticks(width: number) {
    const count = Math.max(2, Math.min(7, Math.floor(width / 120)));
    const step = Math.max(1, Math.ceil((plot.rows.length - 1) / (count - 1)));
    return plot.rows
      .filter((_, index) => index % step === 0 || index === plot.rows.length - 1)
      .map((row) => row.x);
  }

  function axisPadding(ticks: number[]) {
    return Math.max(32, ...ticks.map((value) => valueFormat(value).length * 6 + 10));
  }

  function tooltipEntries(row: ChartRow) {
    const entries = plot.series.filter(
      (series) => !hidden.has(series.index) && row.values[series.index] !== undefined,
    );
    return chartOptions.sortTooltip
      ? entries.sort((a, b) => row.values[b.index] - row.values[a.index])
      : entries;
  }
</script>

<div class="text-base-content/70 flex h-full w-full min-w-0 flex-col">
  {#if chartOptions.legend !== false && !sparkline}
    <div class="mb-3 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs">
      {#each plot.series as series (series.index)}
        <button
          type="button"
          class={[
            "btn btn-ghost btn-xs h-auto min-h-0 gap-1.5 px-1 py-1 font-normal",
            { "opacity-40": hidden.has(series.index) },
          ]}
          aria-pressed={!hidden.has(series.index)}
          onclick={() =>
            hidden.has(series.index) ? hidden.delete(series.index) : hidden.add(series.index)}
        >
          <span class="h-2 w-4 rounded-sm" style:background={series.color}></span>
          <span class={{ "line-through": hidden.has(series.index) }}>{series.label}</span>
        </button>
      {/each}
    </div>
  {/if}

  <div class="min-h-0 flex-1">
    <Chart
      data={plot.rows}
      flatData={plot.rows}
      x="x"
      y={() => 0}
      xDomain={plot.xDomain}
      yDomain={[0, 1]}
      padding={sparkline
        ? 2
        : {
            top: 8,
            bottom: 24,
            left: axisPadding(plot.leftTicks),
            right: plot.hasRightAxis ? axisPadding(plot.rightTicks) : 8,
          }}
      tooltipContext={sparkline ? false : { mode: "quadtree-x" }}
      pointerEvents={!sparkline}
    >
      {#snippet children({ context })}
        <Svg>
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stop-color="var(--color-primary)" stop-opacity="0.48" />
              <stop offset="65%" stop-color="var(--color-primary)" stop-opacity="0.12" />
              <stop offset="100%" stop-color="var(--color-primary)" stop-opacity="0" />
            </linearGradient>
          </defs>
          {#if !sparkline}
            <Axis
              placement="bottom"
              ticks={ticks(context.width)}
              format={xFormat}
              tickMarks={false}
              tickOcclusion
            >
              {#snippet tickLabel({ props })}
                <Text
                  {...props}
                  textAnchor={Number(props.x) <= 1
                    ? "start"
                    : Number(props.x) >= context.width - 1
                      ? "end"
                      : "middle"}
                />
              {/snippet}
            </Axis>
            <Axis
              placement="left"
              domain={plot.leftDomain}
              format={valueFormat}
              ticks={plot.leftTicks}
              tickMarks={false}
            />
            {#if plot.hasRightAxis}
              <Axis
                placement="right"
                domain={plot.rightDomain}
                format={valueFormat}
                ticks={plot.rightTicks}
                tickMarks={false}
              />
            {/if}
          {/if}
          {#each plot.series as series (series.index)}
            {#if !hidden.has(series.index)}
              {@const isLine = (series.kind ?? chartData.kind) === "line"}
              {#if series.fill && isLine}
                <Area
                  data={series.points}
                  x="x"
                  y1="y"
                  y0={() => series.baseline}
                  defined={(point: PlotPoint) => point.value !== null}
                  curve={curveMonotoneX}
                  fill={sparkline ? `url(#${gradientId})` : (series.fillColor ?? series.color)}
                  fillOpacity={series.fillColor || sparkline ? 1 : 0.2}
                  motion={{ type: "none" }}
                />
              {/if}
              {#if isLine}
                <Spline
                  data={series.points}
                  x="x"
                  y="y"
                  defined={(point: PlotPoint) => point.value !== null}
                  curve={curveMonotoneX}
                  stroke={series.color}
                  strokeWidth={series.width ?? 2}
                  motion={{ type: "none" }}
                />
              {/if}
              {@const radius = series.pointRadius ?? chartOptions.points ?? (isLine ? 0 : 2)}
              {#if radius > 0 || series.points.length === 1}
                <Points
                  data={series.points.filter((point) => point.value !== null)}
                  x="x"
                  y="y"
                  r={radius || 2}
                  fill={series.color}
                />
              {/if}
            {/if}
          {/each}
          {#if !sparkline}
            <Highlight lines axis="x" />
          {/if}
        </Svg>
        {#if !sparkline}
          <Tooltip.Root
            data={plot.rows.find((row) => row.x === context.tooltip.data?.x)}
            variant="none"
            class="rounded-box border-base-300 bg-base-100 text-base-content border p-3 text-xs shadow-lg"
            pointerEvents={false}
          >
            {#snippet children({ data }: { data: ChartRow })}
              <p class="mb-2 font-semibold">
                {chartOptions.xFormat?.(data.label) ?? String(data.label)}
              </p>
              {#each tooltipEntries(data) as series (series.index)}
                <div class="flex items-center gap-2 py-0.5">
                  <span class="size-2 rounded-full" style:background={series.color}></span>
                  <span
                    >{chartOptions.tooltipFormat?.(data.values[series.index], series.label) ??
                      `${series.label}: ${valueFormat(data.values[series.index])}`}</span
                  >
                </div>
              {/each}
            {/snippet}
          </Tooltip.Root>
        {/if}
      {/snippet}
    </Chart>
  </div>
</div>
