"use client"

import Link from "next/link"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AdminEventsPage() {
	return (
		<DashboardLayout>
			<div className="mx-auto max-w-3xl space-y-6">
				<div>
					<h1 className="text-3xl font-bold text-foreground">Admin Events</h1>
					<p className="mt-1 text-muted-foreground">
						This route is reserved for event scheduling and announcements.
					</p>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Route Status</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-sm text-muted-foreground">
							The page is now available so navigation and route generation work correctly.
						</p>
						<Button asChild>
							<Link href="/dashboard/admin">Back to Admin Dashboard</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		</DashboardLayout>
	)
}
