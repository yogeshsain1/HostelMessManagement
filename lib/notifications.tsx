"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  category: "complaint" | "leave" | "mess" | "announcement" | "system"
  read: boolean
  createdAt: string
  actionUrl?: string
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, "id" | "createdAt" | "read">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void
  clearAll: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

// Mock notifications for demonstration
const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Complaint Update",
    message: "Your AC repair complaint has been marked as in-progress",
    type: "info",
    category: "complaint",
    read: false,
    createdAt: "2024-01-15T10:30:00Z",
    actionUrl: "/dashboard/complaints",
  },
  {
    id: "2",
    title: "Leave Request Approved",
    message: "Your leave request for Jan 20-25 has been approved",
    type: "success",
    category: "leave",
    read: false,
    createdAt: "2024-01-15T09:15:00Z",
    actionUrl: "/dashboard/leave",
  },
  {
    id: "3",
    title: "Menu Updated",
    message: "Tomorrow's dinner menu has been updated with new items",
    type: "info",
    category: "mess",
    read: true,
    createdAt: "2024-01-14T16:45:00Z",
    actionUrl: "/dashboard/mess",
  },
  {
    id: "4",
    title: "Hostel Meeting",
    message: "Monthly hostel meeting scheduled for Dec 25 at 6 PM",
    type: "warning",
    category: "announcement",
    read: false,
    createdAt: "2024-01-14T14:20:00Z",
  },
  {
    id: "5",
    title: "System Maintenance",
    message: "System will be under maintenance tomorrow from 2-4 AM",
    type: "warning",
    category: "system",
    read: true,
    createdAt: "2024-01-13T18:00:00Z",
  },
]

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)

  const unreadCount = notifications.filter((n) => !n.read).length

  const addNotification = (notification: Omit<Notification, "id" | "createdAt" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      read: false,
    }
    setNotifications((prev) => [newNotification, ...prev])
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
