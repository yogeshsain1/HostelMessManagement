import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface AnalyticsCardProps {
  title: string
  value: string | number
  change: {
    value: number
    label: string
    trend: "up" | "down"
  }
  icon: LucideIcon
  color: string
}

export function AnalyticsCard({ title, value, change, icon: Icon, color }: AnalyticsCardProps) {
  const TrendIcon = change.trend === "up" ? TrendingUp : TrendingDown
  const trendColor = change.trend === "up" ? "text-green-600" : "text-red-600"

  return (
    <Card className="transition-all duration-200 hover:scale-[1.02] animate-in fade-in-0 zoom-in-95 duration-500">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <div className={`flex items-center text-sm ${trendColor}`}>
              <TrendIcon className="h-4 w-4 mr-1" />
              {change.trend === "up" ? "+" : ""}
              {change.value}% {change.label}
            </div>
          </div>
          <Icon className={`h-8 w-8 ${color}`} />
        </div>
      </CardContent>
    </Card>
  )
}
