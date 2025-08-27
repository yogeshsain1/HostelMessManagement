import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function MessMenuPage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Weekly Mess Menu</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">View, add, or edit meals for each day.</p>
          <Link href="/dashboard/mess/menu/manage">
            <button className="bg-primary text-white px-4 py-2 rounded">Manage Menu</button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
