import { NextResponse } from 'next/server'
import { 
  initializeCustomersFile,
  getCustomerByEmail,
  updateCustomer,
  deleteCustomer,
  addToWishlist,
  removeFromWishlist,
  updateCustomerCart,
  clearCustomerCart
} from '@/lib/customers-database'

// GET - Get a specific customer by email
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
      data: customer,
      message: 'Customer retrieved successfully'
    })
  } catch (error) {
    console.error('❌ CUSTOMERS API: Error getting customer:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to retrieve customer',
        message: 'An error occurred while fetching the customer'
      },
      { status: 500 }
    )
  }
}

// PUT - Update a specific customer
export async function PUT(
  request: Request,
  { params }: { params: { email: string } }
) {
  try {
    await initializeCustomersFile()
    const updates = await request.json()
    
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
    
    // Remove fields that shouldn't be updated directly
    const { id, dateJoined, ...allowedUpdates } = updates
    
    const updatedCustomer = await updateCustomer(customer.id, allowedUpdates)
    
    return NextResponse.json({
      success: true,
      data: updatedCustomer,
      message: `Customer ${updatedCustomer?.email} updated successfully`
    })
  } catch (error) {
    console.error('❌ CUSTOMERS API: Error updating customer:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to update customer',
        message: 'An error occurred while updating the customer'
      },
      { status: 500 }
    )
  }
}

// DELETE - Delete a specific customer (admin only)
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
    
    const success = await deleteCustomer(customer.id)
    
    return NextResponse.json({
      success: true,
      message: 'Customer deleted successfully'
    })
  } catch (error) {
    console.error('❌ CUSTOMERS API: Error deleting customer:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to delete customer',
        message: 'An error occurred while deleting the customer'
      },
      { status: 500 }
    )
  }
}