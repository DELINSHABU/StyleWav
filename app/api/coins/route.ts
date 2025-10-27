import { NextRequest, NextResponse } from 'next/server'
import { getCustomerCoins, addCoins, deductCoins, getTransactionHistory } from '@/lib/coins-database'

// GET - Get customer coin balance and optionally transaction history
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const customerId = searchParams.get('customerId')
    const transactions = searchParams.get('transactions') === 'true'
    const limit = searchParams.get('limit')

    if (!customerId) {
      return NextResponse.json(
        { success: false, error: 'Customer ID is required' },
        { status: 400 }
      )
    }

    if (transactions) {
      // Get transaction history
      const result = await getTransactionHistory(
        customerId,
        limit ? parseInt(limit) : undefined
      )
      return NextResponse.json(result)
    }

    // Get coin balance
    const result = await getCustomerCoins(customerId)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in coins GET:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Add or deduct coins
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, customerId, customerEmail, amount, description, options } = body

    if (!customerId || !amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      )
    }

    if (action === 'add') {
      // Add coins (purchase or gift)
      const type = options?.type || 'purchase'
      const result = await addCoins(
        customerId,
        customerEmail || '',
        amount,
        type,
        description || 'Coin purchase',
        options
      )
      return NextResponse.json(result)
    } else if (action === 'deduct') {
      // Deduct coins
      const result = await deductCoins(
        customerId,
        amount,
        description || 'Coin deduction',
        options?.orderId
      )
      return NextResponse.json(result)
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid action. Use "add" or "deduct"' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error in coins POST:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
