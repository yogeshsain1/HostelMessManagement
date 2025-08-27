import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line } from "recharts"

interface MiniChartProps {
  data: Array<{ name: string; value: number }>
  color: string
  height?: number
}

export function MiniChart({ data, color, height = 60 }: MiniChartProps) {
  const chartConfig = {
    value: { label: "Value", color },
  }

  return (
    <ChartContainer config={chartConfig} className={`h-[${height}px] w-full`}>
      <LineChart data={data}>
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
      </LineChart>
    </ChartContainer>
  )
}
