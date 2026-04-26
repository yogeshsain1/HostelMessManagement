"use client"

import Link from "next/link"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AdminBackupPage() {
	return (
		<DashboardLayout>
			<div className="mx-auto max-w-3xl space-y-6">
				<div>
					<h1 className="text-3xl font-bold text-foreground">Backup & Restore</h1>
					<p className="mt-1 text-muted-foreground">
						This admin route is reserved for future backup and restore tools.
					</p>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Route Status</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-sm text-muted-foreground">
							The page is now available so the route resolves correctly, even though the
							backup workflow has not been implemented yet.
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
