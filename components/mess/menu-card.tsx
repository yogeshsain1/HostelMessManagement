import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Star } from "lucide-react"

interface MenuItem {
  name: string
  description?: string
  isVeg: boolean
}

interface MenuCardProps {
  mealType: "breakfast" | "lunch" | "snacks" | "dinner"
  items: MenuItem[]
  time: string
  rating?: number
}

const mealTypeColors = {
  breakfast: "bg-orange-100 text-orange-800",
  lunch: "bg-green-100 text-green-800",
  snacks: "bg-purple-100 text-purple-800",
  dinner: "bg-blue-100 text-blue-800",
}

export function MenuCard({ mealType, items, time, rating }: MenuCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="capitalize">{mealType}</CardTitle>
          <Badge className={mealTypeColors[mealType]}>{mealType}</Badge>
        </div>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{time}</span>
          </div>
          {rating && (
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{rating}/5</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm">{item.name}</span>
              <Badge variant={item.isVeg ? "secondary" : "destructive"} className="text-xs">
                {item.isVeg ? "VEG" : "NON-VEG"}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
