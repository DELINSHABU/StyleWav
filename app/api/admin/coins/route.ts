import { NextRequest, NextResponse } from 'next/server'
import { getAllCustomersCoins, addCoins } from '@/lib/coins-database'
import { createNotification } from '@/lib/notifications-database'

// GET - Get all customers' coin balances (Admin only)
export async function GET(request: NextRequest) {
  try {
    // TODO: Add admin authentication check here
    // For now, this is open but should be protected in production
    
    const result = await getAllCustomersCoins()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in admin coins GET:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Gift coins to customer (Admin only)
export async function POST(request: NextRequest) {
  try {
    // TODO: Add admin authentication check here
    const body = await request.json()
    const { customerId, customerEmail, amount, description, giftedBy } = body

    if (!customerId || !amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data. CustomerId and positive amount required' },
        { status: 400 }
      )
    }

    // Gift coins to customer
    const result = await addCoins(
      customerId,
      customerEmail || '',
      amount,
      'gift',
      description || 'Admin gift',
      {
        giftedBy: giftedBy || 'admin'
      }
    )

    // Create notification for the customer
    if (result.success) {
      await createNotification(
        customerId,
        'coin_gift',
        '🎁 Free Coins Received!',
        `You've received ${amount} free coins${description ? `: ${description}` : '!'}`,
        {
          coinAmount: amount,
          link: '/coins'
        },
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // Expires in 30 days
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in admin coins POST:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
