export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export type OrderItem = {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

export type Order = {
  id: string
  orderNumber: string
  customerId?: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  status: OrderStatus
  createdAt: string
  updatedAt: string
  notes?: string
}

// Mock orders data
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'SW-2024-001',
    customerName: 'Rahul Kumar',
    customerEmail: 'rahul.kumar@email.com',
    customerPhone: '+91 9876543210',
    shippingAddress: {
      street: '123 MG Road',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560001'
    },
    items: [
      {
        id: 'sw-001',
        name: 'Wave Rider Oversized Tee',
        price: 699,
        quantity: 2,
        image: '/oversized-graphic-tee.png'
      },
      {
        id: 'sw-004',
        name: 'Core Black Tee',
        price: 599,
        quantity: 1,
        image: '/black-tee-minimal.jpg'
      }
    ],
    subtotal: 1997,
    shipping: 0,
    total: 1997,
    status: 'processing',
    createdAt: '2024-10-05T14:30:00Z',
    updatedAt: '2024-10-05T14:30:00Z',
    notes: 'Customer requested express delivery'
  },
  {
    id: '2',
    orderNumber: 'SW-2024-002',
    customerName: 'Priya Sharma',
    customerEmail: 'priya.sharma@email.com',
    customerPhone: '+91 9876543211',
    shippingAddress: {
      street: '456 Park Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001'
    },
    items: [
      {
        id: 'sw-002',
        name: 'Monochrome Graphic Tee',
        price: 649,
        quantity: 1,
        image: '/monochrome-tee.jpg'
      }
    ],
    subtotal: 649,
    shipping: 99,
    total: 748,
    status: 'shipped',
    createdAt: '2024-10-04T10:15:00Z',
    updatedAt: '2024-10-06T09:20:00Z'
  },
  {
    id: '3',
    orderNumber: 'SW-2024-003',
    customerName: 'Amit Singh',
    customerEmail: 'amit.singh@email.com',
    customerPhone: '+91 9876543212',
    shippingAddress: {
      street: '789 Connaught Place',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110001'
    },
    items: [
      {
        id: 'sw-005',
        name: 'Neon Print Tee',
        price: 799,
        quantity: 1,
        image: '/neon-print-tee.jpg'
      },
      {
        id: 'sw-007',
        name: 'Minimal Logo Tee',
        price: 599,
        quantity: 2,
        image: '/minimal-logo-tee.jpg'
      }
    ],
    subtotal: 1997,
    shipping: 0,
    total: 1997,
    status: 'delivered',
    createdAt: '2024-10-03T16:45:00Z',
    updatedAt: '2024-10-07T11:30:00Z'
  },
  {
    id: '4',
    orderNumber: 'SW-2024-004',
    customerName: 'Sneha Patel',
    customerEmail: 'sneha.patel@email.com',
    customerPhone: '+91 9876543213',
    shippingAddress: {
      street: '321 SG Highway',
      city: 'Ahmedabad',
      state: 'Gujarat',
      zipCode: '380001'
    },
    items: [
      {
        id: 'sw-008',
        name: 'Daily Comfort Tee',
        price: 549,
        quantity: 3,
        image: '/plain-tee-comfort.jpg'
      }
    ],
    subtotal: 1647,
    shipping: 0,
    total: 1647,
    status: 'pending',
    createdAt: '2024-10-07T12:20:00Z',
    updatedAt: '2024-10-07T12:20:00Z'
  }
]

// Working copy for admin management
let orders = [...mockOrders]

export function getAllOrders(): Order[] {
  // In a real app, this would fetch from a database
  const saved = typeof window !== 'undefined' ? localStorage.getItem('stylewave-orders') : null
  if (saved) {
    try {
      orders = JSON.parse(saved)
    } catch (e) {
      console.error('Error loading orders from localStorage:', e)
    }
  }
  return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function saveOrders(newOrders: Order[]) {
  orders = newOrders
  // In a real app, this would save to a database
  if (typeof window !== 'undefined') {
    localStorage.setItem('stylewave-orders', JSON.stringify(orders))
  }
}

export function getOrderById(id: string): Order | null {
  return orders.find(order => order.id === id) || null
}

export function updateOrderStatus(id: string, status: OrderStatus, notes?: string): Order | null {
  const index = orders.findIndex(order => order.id === id)
  if (index === -1) return null
  
  orders[index] = {
    ...orders[index],
    status,
    updatedAt: new Date().toISOString(),
    ...(notes && { notes })
  }
  saveOrders(orders)
  return orders[index]
}

export function getOrderStats() {
  const totalOrders = orders.length
  const pendingOrders = orders.filter(order => order.status === 'pending').length
  const processingOrders = orders.filter(order => order.status === 'processing').length
  const shippedOrders = orders.filter(order => order.status === 'shipped').length
  const deliveredOrders = orders.filter(order => order.status === 'delivered').length
  const totalRevenue = orders.filter(order => order.status !== 'cancelled').reduce((sum, order) => sum + order.total, 0)
  
  return {
    totalOrders,
    pendingOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    totalRevenue
  }
}

export function createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Order {
  const newOrder: Order = {
    ...orderData,
    id: String(Date.now()),
    orderNumber: `SW-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  orders.push(newOrder)
  saveOrders(orders)
  return newOrder
}

export function getOrderStatusColor(status: OrderStatus): string {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'processing':
      return 'bg-blue-100 text-blue-800'
    case 'shipped':
      return 'bg-purple-100 text-purple-800'
    case 'delivered':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}