export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  size?: string
  color?: string
}

export interface ShippingAddress {
  id?: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  address: string
  city: string
  state: string
  zipCode: string
  country?: string
  isDefault?: boolean
}

export interface Order {
  id: string
  orderNumber: string
  customerId: string
  customerEmail: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentMethod?: string
  shippingAddress: ShippingAddress
  orderDate: string
  updatedAt: string
  trackingNumber?: string
  notes?: string
}

export interface CustomerWishlistItem {
  id: string
  name: string
  price: number
  image: string
  addedAt: string
}

export interface CustomerCartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  size?: string
  color?: string
  addedAt: string
}

export interface Customer {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  dateJoined: string
  lastActive: string
  isActive: boolean
  
  // Addresses
  defaultShippingAddress?: ShippingAddress
  addresses: ShippingAddress[]
  
  // Shopping data
  wishlist: CustomerWishlistItem[]
  cart: CustomerCartItem[]
  
  // Order history
  totalOrders: number
  totalSpent: number
  lastOrderDate?: string
  
  // Preferences
  emailMarketing: boolean
  smsMarketing: boolean
  preferences?: {
    currency: string
    notifications: boolean
    [key: string]: any
  }
}

// Database response types
export interface DatabaseResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  error?: string
}

// Search and filter types
export interface OrderFilters {
  status?: Order['status']
  paymentStatus?: Order['paymentStatus']
  customerId?: string
  startDate?: string
  endDate?: string
  minAmount?: number
  maxAmount?: number
}

export interface CustomerFilters {
  isActive?: boolean
  hasOrders?: boolean
  minSpent?: number
  maxSpent?: number
  joinedAfter?: string
  joinedBefore?: string
}

// Coin system types
export interface CoinTransaction {
  id: string
  customerId: string
  customerEmail: string
  type: 'purchase' | 'gift' | 'deduction' | 'refund'
  amount: number // positive for credits, negative for deductions
  balanceBefore: number
  balanceAfter: number
  description: string
  orderId?: string // if coins used for purchase
  paymentMethod?: string // for purchased coins
  paymentAmount?: number // real money amount for purchased coins
  giftedBy?: string // admin email if gifted
  createdAt: string
}

export interface CustomerCoins {
  customerId: string
  customerEmail: string
  balance: number
  totalEarned: number // total coins ever received
  totalSpent: number // total coins ever used
  lastTransactionDate: string
  createdAt: string
  updatedAt: string
  transactions: CoinTransaction[]
}

export interface CoinPurchasePackage {
  id: string
  name: string
  coins: number
  price: number // in real currency
  bonusCoins?: number
  popular?: boolean
}

export interface CoinsDatabase {
  customers: {
    [customerId: string]: CustomerCoins
  }
}

// Notification system types
export interface Notification {
  id: string
  customerId: string
  type: 'coin_gift' | 'offer' | 'order_update' | 'system' | 'promotion'
  title: string
  message: string
  data?: {
    coinAmount?: number
    orderId?: string
    link?: string
    [key: string]: any
  }
  isRead: boolean
  createdAt: string
  expiresAt?: string
}

export interface NotificationsDatabase {
  notifications: {
    [customerId: string]: Notification[]
  }
}

// Offer system types
export interface Offer {
  id: string
  name: string
  description: string
  type: 'product' | 'combo' | 'payment_method' | 'category' | 'sitewide'
  discountType: 'percentage' | 'fixed' | 'coins'
  discountValue: number // percentage (10 = 10%), fixed amount, or coin value
  
  // Applicability
  productIds?: string[] // for product-specific offers
  comboProductIds?: string[][] // array of product ID arrays for combo offers
  paymentMethods?: string[] // for payment method specific offers (e.g., ['card', 'upi', 'wallet'])
  categories?: string[] // for category-specific offers
  
  // Conditions
  minPurchaseAmount?: number
  maxDiscountAmount?: number // cap for percentage discounts
  usageLimit?: number // total usage limit across all customers
  usageCount: number // current usage count
  perCustomerLimit?: number // per customer usage limit
  
  // Validity
  startDate: string
  endDate: string
  isActive: boolean
  
  // Metadata
  code?: string // optional promo code
  priority: number // higher priority offers apply first
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface OfferUsage {
  id: string
  offerId: string
  customerId: string
  customerEmail: string
  orderId: string
  discountApplied: number
  usedAt: string
}

export interface OffersDatabase {
  offers: Offer[]
  usage: OfferUsage[]
}
