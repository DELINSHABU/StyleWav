import { promises as fs } from 'fs'
import path from 'path'
import { Customer, CustomerFilters, ShippingAddress, CustomerWishlistItem, CustomerCartItem } from './database-types'

const DB_PATH = path.join(process.cwd(), 'jsonDatabase')
const CUSTOMERS_FILE = path.join(DB_PATH, 'customers.json')

// Ensure database directory exists
async function ensureDatabaseExists() {
  try {
    await fs.access(DB_PATH)
  } catch {
    await fs.mkdir(DB_PATH, { recursive: true })
  }
}

// Read customers from JSON file
export async function readCustomersFromFile(): Promise<Customer[]> {
  console.log('🔍 Fetching data from CUSTOMERS DATABASE (customers.json)')
  try {
    await ensureDatabaseExists()
    const data = await fs.readFile(CUSTOMERS_FILE, 'utf-8')
    const customers = JSON.parse(data)
    console.log(`👥 CUSTOMERS DATABASE: Found ${customers.length} customers`)
    return customers
  } catch (error) {
    console.warn('⚠️ CUSTOMERS DATABASE: Could not read customers file, returning empty array:', error)
    return []
  }
}

// Write customers to JSON file
export async function writeCustomersToFile(customers: Customer[]): Promise<void> {
  console.log(`💾 Saving data to CUSTOMERS DATABASE (customers.json) - ${customers.length} customers`)
  try {
    await ensureDatabaseExists()
    await fs.writeFile(CUSTOMERS_FILE, JSON.stringify(customers, null, 2), 'utf-8')
    console.log('✅ CUSTOMERS DATABASE: Customers saved successfully')
  } catch (error) {
    console.error('❌ CUSTOMERS DATABASE: Error writing customers to file:', error)
    throw error
  }
}

// Initialize customers file if it doesn't exist
export async function initializeCustomersFile(): Promise<void> {
  try {
    await fs.access(CUSTOMERS_FILE)
    console.log('✅ CUSTOMERS DATABASE: customers.json exists')
  } catch {
    console.log('🚀 CUSTOMERS DATABASE: Initializing customers.json with empty array')
    await writeCustomersToFile([])
  }
}

