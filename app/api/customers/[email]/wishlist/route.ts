import { NextResponse } from 'next/server'
import { 
  initializeCustomersFile,
  getCustomerByEmail,
  addToWishlist,
  removeFromWishlist
} from '@/lib/customers-database'

// GET - Get customer's wishlist
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
    
    return NextResponse.json({
      success: true,
      data: customer.wishlist,
      count: customer.wishlist.length,
      message: 'Wishlist retrieved successfully'
    })
  } catch (error) {
    console.error('❌ CUSTOMERS API: Error getting wishlist:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to retrieve wishlist',
        message: 'An error occurred while fetching the wishlist'
      },
      { status: 500 }
    )
  }
}

// POST - Add item to customer's wishlist
export async function POST(
  request: Request,
  { params }: { params: { email: string } }
) {
  try {
    await initializeCustomersFile()
    const itemData = await request.json()
    
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
    
    // Validate required fields
    const requiredFields = ['id', 'name', 'price', 'image']
    const missingFields = requiredFields.filter(field => !itemData[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}`,
          message: 'Please provide all required item information'
        },
        { status: 400 }
      )
    }
    
    const success = await addToWishlist(customer.id, itemData)
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: `${itemData.name} added to wishlist`
      })
    } else {
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to add item to wishlist',
          message: 'An error occurred while adding the item'
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('❌ CUSTOMERS API: Error adding to wishlist:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to add to wishlist',
        message: 'An error occurred while adding to wishlist'
      },
      { status: 500 }
    )
  }
}

// DELETE - Remove item from customer's wishlist
export async function DELETE(
  request: Request,
  { params }: { params: { email: string } }
) {
  try {
    await initializeCustomersFile()
    
    // Decode email in case it's URL encoded
    const decodedEmail = decodeURIComponent(params.email)
    
    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get('itemId')
    
    if (!itemId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing itemId parameter',
          message: 'Please provide the item ID to remove'
        },
        { status: 400 }
      )
    }
    
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
    
    const success = await removeFromWishlist(customer.id, itemId)
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Item removed from wishlist'
      })
    } else {
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to remove item from wishlist',
          message: 'An error occurred while removing the item'
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('❌ CUSTOMERS API: Error removing from wishlist:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to remove from wishlist',
        message: 'An error occurred while removing from wishlist'
      },
      { status: 500 }
    )
  }
}