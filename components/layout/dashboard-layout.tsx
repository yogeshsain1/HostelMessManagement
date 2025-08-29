"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useAuth, useLogout } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { NotificationDropdown } from "@/components/notifications/notification-dropdown"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import {
  AlertTriangle,
  BarChart3,
  Building,
  Calendar,
  GraduationCap,
  Home,
  LogIn,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  User,
  Users,
  UtensilsCrossed,
  Wrench,
  X,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { toast } from "sonner"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth()
  const logout = useLogout()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const getNavigation = () => {
    const baseNavigation = [
      { name: "Dashboard", href: "/dashboard", icon: Home },
      { name: "Profile", href: "/dashboard/profile", icon: User },
    ]

    if (user?.role === "admin") {
      return [
        ...baseNavigation,
        { name: "User Management", href: "/dashboard/admin/users", icon: Users },
        { name: "All Complaints", href: "/dashboard/admin/complaints", icon: MessageSquare },
        { name: "Leave Requests", href: "/dashboard/admin/leave", icon: Calendar },
        { name: "Mess Management", href: "/dashboard/admin/mess", icon: UtensilsCrossed },
        { name: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
        { name: "Settings", href: "/dashboard/admin/settings", icon: Settings },
      ]
    }

            if (user?.role === "warden") {
          return [
            ...baseNavigation,
            { name: "Complaints", href: "/dashboard/warden/complaints", icon: MessageSquare },
            { name: "Leave Requests", href: "/dashboard/warden/leave", icon: Calendar },
            { name: "Residents", href: "/dashboard/warden/residents", icon: Users },
            { name: "Mess Menu", href: "/dashboard/warden/mess", icon: UtensilsCrossed },
            { name: "Reports", href: "/dashboard/warden/reports", icon: BarChart3 },
            { name: "Emergency Alerts", href: "/dashboard/warden/emergency-alerts", icon: AlertTriangle },
            { name: "Visitor Management", href: "/dashboard/warden/visitor-management", icon: LogIn },
            { name: "Maintenance", href: "/dashboard/warden/maintenance", icon: Wrench },
            { name: "Student Performance", href: "/dashboard/warden/student-performance", icon: GraduationCap },
          ]
        }

    // Student navigation
    return [
      ...baseNavigation,
      { name: "Mess", href: "/dashboard/mess", icon: UtensilsCrossed },
      { name: "Hostel", href: "/dashboard/hostel", icon: Building },
      { name: "Complaints", href: "/dashboard/complaints", icon: MessageSquare },
      { name: "Leave Requests", href: "/dashboard/leave", icon: Calendar },
    ]
  }

  const navigation = getNavigation()
  // Demo keyboard shortcuts and quick help toast
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSidebarOpen((v) => !v)
        toast.info("Toggled sidebar (Ctrl+K)")
      }
      if (e.shiftKey && e.key.toLowerCase() === 'm') {
        e.preventDefault()
        window.location.href = "/dashboard/mess"
        toast.success("Navigating to Mess (Shift+M)")
      }
      if (e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault()
        window.location.href = "/dashboard/admin/analytics"
        toast.success("Navigating to Analytics (Shift+A)")
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // One-time demo help toast
  useEffect(() => {
    try {
      const shown = localStorage.getItem('demo-help-shown')
      if (!shown) {
        toast.message("Demo Shortcuts", {
          description: "Ctrl+K: Toggle sidebar · Shift+M: Mess · Shift+A: Analytics",
        })
        localStorage.setItem('demo-help-shown', '1')
      }
    } catch (_) {
      // ignore storage errors
    }
  }, [])

  const isActive = (href: string) => pathname === href

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden animate-in fade-in-0 duration-200"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-64 bg-card/95 backdrop-blur-md border-r border-border/50 shadow-lg transform transition-all duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0 animate-in slide-in-from-left-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 sm:h-14 px-4 sm:px-6 border-b border-border/50">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-10 h-10 sm:w-8 sm:h-8 relative animate-in zoom-in-0 duration-500 hover:scale-110 transition-transform">
              <Image src="/images/poornima-logo.png" alt="Poornima University" fill className="object-contain" />
            </div>
            <div className="animate-in slide-in-from-left-2 duration-500 delay-100">
              <h1 className="text-base sm:text-lg font-bold text-gradient">
                {user?.role === "admin" ? "Admin Panel" : user?.role === "warden" ? "Warden Portal" : "Student Portal"}
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Poornima University, Jaipur</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden btn-modern h-10 w-10 sm:h-8 sm:w-8"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5 sm:h-4 sm:w-4" />
          </Button>
        </div>

        <nav className="mt-4 sm:mt-6 px-2 sm:px-3">
          <div className="space-y-1">
            {navigation.map((item, index) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 sm:px-3 sm:py-2 text-sm font-medium rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] animate-in slide-in-from-left-2 min-h-[44px] sm:min-h-[36px] group ${
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground shadow-lg gradient-primary"
                      : "text-muted-foreground hover:bg-accent/80 hover:text-accent-foreground hover:shadow-md"
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="mr-3 h-5 w-5 sm:h-4 sm:w-4 transition-all duration-300 group-hover:scale-110 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 border-t border-border/50 animate-in slide-in-from-bottom-2 duration-500 delay-300 bg-card/50 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 sm:h-8 sm:w-8 transition-all duration-300 hover:scale-110 flex-shrink-0 ring-2 ring-primary/20">
              <AvatarFallback className="text-sm sm:text-xs gradient-primary text-primary-foreground">
                {user?.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.fullName}</p>
              <Badge
                variant="secondary"
                className={`text-xs transition-all duration-300 hover:scale-105 ${
                  user?.role === "admin"
                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                    : user?.role === "warden"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                      : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                }`}
              >
                {user?.role}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-30 glass-effect border-b border-border/50 animate-in slide-in-from-top-2 duration-500">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden btn-modern h-10 w-10 sm:h-8 sm:w-8"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5 sm:h-4 sm:w-4" />
            </Button>

            <div className="flex items-center space-x-2 sm:space-x-4 animate-in slide-in-from-right-2 duration-500 delay-200">
              <ThemeToggle />
              <NotificationDropdown />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 sm:h-8 sm:w-8 rounded-full btn-modern">
                    <Avatar className="h-10 w-10 sm:h-8 sm:w-8 ring-2 ring-primary/20">
                      <AvatarFallback className="text-sm sm:text-xs">
                        {user?.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 animate-in slide-in-from-top-2 duration-200 card-modern"
                  align="end"
                >
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="transition-all duration-200 hover:scale-[1.02] cursor-pointer">
                    <Link href="/dashboard/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="transition-all duration-200 hover:scale-[1.02] cursor-pointer">
                    <Link href="/dashboard/notifications">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Notifications
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === "admin" && (
                    <DropdownMenuItem asChild className="transition-all duration-200 hover:scale-[1.02] cursor-pointer">
                      <Link href="/dashboard/admin/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        Admin Settings
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="transition-all duration-200 hover:scale-[1.02] cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <main className="p-4 sm:p-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">{children}</main>
      </div>
    </div>
  )
}