// Create a new customer
export async function createCustomer(customerData: {
  email: string
  firstName: string
  lastName: string
  phone: string
  shippingAddress?: ShippingAddress
}): Promise<Customer> {
  console.log('🆕 CUSTOMERS DATABASE: Creating new customer:', customerData.email)
  const customers = await readCustomersFromFile()
  
  // Check if customer already exists
  const existingCustomer = customers.find(c => c.email.toLowerCase() === customerData.email.toLowerCase())
  if (existingCustomer) {
    console.log(`ℹ️ CUSTOMERS DATABASE: Customer already exists: ${customerData.email}`)
    return existingCustomer
  }
  
  const newCustomer: Customer = {
    id: `customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    email: customerData.email.toLowerCase(),
    firstName: customerData.firstName,
    lastName: customerData.lastName,
    phone: customerData.phone,
    dateJoined: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    isActive: true,
    
    // Addresses
    defaultShippingAddress: customerData.shippingAddress,
    addresses: customerData.shippingAddress ? [customerData.shippingAddress] : [],
    
    // Shopping data
    wishlist: [],
    cart: [],
    
    // Order history
    totalOrders: 0,
    totalSpent: 0,
    
    // Preferences
    emailMarketing: true,
    smsMarketing: false,
    preferences: {
      currency: 'INR',
      notifications: true
    }
  }
  
  customers.push(newCustomer)
  await writeCustomersToFile(customers)
  
  console.log(`✅ CUSTOMERS DATABASE: Created new customer ${newCustomer.email} with ID: ${newCustomer.id}`)
  return newCustomer
}

// Get customer by ID
export async function getCustomerById(customerId: string): Promise<Customer | null> {
  console.log(`🔍 CUSTOMERS DATABASE: Looking for customer with ID: ${customerId}`)
  const customers = await readCustomersFromFile()
  const customer = customers.find(c => c.id === customerId)
  
  if (customer) {
    console.log(`✅ CUSTOMERS DATABASE: Found customer ${customer.email}`)
  } else {
    console.log(`❌ CUSTOMERS DATABASE: Customer not found with ID: ${customerId}`)
  }
  
  return customer || null
}

// Get customer by email
export async function getCustomerByEmail(email: string): Promise<Customer | null> {
  console.log(`🔍 CUSTOMERS DATABASE: Looking for customer with email: ${email}`)
  const customers = await readCustomersFromFile()
  const customer = customers.find(c => c.email.toLowerCase() === email.toLowerCase())
  
  if (customer) {
    console.log(`✅ CUSTOMERS DATABASE: Found customer ${customer.email}`)
    // Update last active
    await updateCustomer(customer.id, { lastActive: new Date().toISOString() })
  } else {
    console.log(`❌ CUSTOMERS DATABASE: Customer not found with email: ${email}`)
  }
  
  return customer || null
}

// Update customer
export async function updateCustomer(customerId: string, updates: Partial<Customer>): Promise<Customer | null> {
  console.log(`🔄 CUSTOMERS DATABASE: Updating customer ${customerId}`)
  const customers = await readCustomersFromFile()
  const customerIndex = customers.findIndex(c => c.id === customerId)
  
  if (customerIndex === -1) {
    console.log(`❌ CUSTOMERS DATABASE: Customer not found for update: ${customerId}`)
    return null
  }
  
  customers[customerIndex] = {
    ...customers[customerIndex],
    ...updates,
    lastActive: new Date().toISOString()
  }
  
  await writeCustomersToFile(customers)
  console.log(`✅ CUSTOMERS DATABASE: Updated customer ${customers[customerIndex].email}`)
  return customers[customerIndex]
}

// Add to customer's wishlist
export async function addToWishlist(customerId: string, item: Omit<CustomerWishlistItem, 'addedAt'>): Promise<boolean> {
  console.log(`💖 CUSTOMERS DATABASE: Adding item to wishlist for customer ${customerId}`)
  const customer = await getCustomerById(customerId)
  
  if (!customer) {
    console.log(`❌ CUSTOMERS DATABASE: Customer not found for wishlist: ${customerId}`)
    return false
  }
  
  // Check if item already in wishlist
  if (customer.wishlist.some(w => w.id === item.id)) {
    console.log(`ℹ️ CUSTOMERS DATABASE: Item already in wishlist: ${item.id}`)
    return true
  }
  
  const wishlistItem: CustomerWishlistItem = {
    ...item,
    addedAt: new Date().toISOString()
  }
  
  customer.wishlist.push(wishlistItem)
  await updateCustomer(customerId, { wishlist: customer.wishlist })
  
  console.log(`✅ CUSTOMERS DATABASE: Added item ${item.name} to wishlist`)
  return true
}

// Remove from customer's wishlist
export async function removeFromWishlist(customerId: string, itemId: string): Promise<boolean> {
  console.log(`💔 CUSTOMERS DATABASE: Removing item from wishlist for customer ${customerId}`)
  const customer = await getCustomerById(customerId)
  
  if (!customer) {
    console.log(`❌ CUSTOMERS DATABASE: Customer not found for wishlist removal: ${customerId}`)
    return false
  }
  
  const updatedWishlist = customer.wishlist.filter(w => w.id !== itemId)
  await updateCustomer(customerId, { wishlist: updatedWishlist })
  
  console.log(`✅ CUSTOMERS DATABASE: Removed item ${itemId} from wishlist`)
  return true
}

// Update customer's cart
export async function updateCustomerCart(customerId: string, cart: CustomerCartItem[]): Promise<boolean> {
  console.log(`🛒 CUSTOMERS DATABASE: Updating cart for customer ${customerId}`)
  const updatedCustomer = await updateCustomer(customerId, { cart })
  
  if (updatedCustomer) {
    console.log(`✅ CUSTOMERS DATABASE: Updated cart with ${cart.length} items`)
    return true
  }
  
  console.log(`❌ CUSTOMERS DATABASE: Failed to update cart for customer ${customerId}`)
  return false
}

// Clear customer's cart
export async function clearCustomerCart(customerId: string): Promise<boolean> {
  console.log(`🧹 CUSTOMERS DATABASE: Clearing cart for customer ${customerId}`)
  return await updateCustomerCart(customerId, [])
}

// Update customer order stats
export async function updateCustomerOrderStats(customerId: string, orderTotal: number): Promise<boolean> {
  console.log(`📊 CUSTOMERS DATABASE: Updating order stats for customer ${customerId}`)
  const customer = await getCustomerById(customerId)
  
  if (!customer) {
    console.log(`❌ CUSTOMERS DATABASE: Customer not found for stats update: ${customerId}`)
    return false
  }
  
  const updates = {
    totalOrders: customer.totalOrders + 1,
    totalSpent: customer.totalSpent + orderTotal,
    lastOrderDate: new Date().toISOString()
  }
  
  await updateCustomer(customerId, updates)
  console.log(`✅ CUSTOMERS DATABASE: Updated order stats - Orders: ${updates.totalOrders}, Spent: ₹${updates.totalSpent}`)
  return true
}

// Get all customers with optional filtering
export async function getAllCustomers(filters?: CustomerFilters): Promise<Customer[]> {
  console.log('🔍 CUSTOMERS DATABASE: Getting all customers with filters:', filters)
  let customers = await readCustomersFromFile()
  
  if (filters) {
    if (filters.isActive !== undefined) {
      customers = customers.filter(c => c.isActive === filters.isActive)
    }
    if (filters.hasOrders !== undefined) {
      customers = customers.filter(c => filters.hasOrders ? c.totalOrders > 0 : c.totalOrders === 0)
    }
    if (filters.minSpent !== undefined) {
      customers = customers.filter(c => c.totalSpent >= filters.minSpent!)
    }
    if (filters.maxSpent !== undefined) {
      customers = customers.filter(c => c.totalSpent <= filters.maxSpent!)
    }
    if (filters.joinedAfter) {
      customers = customers.filter(c => new Date(c.dateJoined) >= new Date(filters.joinedAfter!))
    }
    if (filters.joinedBefore) {
      customers = customers.filter(c => new Date(c.dateJoined) <= new Date(filters.joinedBefore!))
    }
  }
  
  console.log(`👥 CUSTOMERS DATABASE: Returning ${customers.length} filtered customers`)
  return customers.sort((a, b) => new Date(b.dateJoined).getTime() - new Date(a.dateJoined).getTime())
}

// Delete customer (admin only)
export async function deleteCustomer(customerId: string): Promise<boolean> {
  console.log(`🗑️ CUSTOMERS DATABASE: Deleting customer ${customerId}`)
  const customers = await readCustomersFromFile()
  const customerIndex = customers.findIndex(c => c.id === customerId)
  
  if (customerIndex === -1) {
    console.log(`❌ CUSTOMERS DATABASE: Customer not found for deletion: ${customerId}`)
    return false
  }
  
  const deletedCustomer = customers[customerIndex]
  customers.splice(customerIndex, 1)
  await writeCustomersToFile(customers)
  
  console.log(`✅ CUSTOMERS DATABASE: Deleted customer ${deletedCustomer.email}`)
  return true
}

// Get customer statistics
export async function getCustomerStatistics() {
  console.log('📊 CUSTOMERS DATABASE: Calculating customer statistics')
  const customers = await readCustomersFromFile()
  
  const stats = {
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => c.isActive).length,
    customersWithOrders: customers.filter(c => c.totalOrders > 0).length,
    averageOrderValue: customers.length > 0 ? customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.filter(c => c.totalOrders > 0).length || 0 : 0,
    totalCustomerSpend: customers.reduce((sum, c) => sum + c.totalSpent, 0),
    topCustomers: customers
      .filter(c => c.totalOrders > 0)
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10)
      .map(c => ({
        id: c.id,
        name: `${c.firstName} ${c.lastName}`,
        email: c.email,
        totalOrders: c.totalOrders,
        totalSpent: c.totalSpent
      }))
  }
  
  console.log('📊 CUSTOMERS DATABASE: Statistics calculated:', stats)
  return stats
}

// Add address to customer
export async function addAddress(customerId: string, address: Omit<ShippingAddress, 'id'>): Promise<ShippingAddress | null> {
  console.log(`📍 CUSTOMERS DATABASE: Adding address for customer ${customerId}`)
  const customer = await getCustomerById(customerId)
  
  if (!customer) {
    console.log(`❌ CUSTOMERS DATABASE: Customer not found for adding address: ${customerId}`)
    return null
  }
  
  // Generate unique address ID
  const addressId = `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  const newAddress: ShippingAddress = {
    ...address,
    id: addressId,
    isDefault: customer.addresses.length === 0 // First address is default
  }
  
  customer.addresses.push(newAddress)
  
  // If this is the first address or marked as default, set as default shipping address
  if (newAddress.isDefault || !customer.defaultShippingAddress) {
    customer.defaultShippingAddress = newAddress
  }
  
  await updateCustomer(customerId, { 
    addresses: customer.addresses,
    defaultShippingAddress: customer.defaultShippingAddress
  })
  
  console.log(`✅ CUSTOMERS DATABASE: Added address ${addressId}`)
  return newAddress
}

// Update address for customer
export async function updateAddress(customerId: string, addressId: string, updates: Partial<ShippingAddress>): Promise<ShippingAddress | null> {
  console.log(`🔄 CUSTOMERS DATABASE: Updating address ${addressId} for customer ${customerId}`)
  const customer = await getCustomerById(customerId)
  
  if (!customer) {
    console.log(`❌ CUSTOMERS DATABASE: Customer not found for updating address: ${customerId}`)
    return null
  }
  
  const addressIndex = customer.addresses.findIndex(a => a.id === addressId)
  
  if (addressIndex === -1) {
    console.log(`❌ CUSTOMERS DATABASE: Address not found: ${addressId}`)
    return null
  }
  
  // Update address
  customer.addresses[addressIndex] = {
    ...customer.addresses[addressIndex],
    ...updates,
    id: addressId // Preserve ID
  }
  
  // If this is the default address, update defaultShippingAddress
  if (customer.addresses[addressIndex].isDefault || customer.defaultShippingAddress?.id === addressId) {
    customer.defaultShippingAddress = customer.addresses[addressIndex]
  }
  
  await updateCustomer(customerId, { 
    addresses: customer.addresses,
    defaultShippingAddress: customer.defaultShippingAddress
  })
  
  console.log(`✅ CUSTOMERS DATABASE: Updated address ${addressId}`)
  return customer.addresses[addressIndex]
}

// Delete address from customer
export async function deleteAddress(customerId: string, addressId: string): Promise<boolean> {
  console.log(`🗑️ CUSTOMERS DATABASE: Deleting address ${addressId} for customer ${customerId}`)
  const customer = await getCustomerById(customerId)
  
  if (!customer) {
    console.log(`❌ CUSTOMERS DATABASE: Customer not found for deleting address: ${customerId}`)
    return false
  }
  
  const addressIndex = customer.addresses.findIndex(a => a.id === addressId)
  
  if (addressIndex === -1) {
    console.log(`❌ CUSTOMERS DATABASE: Address not found: ${addressId}`)
    return false
  }
  
  const wasDefault = customer.addresses[addressIndex].isDefault
  customer.addresses.splice(addressIndex, 1)
  
  // If deleted address was default, set first remaining address as default
  if (wasDefault && customer.addresses.length > 0) {
    customer.addresses[0].isDefault = true
    customer.defaultShippingAddress = customer.addresses[0]
  } else if (customer.addresses.length === 0) {
    customer.defaultShippingAddress = undefined
  }
  
  await updateCustomer(customerId, { 
    addresses: customer.addresses,
    defaultShippingAddress: customer.defaultShippingAddress
  })
  
  console.log(`✅ CUSTOMERS DATABASE: Deleted address ${addressId}`)
  return true
}

// Set default address for customer
export async function setDefaultAddress(customerId: string, addressId: string): Promise<boolean> {
  console.log(`⭐ CUSTOMERS DATABASE: Setting default address ${addressId} for customer ${customerId}`)
  const customer = await getCustomerById(customerId)
  
  if (!customer) {
    console.log(`❌ CUSTOMERS DATABASE: Customer not found for setting default address: ${customerId}`)
    return false
  }
  
  const addressIndex = customer.addresses.findIndex(a => a.id === addressId)
  
  if (addressIndex === -1) {
    console.log(`❌ CUSTOMERS DATABASE: Address not found: ${addressId}`)
    return false
  }
  
  // Remove default flag from all addresses
  customer.addresses.forEach(addr => {
    addr.isDefault = false
  })
  
  // Set new default
  customer.addresses[addressIndex].isDefault = true
  customer.defaultShippingAddress = customer.addresses[addressIndex]
  
  await updateCustomer(customerId, { 
    addresses: customer.addresses,
    defaultShippingAddress: customer.defaultShippingAddress
  })
  
  console.log(`✅ CUSTOMERS DATABASE: Set default address to ${addressId}`)
  return true
}
