"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

interface LegendItem {
  label: string
  value: string
  color: string
}

interface MetricChartCardProps {
  title: string
  legend: LegendItem[]
  data: { date: string; value: number }[]
  dataKey?: string
  color?: string
  valueFormatter?: (v: number) => string
}

export function MetricChartCard({
  title,
  legend,
  data,
  dataKey = "value",
  color = "hsl(var(--chart-1))",
  valueFormatter,
}: MetricChartCardProps) {
  const chartConfig = {
    [dataKey]: {
      label: title,
      color,
    },
  } satisfies ChartConfig

  return (
    <Card className="flex flex-col shadow-none">
      <CardHeader className="space-y-1 p-4 pb-3">
        <CardTitle className="text-[13px] font-medium">{title}</CardTitle>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {legend.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[11px] text-muted-foreground">
                {item.label}
              </span>
              <span className="text-[12px] font-medium tabular-nums">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4 pt-0 pb-3">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[100px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={data}
            margin={{ left: 12, right: 12, top: 4, bottom: 0 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={48}
              tick={{ fontSize: 10 }}
            />
            <ChartTooltip
              cursor={{ fill: "var(--muted)", opacity: 0.5 }}
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey={dataKey}
                  labelFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  formatter={
                    valueFormatter
                      ? (v) => valueFormatter(v as number)
                      : undefined
                  }
                />
              }
            />
            <Bar
              dataKey={dataKey}
              fill={`var(--color-${dataKey})`}
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
