import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialMeals = [
  { id: 1, name: "Breakfast", items: "Poha, Tea", date: "2025-08-28" },
  { id: 2, name: "Lunch", items: "Dal, Rice, Roti", date: "2025-08-28" },
];

export default function ManageMenuPage() {
  const [meals, setMeals] = useState(initialMeals);
  const [newMeal, setNewMeal] = useState({ name: "", items: "", date: "" });

  const handleAddMeal = () => {
    setMeals([...meals, { ...newMeal, id: Date.now() }]);
    setNewMeal({ name: "", items: "", date: "" });
  };

  const handleDeleteMeal = (id: number) => {
    setMeals(meals.filter(meal => meal.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Manage Mess Menu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Input placeholder="Meal Name" value={newMeal.name} onChange={e => setNewMeal({ ...newMeal, name: e.target.value })} />
            <Input placeholder="Items (comma separated)" value={newMeal.items} onChange={e => setNewMeal({ ...newMeal, items: e.target.value })} />
            <Input type="date" value={newMeal.date} onChange={e => setNewMeal({ ...newMeal, date: e.target.value })} />
            <Button onClick={handleAddMeal}>Add Meal</Button>
          </div>
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Meals</h3>
            <ul className="space-y-2">
              {meals.map(meal => (
                <li key={meal.id} className="flex justify-between items-center border rounded px-3 py-2">
                  <div>
                    <span className="font-bold">{meal.name}</span> - {meal.items} <span className="text-xs text-muted-foreground">({meal.date})</span>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteMeal(meal.id)}>Delete</Button>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
