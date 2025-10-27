import { NextRequest, NextResponse } from 'next/server'
import {
  getCustomerNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications
} from '@/lib/notifications-database'

// GET - Get notifications or unread count
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const customerId = searchParams.get('customerId')
    const action = searchParams.get('action')
    const includeRead = searchParams.get('includeRead') !== 'false'

    if (!customerId) {
      return NextResponse.json(
        { success: false, error: 'Customer ID is required' },
        { status: 400 }
      )
    }

    // Get unread count only
    if (action === 'unreadCount') {
      const result = await getUnreadCount(customerId)
      return NextResponse.json(result)
    }

    // Get all notifications
    const result = await getCustomerNotifications(customerId, includeRead)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in notifications GET:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Mark as read or delete notifications
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, customerId, notificationId } = body

    if (!customerId) {
      return NextResponse.json(
        { success: false, error: 'Customer ID is required' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'markAsRead':
        if (!notificationId) {
          return NextResponse.json(
            { success: false, error: 'Notification ID is required' },
            { status: 400 }
          )
        }
        const readResult = await markAsRead(customerId, notificationId)
        return NextResponse.json(readResult)

      case 'markAllAsRead':
        const allReadResult = await markAllAsRead(customerId)
        return NextResponse.json(allReadResult)

      case 'delete':
        if (!notificationId) {
          return NextResponse.json(
            { success: false, error: 'Notification ID is required' },
            { status: 400 }
          )
        }
        const deleteResult = await deleteNotification(customerId, notificationId)
        return NextResponse.json(deleteResult)

      case 'deleteAll':
        const deleteAllResult = await deleteAllNotifications(customerId)
        return NextResponse.json(deleteAllResult)

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error in notifications POST:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
