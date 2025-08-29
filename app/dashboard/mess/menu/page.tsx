import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
          <Button asChild>
            <Link href="/dashboard/mess/menu/manage">Manage Menu</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
