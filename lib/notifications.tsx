"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

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

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await fetch("/api/notifications", { credentials: "include" })
        const json = await response.json().catch(() => ({}))
        if (!response.ok || !json?.success || !Array.isArray(json?.data?.notifications)) return

        setNotifications(
          json.data.notifications.map((item: any) => ({
            id: String(item.id),
            title: String(item.title),
            message: String(item.message),
            type: (["info", "success", "warning", "error"].includes(item.type) ? item.type : "info") as Notification["type"],
            category: (["complaint", "leave", "mess", "announcement", "system"].includes(item.category)
              ? item.category
              : "system") as Notification["category"],
            read: Boolean(item.read),
            createdAt: String(item.createdAt),
            actionUrl: item.actionUrl ? String(item.actionUrl) : undefined,
          })),
        )
      } catch (_) {
        setNotifications([])
      }
    }

    void loadNotifications()
  }, [])

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
