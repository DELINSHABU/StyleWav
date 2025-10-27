import { NextResponse } from 'next/server'
import { 
  initializeCustomersFile,
  getCustomerByEmail,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from '@/lib/customers-database'

// GET - Get all addresses for a customer
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
      data: {
        addresses: customer.addresses,
        defaultShippingAddress: customer.defaultShippingAddress
      },
      message: 'Addresses retrieved successfully'
    })
  } catch (error) {
    console.error('❌ ADDRESSES API: Error getting addresses:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to retrieve addresses',
        message: 'An error occurred while fetching addresses'
      },
      { status: 500 }
    )
  }
}

// POST - Add a new address for a customer
export async function POST(
  request: Request,
  { params }: { params: { email: string } }
) {
  try {
    await initializeCustomersFile()
    const addressData = await request.json()
    
    // Decode email in case it's URL encoded
    const decodedEmail = decodeURIComponent(params.email)
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'address', 'city', 'state', 'zipCode']
    const missingFields = requiredFields.filter(field => !addressData[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}`,
          message: 'Please provide all required address information'
        },
        { status: 400 }
      )
    }
    
    // Get customer
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
    
    // Add address
    const newAddress = await addAddress(customer.id, addressData)
    
    if (!newAddress) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to add address',
          message: 'Could not add address to customer profile'
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: newAddress,
      message: 'Address added successfully'
    }, { status: 201 })
    
  } catch (error) {
    console.error('❌ ADDRESSES API: Error adding address:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to add address',
        message: 'An error occurred while adding the address'
      },
      { status: 500 }
    )
  }
}

// PUT - Update an existing address or set default
export async function PUT(
  request: Request,
  { params }: { params: { email: string } }
) {
  try {
    await initializeCustomersFile()
    const { addressId, setDefault, ...addressUpdates } = await request.json()
    
    if (!addressId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing address ID',
          message: 'Please provide an address ID to update'
        },
        { status: 400 }
      )
    }
    
    // Decode email in case it's URL encoded
    const decodedEmail = decodeURIComponent(params.email)
    
    // Get customer
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
    
    // If setDefault flag is true, set as default address
    if (setDefault) {
      const success = await setDefaultAddress(customer.id, addressId)
      
      if (!success) {
        return NextResponse.json(
          { 
            success: false,
            error: 'Failed to set default address',
            message: 'Could not set address as default'
          },
          { status: 500 }
        )
      }
      
      return NextResponse.json({
        success: true,
        message: 'Default address updated successfully'
      })
    }
    
    // Otherwise, update address details
    const updatedAddress = await updateAddress(customer.id, addressId, addressUpdates)
    
    if (!updatedAddress) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to update address',
          message: 'Could not update address'
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: updatedAddress,
      message: 'Address updated successfully'
    })
    
  } catch (error) {
    console.error('❌ ADDRESSES API: Error updating address:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to update address',
        message: 'An error occurred while updating the address'
      },
      { status: 500 }
    )
  }
}

// DELETE - Delete an address
export async function DELETE(
  request: Request,
  { params }: { params: { email: string } }
) {
  try {
    await initializeCustomersFile()
    
    const { searchParams } = new URL(request.url)
    const addressId = searchParams.get('addressId')
    
    if (!addressId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing address ID',
          message: 'Please provide an address ID to delete'
        },
        { status: 400 }
      )
    }
    
    // Decode email in case it's URL encoded
    const decodedEmail = decodeURIComponent(params.email)
    
    // Get customer
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
    
    // Delete address
    const success = await deleteAddress(customer.id, addressId)
    
    if (!success) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to delete address',
          message: 'Could not delete address'
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Address deleted successfully'
    })
    
  } catch (error) {
    console.error('❌ ADDRESSES API: Error deleting address:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to delete address',
        message: 'An error occurred while deleting the address'
      },
      { status: 500 }
    )
  }
}
