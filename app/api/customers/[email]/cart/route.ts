import { NextResponse } from 'next/server'
import { 
  initializeCustomersFile,
  getCustomerByEmail,
  updateCustomerCart,
  clearCustomerCart
} from '@/lib/customers-database'
import { CustomerCartItem } from '@/lib/database-types'

// GET - Get customer's cart
export async function GET(
  request: Request,
  { params }: { params: { email: string } }
) {
  try {
    await initializeCustomersFile()
    
    // Decode email in case it's URL encoded
    const decodedEmail = decodeURIComponent(params.email)
    
    const customer = await getCustomerByEmail(decodedEmail)
    
    if (!customer) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Customer not found',
          message: `No customer found with email: ${decodedEmail}`
        },
        { status: 404 }
      )
    }
    
    // Calculate cart total
    const total = customer.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    
    return NextResponse.json({
      success: true,
      data: customer.cart,
      count: customer.cart.length,
      total,
      message: 'Cart retrieved successfully'
    })
  } catch (error) {
    console.error('❌ CUSTOMERS API: Error getting cart:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to retrieve cart',
        message: 'An error occurred while fetching the cart'
      },
      { status: 500 }
    )
  }
}

// POST - Update customer's cart
export async function POST(
  request: Request,
  { params }: { params: { email: string } }
) {
  try {
    await initializeCustomersFile()
    const { cart } = await request.json()
    
    // Decode email in case it's URL encoded
    const decodedEmail = decodeURIComponent(params.email)
    
    // Get customer to find ID
    const customer = await getCustomerByEmail(decodedEmail)
    
    if (!customer) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Customer not found',
          message: `No customer found with email: ${decodedEmail}`
        },
        { status: 404 }
      )
    }
    
    // Validate cart items
    if (!Array.isArray(cart)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Cart must be an array',
          message: 'Invalid cart data format'
        },
        { status: 400 }
      )
    }
    
    // Validate each cart item
    const validCartItems: CustomerCartItem[] = []
    for (const item of cart) {
      if (!item.id || !item.name || !item.price || !item.quantity) {
        return NextResponse.json(
          { 
            success: false,
            error: 'Invalid cart item',
            message: 'Each cart item must have id, name, price, and quantity'
          },
          { status: 400 }
        )
      }
      
      validCartItems.push({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image || '',
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        addedAt: item.addedAt || new Date().toISOString()
      })
    }
    
    const success = await updateCustomerCart(customer.id, validCartItems)
    
    if (success) {
      // Calculate new total
      const total = validCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      
      return NextResponse.json({
        success: true,
        data: validCartItems,
        count: validCartItems.length,
        total,
        message: 'Cart updated successfully'
      })
    } else {
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to update cart',
          message: 'An error occurred while updating the cart'
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('❌ CUSTOMERS API: Error updating cart:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to update cart',
        message: 'An error occurred while updating cart'
      },
      { status: 500 }
    )
  }
}

// DELETE - Clear customer's cart
export async function DELETE(
  request: Request,
  { params }: { params: { email: string } }
) {
  try {
    await initializeCustomersFile()
    
    // Decode email in case it's URL encoded
    const decodedEmail = decodeURIComponent(params.email)
    
    // Get customer to find ID
    const customer = await getCustomerByEmail(decodedEmail)
    
    if (!customer) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Customer not found',
          message: `No customer found with email: ${decodedEmail}`
        },
        { status: 404 }
      )
    }
    
    const success = await clearCustomerCart(customer.id)
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Cart cleared successfully'
      })
    } else {
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to clear cart',
          message: 'An error occurred while clearing the cart'
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('❌ CUSTOMERS API: Error clearing cart:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to clear cart',
        message: 'An error occurred while clearing cart'
      },
      { status: 500 }
    )
  }
}