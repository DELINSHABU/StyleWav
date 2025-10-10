import { NextResponse } from 'next/server'
import { 
  initializeCustomersFile,
  getAllCustomers,
  createCustomer,
  getCustomerStatistics
} from '@/lib/customers-database'
import { CustomerFilters } from '@/lib/database-types'

// GET - Get all customers with optional filtering
export async function GET(request: Request) {
  try {
    await initializeCustomersFile()
    
    const { searchParams } = new URL(request.url)
    
    // Parse filters from query parameters
    const filters: CustomerFilters = {}
    
    if (searchParams.get('isActive')) {
      filters.isActive = searchParams.get('isActive') === 'true'
    }
    if (searchParams.get('hasOrders')) {
      filters.hasOrders = searchParams.get('hasOrders') === 'true'
    }
    if (searchParams.get('minSpent')) {
      filters.minSpent = parseFloat(searchParams.get('minSpent')!)
    }
    if (searchParams.get('maxSpent')) {
      filters.maxSpent = parseFloat(searchParams.get('maxSpent')!)
    }
    if (searchParams.get('joinedAfter')) {
      filters.joinedAfter = searchParams.get('joinedAfter')!
    }
    if (searchParams.get('joinedBefore')) {
      filters.joinedBefore = searchParams.get('joinedBefore')!
    }
    
    // Check if requesting statistics
    if (searchParams.get('stats') === 'true') {
      const stats = await getCustomerStatistics()
      return NextResponse.json({
        success: true,
        data: stats,
        message: 'Customer statistics retrieved successfully'
      })
    }
    
    const customers = await getAllCustomers(Object.keys(filters).length > 0 ? filters : undefined)
    
    return NextResponse.json({
      success: true,
      data: customers,
      count: customers.length,
      message: 'Customers retrieved successfully'
    })
  } catch (error) {
    console.error('❌ CUSTOMERS API: Error getting customers:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to retrieve customers',
        message: 'An error occurred while fetching customers'
      },
      { status: 500 }
    )
  }
}

// POST - Create a new customer
export async function POST(request: Request) {
  try {
    await initializeCustomersFile()
    const customerData = await request.json()
    
    // Validate required fields
    const requiredFields = ['email', 'firstName', 'lastName', 'phone']
    const missingFields = requiredFields.filter(field => !customerData[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}`,
          message: 'Please provide all required customer information'
        },
        { status: 400 }
      )
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(customerData.email)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid email format',
          message: 'Please provide a valid email address'
        },
        { status: 400 }
      )
    }
    
    const newCustomer = await createCustomer(customerData)
    
    return NextResponse.json({
      success: true,
      data: newCustomer,
      message: `Customer ${newCustomer.email} created successfully`
    }, { status: 201 })
    
  } catch (error) {
    console.error('❌ CUSTOMERS API: Error creating customer:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create customer',
        message: 'An error occurred while creating the customer'
      },
      { status: 500 }
    )
  }
}