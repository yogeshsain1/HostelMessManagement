"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"

interface MenuItem {
  id: number
  name: string
  items: string
  date: string
  mealType: string
  time: string
  isVeg: boolean
}

const initialMeals: MenuItem[] = [
  {
    id: 1,
    name: "Breakfast",
    items: "Aloo Paratha (2 pcs), Curd, Pickle, Tea/Coffee",
    date: "2024-01-15",
    mealType: "breakfast",
    time: "7:00 AM - 9:00 AM",
    isVeg: true
  },
  {
    id: 2,
    name: "Lunch",
    items: "Dal Baati Churma, Gatte Ki Sabzi, Steamed Rice, Buttermilk, Papad",
    date: "2024-01-15",
    mealType: "lunch",
    time: "12:00 PM - 2:00 PM",
    isVeg: true
  },
  {
    id: 3,
    name: "Snacks",
    items: "Kachori (2 pcs), Green Chutney, Samosa (1 pc), Tea/Coffee",
    date: "2024-01-15",
    mealType: "snacks",
    time: "4:00 PM - 6:00 PM",
    isVeg: true
  },
  {
    id: 4,
    name: "Dinner",
    items: "Roti (4 pcs), Rajasthani Kadhi, Jeera Rice, Mixed Dal, Salad",
    date: "2024-01-15",
    mealType: "dinner",
    time: "7:30 PM - 9:30 PM",
    isVeg: true
  },
]

export default function ManageMenuPage() {
  const [meals, setMeals] = useState<MenuItem[]>(initialMeals)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [newMeal, setNewMeal] = useState({
    name: "",
    items: "",
    date: "",
    mealType: "",
    time: "",
    isVeg: true
  })
  const [selectedDate, setSelectedDate] = useState("2024-01-15")

  const handleAddMeal = () => {
    if (newMeal.name && newMeal.items && newMeal.date && newMeal.mealType && newMeal.time) {
      setMeals([...meals, { ...newMeal, id: Date.now() }])
      setNewMeal({ name: "", items: "", date: "", mealType: "", time: "", isVeg: true })
    }
  }

  const handleEditMeal = (id: number) => {
    setEditingId(id)
  }

  const handleSaveEdit = (id: number, updatedMeal: Partial<MenuItem>) => {
    setMeals(meals.map(meal => meal.id === id ? { ...meal, ...updatedMeal } : meal))
    setEditingId(null)
  }

  const handleDeleteMeal = (id: number) => {
    setMeals(meals.filter(meal => meal.id !== id))
  }

  const filteredMeals = meals.filter(meal => meal.date === selectedDate)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Menu Management</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage daily mess menus for all meal types.
          </p>
        </div>

        <Tabs defaultValue="view" className="space-y-4">
          <TabsList>
            <TabsTrigger value="view">View Menu</TabsTrigger>
            <TabsTrigger value="add">Add Meal</TabsTrigger>
          </TabsList>

          <TabsContent value="view" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Daily Menu - {selectedDate}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="date-select">Select Date:</Label>
                  <Input
                    id="date-select"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-auto"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredMeals.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No meals found for this date. Add meals using the "Add Meal" tab.
                    </p>
                  ) : (
                    filteredMeals.map(meal => (
                      <Card key={meal.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          {editingId === meal.id ? (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Meal Name</Label>
                                  <Input
                                    value={meal.name}
                                    onChange={(e) => handleSaveEdit(meal.id, { name: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <Label>Meal Type</Label>
                                  <Select
                                    value={meal.mealType}
                                    onValueChange={(value) => handleSaveEdit(meal.id, { mealType: value })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="breakfast">Breakfast</SelectItem>
                                      <SelectItem value="lunch">Lunch</SelectItem>
                                      <SelectItem value="snacks">Snacks</SelectItem>
                                      <SelectItem value="dinner">Dinner</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div>
                                <Label>Items</Label>
                                <Textarea
                                  value={meal.items}
                                  onChange={(e) => handleSaveEdit(meal.id, { items: e.target.value })}
                                  rows={3}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Time</Label>
                                  <Input
                                    value={meal.time}
                                    onChange={(e) => handleSaveEdit(meal.id, { time: e.target.value })}
                                  />
                                </div>
                                <div className="flex items-center space-x-2 pt-8">
                                  <Button
                                    size="sm"
                                    onClick={() => setEditingId(null)}
                                    variant="outline"
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    Cancel
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => setEditingId(null)}
                                  >
                                    <Save className="h-4 w-4 mr-1" />
                                    Save
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-semibold text-lg">{meal.name}</h3>
                                  <Badge variant={meal.isVeg ? "default" : "destructive"}>
                                    {meal.isVeg ? "Veg" : "Non-Veg"}
                                  </Badge>
                                  <Badge variant="outline">{meal.mealType}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{meal.time}</p>
                                <p className="text-sm">{meal.items}</p>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditMeal(meal.id)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteMeal(meal.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Add New Meal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Meal Name</Label>
                    <Input
                      placeholder="e.g., Breakfast"
                      value={newMeal.name}
                      onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Meal Type</Label>
                    <Select
                      value={newMeal.mealType}
                      onValueChange={(value) => setNewMeal({ ...newMeal, mealType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select meal type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="breakfast">Breakfast</SelectItem>
                        <SelectItem value="lunch">Lunch</SelectItem>
                        <SelectItem value="snacks">Snacks</SelectItem>
                        <SelectItem value="dinner">Dinner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Items</Label>
                  <Textarea
                    placeholder="List all items separated by commas"
                    value={newMeal.items}
                    onChange={(e) => setNewMeal({ ...newMeal, items: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={newMeal.date}
                      onChange={(e) => setNewMeal({ ...newMeal, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Time</Label>
                    <Input
                      placeholder="e.g., 7:00 AM - 9:00 AM"
                      value={newMeal.time}
                      onChange={(e) => setNewMeal({ ...newMeal, time: e.target.value })}
                    />
                  </div>
                </div>

                <Button onClick={handleAddMeal} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Meal
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
