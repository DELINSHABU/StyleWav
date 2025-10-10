import { NextResponse } from 'next/server'
import { 
  initializeOrdersFile,
  getOrdersByCustomerEmail
} from '@/lib/orders-database'

// GET - Get orders by customer email
export async function GET(
  request: Request,
  { params }: { params: { email: string } }
) {
  try {
    await initializeOrdersFile()
    
    // Decode email in case it's URL encoded
    const decodedEmail = decodeURIComponent(params.email)
    
    const orders = await getOrdersByCustomerEmail(decodedEmail)
    
    return NextResponse.json({
      success: true,
      data: orders,
      count: orders.length,
      message: `Found ${orders.length} orders for ${decodedEmail}`
    })
  } catch (error) {
    console.error('❌ ORDERS API: Error getting customer orders:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to retrieve customer orders',
        message: 'An error occurred while fetching customer orders'
      },
      { status: 500 }
    )
  }
}