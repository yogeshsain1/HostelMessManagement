import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, Star, Dot } from "lucide-react"

interface MenuItem {
  name: string
  isVeg: boolean // We'll determine this based on common patterns
}

interface MenuCardProps {
  mealType: string
  items: string[]
  time: string
  rating?: number
  date?: string
}

const mealTypeColors = {
  breakfast: "bg-orange-100 text-orange-800",
  lunch: "bg-green-100 text-green-800",
  snacks: "bg-purple-100 text-purple-800",
  dinner: "bg-blue-100 text-blue-800",
}

// Helper function to determine if an item is vegetarian based on common patterns
const isVegetarian = (itemName: string): boolean => {
  const nonVegKeywords = ['chicken', 'mutton', 'fish', 'pork', 'beef', 'egg', 'meat']
  const lowerName = itemName.toLowerCase()
  return !nonVegKeywords.some(keyword => lowerName.includes(keyword))
}

export function MenuCard({ mealType, items, time, rating, date }: MenuCardProps) {
  // Convert string array to MenuItem array with veg/non-veg classification
  const menuItems: MenuItem[] = items.map(item => ({
    name: item,
    isVeg: isVegetarian(item)
  }))

  return (
    <Card className="transition-all duration-200 hover:scale-[1.01]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="capitalize">{mealType}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={mealTypeColors[mealType.toLowerCase() as keyof typeof mealTypeColors] || "bg-gray-100 text-gray-800"}>
              {mealType}
            </Badge>
            <Badge variant="outline" className="text-xs">{items.length} items</Badge>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{time}</span>
          </div>
          {date && (
            <div className="flex items-center space-x-1">
              <span>{new Date(date).toLocaleDateString()}</span>
            </div>
          )}
          {rating && (
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{rating}/5</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-40 pr-2">
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Dot className={`h-5 w-5 ${item.isVeg ? 'text-green-600' : 'text-red-600'}`} />
                  <span className="text-sm">{item.name}</span>
                </div>
                <Badge variant={item.isVeg ? "secondary" : "destructive"} className="text-[10px]">
                  {item.isVeg ? "VEG" : "NON-VEG"}
                </Badge>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
