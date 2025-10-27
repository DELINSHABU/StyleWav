import { NextRequest, NextResponse } from 'next/server'
import {
  createNotification,
  broadcastNotification,
  sendToCustomers
} from '@/lib/notifications-database'

// POST - Send notifications (Admin only)
export async function POST(request: NextRequest) {
  try {
    // TODO: Add admin authentication check here
    const body = await request.json()
    const { action, type, title, message, data, expiresAt, customerId, customerIds } = body

    if (!title || !message || !type) {
      return NextResponse.json(
        { success: false, error: 'Title, message, and type are required' },
        { status: 400 }
      )
    }

    // Calculate expiration date if not provided (default 30 days)
    const expirationDate = expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

    switch (action) {
      case 'sendToOne':
        if (!customerId) {
          return NextResponse.json(
            { success: false, error: 'Customer ID is required for sendToOne action' },
            { status: 400 }
          )
        }
        const singleResult = await createNotification(
          customerId,
          type,
          title,
          message,
          data,
          expirationDate
        )
        return NextResponse.json(singleResult)

      case 'sendToMultiple':
        if (!customerIds || !Array.isArray(customerIds) || customerIds.length === 0) {
          return NextResponse.json(
            { success: false, error: 'Customer IDs array is required for sendToMultiple action' },
            { status: 400 }
          )
        }
        const multipleResult = await sendToCustomers(
          customerIds,
          type,
          title,
          message,
          data,
          expirationDate
        )
        return NextResponse.json(multipleResult)

      case 'broadcast':
        const broadcastResult = await broadcastNotification(
          type,
          title,
          message,
          data,
          expirationDate
        )
        return NextResponse.json(broadcastResult)

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action. Use: sendToOne, sendToMultiple, or broadcast' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error in admin notifications POST:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
