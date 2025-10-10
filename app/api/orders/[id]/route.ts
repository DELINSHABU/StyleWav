import { NextResponse } from 'next/server'
import { 
  initializeOrdersFile,
  getOrderById,
  updateOrder,
  deleteOrder
} from '@/lib/orders-database'

// GET - Get a specific order by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await initializeOrdersFile()
    
    const order = await getOrderById(params.id)
    
    if (!order) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Order not found',
          message: `No order found with ID: ${params.id}`
        },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order retrieved successfully'
    })
  } catch (error) {
    console.error('❌ ORDERS API: Error getting order:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to retrieve order',
        message: 'An error occurred while fetching the order'
      },
      { status: 500 }
    )
  }
}

// PUT - Update a specific order
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await initializeOrdersFile()
    const updates = await request.json()
    
    // Remove fields that shouldn't be updated directly
    const { id, orderNumber, orderDate, ...allowedUpdates } = updates
    
    const updatedOrder = await updateOrder(params.id, allowedUpdates)
    
    if (!updatedOrder) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Order not found',
          message: `No order found with ID: ${params.id}`
        },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: `Order ${updatedOrder.orderNumber} updated successfully`
    })
  } catch (error) {
    console.error('❌ ORDERS API: Error updating order:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to update order',
        message: 'An error occurred while updating the order'
      },
      { status: 500 }
    )
  }
}

// DELETE - Delete a specific order (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await initializeOrdersFile()
    
    const success = await deleteOrder(params.id)
    
    if (!success) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Order not found',
          message: `No order found with ID: ${params.id}`
        },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully'
    })
  } catch (error) {
    console.error('❌ ORDERS API: Error deleting order:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to delete order',
        message: 'An error occurred while deleting the order'
      },
      { status: 500 }
    )
  }
}