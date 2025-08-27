import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"


interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: {
    value: number
    label: string
  }
}

export function StatsCard({ title, value, description, icon: Icon, trend }: StatsCardProps) {

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="transition-all duration-200 animate-in fade-in-0 zoom-in-95 duration-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
          <CardTitle className="text-xs sm:text-sm font-medium leading-tight">{title}</CardTitle>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          <div className="text-xl sm:text-2xl font-bold">{value}</div>
          {description && <p className="text-xs text-muted-foreground mt-1 leading-tight">{description}</p>}
          {trend && (
            <div className="flex items-center pt-1">
              <span className={`text-xs ${trend.value > 0 ? "text-green-600" : "text-red-600"}`}>
                {trend.value > 0 ? "+" : ""}
                {trend.value}%
              </span>
              <span className="text-xs text-muted-foreground ml-1">{trend.label}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
