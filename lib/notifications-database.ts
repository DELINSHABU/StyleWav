import fs from 'fs'
import path from 'path'
import { Notification, NotificationsDatabase, DatabaseResponse } from './database-types'

// Path to customers database to get all customer IDs
const CUSTOMERS_DB_PATH = path.join(process.cwd(), 'jsonDatabase', 'customers.json')

const NOTIFICATIONS_DB_PATH = path.join(process.cwd(), 'jsonDatabase', 'notifications.json')

// Initialize notifications database
function initializeNotificationsDatabase(): NotificationsDatabase {
  const defaultData: NotificationsDatabase = {
    notifications: {}
  }
  
  try {
    if (!fs.existsSync(NOTIFICATIONS_DB_PATH)) {
      const dir = path.dirname(NOTIFICATIONS_DB_PATH)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      fs.writeFileSync(NOTIFICATIONS_DB_PATH, JSON.stringify(defaultData, null, 2))
    }
    return defaultData
  } catch (error) {
    console.error('Error initializing notifications database:', error)
    return defaultData
  }
}

// Read notifications database
function readNotificationsDatabase(): NotificationsDatabase {
  try {
    if (!fs.existsSync(NOTIFICATIONS_DB_PATH)) {
      return initializeNotificationsDatabase()
    }
    const data = fs.readFileSync(NOTIFICATIONS_DB_PATH, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading notifications database:', error)
    return initializeNotificationsDatabase()
  }
}

// Write notifications database
function writeNotificationsDatabase(data: NotificationsDatabase): boolean {
  try {
    fs.writeFileSync(NOTIFICATIONS_DB_PATH, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error('Error writing notifications database:', error)
    return false
  }
}

// Create a notification
export async function createNotification(
  customerId: string,
  type: Notification['type'],
  title: string,
  message: string,
  data?: Notification['data'],
  expiresAt?: string
): Promise<DatabaseResponse<Notification>> {
  try {
    const db = readNotificationsDatabase()
    const now = new Date().toISOString()
    
    const notification: Notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      customerId,
      type,
      title,
      message,
      data,
      isRead: false,
      createdAt: now,
      expiresAt
    }
    
    // Initialize customer notifications array if doesn't exist
    if (!db.notifications[customerId]) {
      db.notifications[customerId] = []
    }
    
    // Add notification at the beginning (newest first)
    db.notifications[customerId].unshift(notification)
    
    // Keep only last 100 notifications per user
    if (db.notifications[customerId].length > 100) {
      db.notifications[customerId] = db.notifications[customerId].slice(0, 100)
    }
    
    writeNotificationsDatabase(db)
    
    return {
      success: true,
      data: notification,
      message: 'Notification created successfully'
    }
  } catch (error) {
    console.error('Error creating notification:', error)
    return {
      success: false,
      error: 'Failed to create notification'
    }
  }
}

// Get all notifications for a customer
export async function getCustomerNotifications(
  customerId: string,
  includeRead: boolean = true
): Promise<DatabaseResponse<Notification[]>> {
  try {
    const db = readNotificationsDatabase()
    
    let notifications = db.notifications[customerId] || []
    
    // Filter out expired notifications
    const now = new Date().toISOString()
    notifications = notifications.filter(n => !n.expiresAt || n.expiresAt > now)
    
    // Filter by read status if requested
    if (!includeRead) {
      notifications = notifications.filter(n => !n.isRead)
    }
    
    return {
      success: true,
      data: notifications
    }
  } catch (error) {
    console.error('Error getting customer notifications:', error)
    return {
      success: false,
      error: 'Failed to get notifications',
      data: []
    }
  }
}

// Get unread count for a customer
export async function getUnreadCount(customerId: string): Promise<DatabaseResponse<number>> {
  try {
    const db = readNotificationsDatabase()
    const notifications = db.notifications[customerId] || []
    const now = new Date().toISOString()
    
    const unreadCount = notifications.filter(n => 
      !n.isRead && (!n.expiresAt || n.expiresAt > now)
    ).length
    
    return {
      success: true,
      data: unreadCount
    }
  } catch (error) {
    console.error('Error getting unread count:', error)
    return {
      success: false,
      error: 'Failed to get unread count',
      data: 0
    }
  }
}

// Mark notification as read
export async function markAsRead(
  customerId: string,
  notificationId: string
): Promise<DatabaseResponse<boolean>> {
  try {
    const db = readNotificationsDatabase()
    
    if (!db.notifications[customerId]) {
      return {
        success: false,
        error: 'Customer not found'
      }
    }
    
    const notification = db.notifications[customerId].find(n => n.id === notificationId)
    
    if (!notification) {
      return {
        success: false,
        error: 'Notification not found'
      }
    }
    
    notification.isRead = true
    writeNotificationsDatabase(db)
    
    return {
      success: true,
      data: true,
      message: 'Notification marked as read'
    }
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return {
      success: false,
      error: 'Failed to mark as read'
    }
  }
}

// Mark all notifications as read for a customer
export async function markAllAsRead(customerId: string): Promise<DatabaseResponse<boolean>> {
  try {
    const db = readNotificationsDatabase()
    
    if (!db.notifications[customerId]) {
      return {
        success: true,
        data: true,
        message: 'No notifications to mark'
      }
    }
    
    db.notifications[customerId].forEach(n => {
      n.isRead = true
    })
    
    writeNotificationsDatabase(db)
    
    return {
      success: true,
      data: true,
      message: 'All notifications marked as read'
    }
  } catch (error) {
    console.error('Error marking all as read:', error)
    return {
      success: false,
      error: 'Failed to mark all as read'
    }
  }
}

// Delete a notification
export async function deleteNotification(
  customerId: string,
  notificationId: string
): Promise<DatabaseResponse<boolean>> {
  try {
    const db = readNotificationsDatabase()
    
    if (!db.notifications[customerId]) {
      return {
        success: false,
        error: 'Customer not found'
      }
    }
    
    const index = db.notifications[customerId].findIndex(n => n.id === notificationId)
    
    if (index === -1) {
      return {
        success: false,
        error: 'Notification not found'
      }
    }
    
    db.notifications[customerId].splice(index, 1)
    writeNotificationsDatabase(db)
    
    return {
      success: true,
      data: true,
      message: 'Notification deleted'
    }
  } catch (error) {
    console.error('Error deleting notification:', error)
    return {
      success: false,
      error: 'Failed to delete notification'
    }
  }
}

// Delete all notifications for a customer
export async function deleteAllNotifications(customerId: string): Promise<DatabaseResponse<boolean>> {
  try {
    const db = readNotificationsDatabase()
    
    db.notifications[customerId] = []
    writeNotificationsDatabase(db)
    
    return {
      success: true,
      data: true,
      message: 'All notifications deleted'
    }
  } catch (error) {
    console.error('Error deleting all notifications:', error)
    return {
      success: false,
      error: 'Failed to delete all notifications'
    }
  }
}

// Broadcast notification to all customers (for admin)
export async function broadcastNotification(
  type: Notification['type'],
  title: string,
  message: string,
  data?: Notification['data'],
  expiresAt?: string
): Promise<DatabaseResponse<number>> {
  try {
    // Get all customer IDs from multiple sources
    const customerIds = new Set<string>()
    
    // 1. Get from customers.json (array format)
    try {
      if (fs.existsSync(CUSTOMERS_DB_PATH)) {
        const customersData = fs.readFileSync(CUSTOMERS_DB_PATH, 'utf-8')
        const customersDb = JSON.parse(customersData)
        
        // Handle both array and object formats
        if (Array.isArray(customersDb)) {
          customersDb.forEach((customer: any) => {
            if (customer.id) customerIds.add(customer.id)
          })
        } else if (typeof customersDb === 'object') {
          Object.keys(customersDb).forEach(id => customerIds.add(id))
        }
      }
    } catch (error) {
      console.error('Error reading customers database:', error)
    }
    
    // 2. Get from coins database
    try {
      const coinsDbPath = path.join(process.cwd(), 'jsonDatabase', 'coins.json')
      if (fs.existsSync(coinsDbPath)) {
        const coinsData = fs.readFileSync(coinsDbPath, 'utf-8')
        const coinsDb = JSON.parse(coinsData)
        Object.keys(coinsDb.customers || {}).forEach(id => customerIds.add(id))
      }
    } catch (error) {
      console.error('Error reading coins database:', error)
    }
    
    // 3. Get from orders database
    try {
      const ordersDbPath = path.join(process.cwd(), 'jsonDatabase', 'orders.json')
      if (fs.existsSync(ordersDbPath)) {
        const ordersData = fs.readFileSync(ordersDbPath, 'utf-8')
        const ordersDb = JSON.parse(ordersData)
        
        // Handle both array and object formats
        if (Array.isArray(ordersDb)) {
          ordersDb.forEach((order: any) => {
            if (order.customerId) customerIds.add(order.customerId)
          })
        } else if (typeof ordersDb === 'object') {
          Object.values(ordersDb).forEach((order: any) => {
            if (order.customerId) customerIds.add(order.customerId)
          })
        }
      }
    } catch (error) {
      console.error('Error reading orders database:', error)
    }
    
    // 4. Get from notifications database as fallback
    try {
      const db = readNotificationsDatabase()
      Object.keys(db.notifications).forEach(id => customerIds.add(id))
    } catch (error) {
      console.error('Error reading notifications database:', error)
    }
    
    let successCount = 0
    
    for (const customerId of customerIds) {
      const result = await createNotification(customerId, type, title, message, data, expiresAt)
      if (result.success) {
        successCount++
      }
    }
    
    return {
      success: true,
      data: successCount,
      message: `Notification sent to ${successCount} customers`
    }
  } catch (error) {
    console.error('Error broadcasting notification:', error)
    return {
      success: false,
      error: 'Failed to broadcast notification',
      data: 0
    }
  }
}

// Send notification to specific customers (for admin)
export async function sendToCustomers(
  customerIds: string[],
  type: Notification['type'],
  title: string,
  message: string,
  data?: Notification['data'],
  expiresAt?: string
): Promise<DatabaseResponse<number>> {
  try {
    let successCount = 0
    
    for (const customerId of customerIds) {
      const result = await createNotification(customerId, type, title, message, data, expiresAt)
      if (result.success) {
        successCount++
      }
    }
    
    return {
      success: true,
      data: successCount,
      message: `Notification sent to ${successCount} customers`
    }
  } catch (error) {
    console.error('Error sending to customers:', error)
    return {
      success: false,
      error: 'Failed to send notifications',
      data: 0
    }
  }
}
