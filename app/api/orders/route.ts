import { NextResponse } from 'next/server'
import { 
  initializeOrdersFile,
  getAllOrders,
  createOrder,
  getOrderStatistics
} from '@/lib/orders-database'
import { OrderFilters } from '@/lib/database-types'

// GET - Get all orders with optional filtering
export async function GET(request: Request) {
  try {
    await initializeOrdersFile()
    
    const { searchParams } = new URL(request.url)
    
    // Parse filters from query parameters
    const filters: OrderFilters = {}
    
    if (searchParams.get('status')) {
      filters.status = searchParams.get('status') as any
    }
    if (searchParams.get('paymentStatus')) {
      filters.paymentStatus = searchParams.get('paymentStatus') as any
    }
    if (searchParams.get('customerId')) {
      filters.customerId = searchParams.get('customerId')!
    }
    if (searchParams.get('startDate')) {
      filters.startDate = searchParams.get('startDate')!
    }
    if (searchParams.get('endDate')) {
      filters.endDate = searchParams.get('endDate')!
    }
    if (searchParams.get('minAmount')) {
      filters.minAmount = parseFloat(searchParams.get('minAmount')!)
    }
    if (searchParams.get('maxAmount')) {
      filters.maxAmount = parseFloat(searchParams.get('maxAmount')!)
    }
    
    // Check if requesting statistics
    if (searchParams.get('stats') === 'true') {
      const stats = await getOrderStatistics()
      return NextResponse.json({
        success: true,
        data: stats,
        message: 'Order statistics retrieved successfully'
      })
    }
    
    const orders = await getAllOrders(Object.keys(filters).length > 0 ? filters : undefined)
    
    return NextResponse.json({
      success: true,
      data: orders,
      count: orders.length,
      message: 'Orders retrieved successfully'
    })
  } catch (error) {
    console.error('❌ ORDERS API: Error getting orders:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to retrieve orders',
        message: 'An error occurred while fetching orders'
      },
      { status: 500 }
    )
  }
}

// POST - Create a new order
export async function POST(request: Request) {
  try {
    await initializeOrdersFile()
    const orderData = await request.json()
    
    // Validate required fields
    const requiredFields = ['customerId', 'customerEmail', 'items', 'subtotal', 'total', 'status', 'paymentStatus', 'shippingAddress']
    const missingFields = requiredFields.filter(field => !orderData[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}`,
          message: 'Please provide all required order information'
        },
        { status: 400 }
      )
    }
    
    // Validate items array
    if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Order must contain at least one item',
          message: 'Please add items to the order'
        },
        { status: 400 }
      )
    }
    
    const newOrder = await createOrder(orderData)
    
    return NextResponse.json({
      success: true,
      data: newOrder,
      message: `Order ${newOrder.orderNumber} created successfully`
    }, { status: 201 })
    
  } catch (error) {
    console.error('❌ ORDERS API: Error creating order:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create order',
        message: 'An error occurred while creating the order'
      },
      { status: 500 }
    )
  }
}