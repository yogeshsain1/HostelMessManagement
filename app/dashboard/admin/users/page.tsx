"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Users, UserPlus, Search, Mail, Phone, MapPin } from "lucide-react"
import { useEffect, useState } from "react"

export default function AdminUsersPage() {
	const [users, setUsers] = useState<any[]>([])
	const [userCount, setUserCount] = useState<number | null>(null)
	const [studentCount, setStudentCount] = useState<number | null>(null)
	const [wardenCount, setWardenCount] = useState<number | null>(null)
	const [adminCount, setAdminCount] = useState<number | null>(null)
	const [complaintCount, setComplaintCount] = useState<number | null>(null)

	const getAuthHeaders = (): Record<string, string> => {
		const token = localStorage.getItem("auth-token")
		const headers: Record<string, string> = { "Content-Type": "application/json" }
		if (token) {
			headers["Authorization"] = `Bearer ${token}`
		}
		return headers
	}

	useEffect(() => {
		const fetchWithAuth = (url: string) => {
			return fetch(url, {
				headers: getAuthHeaders(),
			})
		}

		fetchWithAuth("/api/users?action=all")
			.then((res) => res.json())
			.then((data) => {
				if (data.error) {
					console.error("API Error:", data.error)
					setUsers([])
				} else {
					setUsers(Array.isArray(data) ? data : [])
				}
			})
			.catch((error) => {
				console.error("Fetch Error:", error)
				setUsers([])
			})

		fetchWithAuth("/api/users/count").then((res) => res.json()).then((data) => setUserCount(data.count))
		fetchWithAuth("/api/complaints/count").then((res) => res.json()).then((data) => setComplaintCount(data.count))
		fetchWithAuth("/api/users?role=student").then((res) => res.json()).then((data) => setStudentCount(data.count))
		fetchWithAuth("/api/users?role=warden").then((res) => res.json()).then((data) => setWardenCount(data.count))
		fetchWithAuth("/api/users?role=admin").then((res) => res.json()).then((data) => setAdminCount(data.count))
	}, [])

	const stats = {
		total: users.length,
		students: users.filter((u) => u.role === "student").length,
		wardens: users.filter((u) => u.role === "warden").length,
		admins: users.filter((u) => u.role === "admin").length,
	}

	const getRoleBadgeColor = (role: string) => {
		switch (role) {
			case "admin":
				return "bg-red-100 text-red-800"
			case "warden":
				return "bg-blue-100 text-blue-800"
			case "student":
				return "bg-green-100 text-green-800"
			default:
				return "bg-gray-100 text-gray-800"
		}
	}

	return (
		<DashboardLayout>
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold text-foreground">
							User Management
						</h1>
						<p className="text-muted-foreground mt-1">
							Manage all users in the hostel system.
						</p>
					</div>
					<Button>
						<UserPlus className="h-4 w-4 mr-2" />
						Add New User
					</Button>
				</div>

				{/* Stats Cards */}
				<div className="grid gap-4 md:grid-cols-5">
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center space-x-2">
								<Users className="h-4 w-4 text-blue-600" />
								<div className="space-y-1">
									<p className="text-sm font-medium">Total Users</p>
									<p className="text-2xl font-bold">
										{userCount !== null ? userCount : "..."}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center space-x-2">
								<Users className="h-4 w-4 text-green-600" />
								<div className="space-y-1">
									<p className="text-sm font-medium">Students</p>
									<p className="text-2xl font-bold">
										{studentCount !== null ? studentCount : "..."}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center space-x-2">
								<Users className="h-4 w-4 text-blue-600" />
								<div className="space-y-1">
									<p className="text-sm font-medium">Wardens</p>
									<p className="text-2xl font-bold">
										{wardenCount !== null ? wardenCount : "..."}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center space-x-2">
								<Users className="h-4 w-4 text-red-600" />
								<div className="space-y-1">
									<p className="text-sm font-medium">Admins</p>
									<p className="text-2xl font-bold">
										{adminCount !== null ? adminCount : "..."}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center space-x-2">
								<Users className="h-4 w-4 text-purple-600" />
								<div className="space-y-1">
									<p className="text-sm font-medium">Total Complaints</p>
									<p className="text-2xl font-bold">
										{complaintCount !== null ? complaintCount : "..."}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Search */}
				<Card>
					<CardContent className="p-6">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search users by name, email, or room number..."
								className="pl-10"
							/>
						</div>
					</CardContent>
				</Card>

				{/* Users List */}
				<div className="grid gap-4">
					{users.map((user) => (
						<Card key={user.id}>
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-4">
										<Avatar className="h-12 w-12">
											<AvatarFallback>
												{user.fullName
													.split(" ")
													.map((n) => n[0])
													.join("")}
											</AvatarFallback>
										</Avatar>
										<div>
											<h3 className="font-medium">{user.fullName}</h3>
											<div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
												<div className="flex items-center space-x-1">
													<Mail className="h-3 w-3" />
													<span>{user.email}</span>
												</div>
												{user.phone && (
													<div className="flex items-center space-x-1">
														<Phone className="h-3 w-3" />
														<span>{user.phone}</span>
													</div>
												)}
												{user.roomNumber && (
													<div className="flex items-center space-x-1">
														<MapPin className="h-3 w-3" />
														<span>Room {user.roomNumber}</span>
													</div>
												)}
											</div>
										</div>
									</div>
									<div className="flex items-center space-x-2">
										<Badge className={getRoleBadgeColor(user.role)}>
											{user.role}
										</Badge>
										<Badge
											variant="outline"
											className="text-green-600 border-green-200"
										>
											{user.status}
										</Badge>
										<Button variant="outline" size="sm">
											Edit
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</DashboardLayout>
	)
}
