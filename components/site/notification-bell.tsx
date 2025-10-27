"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function NotificationBell() {
  const { currentUser } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentUser?.uid) {
      fetchUnreadCount()
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000)
      return () => clearInterval(interval)
    } else {
      setLoading(false)
      setUnreadCount(0)
    }
  }, [currentUser])

  const fetchUnreadCount = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/notifications?customerId=${currentUser?.uid}&action=unreadCount`
      )
      const data = await response.json()
      
      if (data.success) {
        setUnreadCount(data.data || 0)
      }
    } catch (error) {
      console.error('Error fetching unread count:', error)
    } finally {
      setLoading(false)
    }
  }

  // Expose refresh function for external use
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).refreshNotifications = fetchUnreadCount
    }
  }, [currentUser])

  if (!currentUser) {
    return null
  }

  return (
    <Link href="/notifications">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>
    </Link>
  )
}
