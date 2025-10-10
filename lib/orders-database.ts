import { promises as fs } from 'fs'
import path from 'path'
import { Order, OrderFilters } from './database-types'

const DB_PATH = path.join(process.cwd(), 'jsonDatabase')
const ORDERS_FILE = path.join(DB_PATH, 'orders.json')

// Ensure database directory exists
async function ensureDatabaseExists() {
  try {
    await fs.access(DB_PATH)
  } catch {
    await fs.mkdir(DB_PATH, { recursive: true })
  }
}

// Read orders from JSON file
export async function readOrdersFromFile(): Promise<Order[]> {
  console.log('🔍 Fetching data from ORDERS DATABASE (orders.json)')
  try {
    await ensureDatabaseExists()
    const data = await fs.readFile(ORDERS_FILE, 'utf-8')
    const orders = JSON.parse(data)
    console.log(`📦 ORDERS DATABASE: Found ${orders.length} orders`)
    return orders
  } catch (error) {
    console.warn('⚠️ ORDERS DATABASE: Could not read orders file, returning empty array:', error)
    return []
  }
}

// Write orders to JSON file
export async function writeOrdersToFile(orders: Order[]): Promise<void> {
  console.log(`💾 Saving data to ORDERS DATABASE (orders.json) - ${orders.length} orders`)
  try {
    await ensureDatabaseExists()
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8')
    console.log('✅ ORDERS DATABASE: Orders saved successfully')
  } catch (error) {
    console.error('❌ ORDERS DATABASE: Error writing orders to file:', error)
    throw error
  }
}

// Initialize orders file if it doesn't exist
export async function initializeOrdersFile(): Promise<void> {
  try {
    await fs.access(ORDERS_FILE)
    console.log('✅ ORDERS DATABASE: orders.json exists')
  } catch {
    console.log('🚀 ORDERS DATABASE: Initializing orders.json with empty array')
    await writeOrdersToFile([])
  }
}

// Generate unique order number
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString()
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `ORD-${timestamp.slice(-6)}-${random}`
}

// Create a new order
export async function createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'orderDate' | 'updatedAt'>): Promise<Order> {
  console.log('🆕 ORDERS DATABASE: Creating new order')
  const orders = await readOrdersFromFile()
  
  const newOrder: Order = {
    ...orderData,
    id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    orderNumber: generateOrderNumber(),
    orderDate: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  orders.push(newOrder)
  await writeOrdersToFile(orders)
  
  console.log(`✅ ORDERS DATABASE: Created order ${newOrder.orderNumber} for customer ${newOrder.customerEmail}`)
  return newOrder
}

// Get order by ID
export async function getOrderById(orderId: string): Promise<Order | null> {
  console.log(`🔍 ORDERS DATABASE: Looking for order with ID: ${orderId}`)
  const orders = await readOrdersFromFile()
  const order = orders.find(o => o.id === orderId)
  
  if (order) {
    console.log(`✅ ORDERS DATABASE: Found order ${order.orderNumber}`)
  } else {
    console.log(`❌ ORDERS DATABASE: Order not found with ID: ${orderId}`)
  }
  
  return order || null
}

// Get orders by customer ID
export async function getOrdersByCustomerId(customerId: string): Promise<Order[]> {
  console.log(`🔍 ORDERS DATABASE: Looking for orders by customer: ${customerId}`)
  const orders = await readOrdersFromFile()
  const customerOrders = orders.filter(o => o.customerId === customerId)
  
  console.log(`📦 ORDERS DATABASE: Found ${customerOrders.length} orders for customer ${customerId}`)
  return customerOrders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
}

// Get orders by customer email
export async function getOrdersByCustomerEmail(email: string): Promise<Order[]> {
  console.log(`🔍 ORDERS DATABASE: Looking for orders by email: ${email}`)
  const orders = await readOrdersFromFile()
  const customerOrders = orders.filter(o => o.customerEmail.toLowerCase() === email.toLowerCase())
  
  console.log(`📦 ORDERS DATABASE: Found ${customerOrders.length} orders for email ${email}`)
  return customerOrders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
}

// Update order
export async function updateOrder(orderId: string, updates: Partial<Order>): Promise<Order | null> {
  console.log(`🔄 ORDERS DATABASE: Updating order ${orderId}`)
  const orders = await readOrdersFromFile()
  const orderIndex = orders.findIndex(o => o.id === orderId)
  
  if (orderIndex === -1) {
    console.log(`❌ ORDERS DATABASE: Order not found for update: ${orderId}`)
    return null
  }
  
  orders[orderIndex] = {
    ...orders[orderIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  }
  
  await writeOrdersToFile(orders)
  console.log(`✅ ORDERS DATABASE: Updated order ${orders[orderIndex].orderNumber}`)
  return orders[orderIndex]
}

// Get all orders with optional filtering
export async function getAllOrders(filters?: OrderFilters): Promise<Order[]> {
  console.log('🔍 ORDERS DATABASE: Getting all orders with filters:', filters)
  let orders = await readOrdersFromFile()
  
  if (filters) {
    if (filters.status) {
      orders = orders.filter(o => o.status === filters.status)
    }
    if (filters.paymentStatus) {
      orders = orders.filter(o => o.paymentStatus === filters.paymentStatus)
    }
    if (filters.customerId) {
      orders = orders.filter(o => o.customerId === filters.customerId)
    }
    if (filters.startDate) {
      orders = orders.filter(o => new Date(o.orderDate) >= new Date(filters.startDate!))
    }
    if (filters.endDate) {
      orders = orders.filter(o => new Date(o.orderDate) <= new Date(filters.endDate!))
    }
    if (filters.minAmount) {
      orders = orders.filter(o => o.total >= filters.minAmount!)
    }
    if (filters.maxAmount) {
      orders = orders.filter(o => o.total <= filters.maxAmount!)
    }
  }
  
  console.log(`📦 ORDERS DATABASE: Returning ${orders.length} filtered orders`)
  return orders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
}

// Delete order (admin only)
export async function deleteOrder(orderId: string): Promise<boolean> {
  console.log(`🗑️ ORDERS DATABASE: Deleting order ${orderId}`)
  const orders = await readOrdersFromFile()
  const orderIndex = orders.findIndex(o => o.id === orderId)
  
  if (orderIndex === -1) {
    console.log(`❌ ORDERS DATABASE: Order not found for deletion: ${orderId}`)
    return false
  }
  
  const deletedOrder = orders[orderIndex]
  orders.splice(orderIndex, 1)
  await writeOrdersToFile(orders)
  
  console.log(`✅ ORDERS DATABASE: Deleted order ${deletedOrder.orderNumber}`)
  return true
}

// Get order statistics
export async function getOrderStatistics() {
  console.log('📊 ORDERS DATABASE: Calculating order statistics')
  const orders = await readOrdersFromFile()
  
  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length : 0,
    statusBreakdown: {
      pending: orders.filter(o => o.status === 'pending').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    },
    paymentStatusBreakdown: {
      pending: orders.filter(o => o.paymentStatus === 'pending').length,
      paid: orders.filter(o => o.paymentStatus === 'paid').length,
      failed: orders.filter(o => o.paymentStatus === 'failed').length,
      refunded: orders.filter(o => o.paymentStatus === 'refunded').length,
    }
  }
  
  console.log('📊 ORDERS DATABASE: Statistics calculated:', stats)
  return stats
}