"use client"

import { TrendingUp } from "lucide-react"
import { LabelList, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { category: "oversized", sales: 275, fill: "var(--color-oversized)" },
  { category: "graphic", sales: 200, fill: "var(--color-graphic)" },
  { category: "cords", sales: 187, fill: "var(--color-cords)" },
  { category: "new", sales: 173, fill: "var(--color-new)" },
]

const chartConfig = {
  sales: {
    label: "Sales",
  },
  oversized: {
    label: "Oversized Tees",
    color: "var(--chart-1)",
  },
  graphic: {
    label: "Graphic Tees",
    color: "var(--chart-2)",
  },
  cords: {
    label: "C-ords",
    color: "var(--chart-3)",
  },
  new: {
    label: "New Arrivals",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

export function ProductPieChart() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Product Category Distribution</CardTitle>
        <CardDescription>Sales breakdown by category</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="sales" hideLabel />}
            />
            <Pie data={chartData} dataKey="sales">
              <LabelList
                dataKey="category"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: keyof typeof chartConfig) =>
                  chartConfig[value]?.label
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Oversized Tees most popular <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Current sales distribution
        </div>
      </CardFooter>
    </Card>
  )
}
