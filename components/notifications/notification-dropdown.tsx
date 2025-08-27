"use client"

import { useState, useEffect } from "react"
import { io } from "socket.io-client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNotifications } from "@/lib/notifications"
import { Bell, Check, Trash2, Eye } from "lucide-react"
import Link from "next/link"

export function NotificationDropdown() {
  const { notifications, unreadCount, addNotification, markAsRead, markAllAsRead, deleteNotification } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)

  // WebSocket connection for real-time notifications
  useEffect(() => {
    const socket = io("http://localhost:4001") // Change to your backend WebSocket URL
    socket.on("notification", (data) => {
      addNotification({
        title: data.title,
        message: data.message,
        type: data.type || "info",
        category: data.category || "system",
        actionUrl: data.actionUrl,
      })
    })
    return () => {
      socket.disconnect()
    }
  }, [addNotification])

  const recentNotifications = notifications.slice(0, 5)

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return "🟢"
      case "warning":
        return "🟡"
      case "error":
        return "🔴"
      default:
        return "🔵"
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-auto p-1 text-xs">
              <Check className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {recentNotifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">No notifications</div>
        ) : (
          <ScrollArea className="h-80">
            {recentNotifications.map((notification) => (
              <div key={notification.id} className="relative">
                <DropdownMenuItem
                  className={`p-4 cursor-pointer ${!notification.read ? "bg-muted/50" : ""}`}
                  onClick={() => {
                    if (!notification.read) {
                      markAsRead(notification.id)
                    }
                    setIsOpen(false)
                  }}
                  asChild
                >
                  <div>
                    {notification.actionUrl ? (
                      <Link href={notification.actionUrl} className="block w-full">
                        <div className="flex items-start space-x-3">
                          <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{notification.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">{formatTime(notification.createdAt)}</p>
                          </div>
                          {!notification.read && <div className="w-2 h-2 bg-primary rounded-full mt-1"></div>}
                        </div>
                      </Link>
                    ) : (
                      <div className="flex items-start space-x-3">
                        <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{formatTime(notification.createdAt)}</p>
                        </div>
                        {!notification.read && <div className="w-2 h-2 bg-primary rounded-full mt-1"></div>}
                      </div>
                    )}
                  </div>
                </DropdownMenuItem>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteNotification(notification.id)
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </ScrollArea>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/notifications" className="w-full text-center">
            <Eye className="h-4 w-4 mr-2" />
            View all notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
