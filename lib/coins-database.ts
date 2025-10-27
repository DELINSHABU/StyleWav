import fs from 'fs'
import path from 'path'
import { CustomerCoins, CoinTransaction, CoinsDatabase, DatabaseResponse } from './database-types'

const COINS_DB_PATH = path.join(process.cwd(), 'jsonDatabase', 'coins.json')

// Initialize coins database if it doesn't exist
function initializeCoinsDatabase(): CoinsDatabase {
  const defaultData: CoinsDatabase = {
    customers: {}
  }
  
  try {
    if (!fs.existsSync(COINS_DB_PATH)) {
      const dir = path.dirname(COINS_DB_PATH)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      fs.writeFileSync(COINS_DB_PATH, JSON.stringify(defaultData, null, 2))
    }
    return defaultData
  } catch (error) {
    console.error('Error initializing coins database:', error)
    return defaultData
  }
}

// Read coins database
function readCoinsDatabase(): CoinsDatabase {
  try {
    if (!fs.existsSync(COINS_DB_PATH)) {
      return initializeCoinsDatabase()
    }
    const data = fs.readFileSync(COINS_DB_PATH, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading coins database:', error)
    return initializeCoinsDatabase()
  }
}

// Write coins database
function writeCoinsDatabase(data: CoinsDatabase): boolean {
  try {
    fs.writeFileSync(COINS_DB_PATH, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error('Error writing coins database:', error)
    return false
  }
}

// Get customer coins
export async function getCustomerCoins(customerId: string): Promise<DatabaseResponse<CustomerCoins>> {
  try {
    const db = readCoinsDatabase()
    
    if (!db.customers[customerId]) {
      // Create new customer coins record with welcome bonus
      const now = new Date().toISOString()
      const welcomeTransaction: CoinTransaction = {
        id: `txn_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        customerId,
        customerEmail: '',
        type: 'gift',
        amount: 100, // Welcome bonus
        balanceBefore: 0,
        balanceAfter: 100,
        description: 'Welcome bonus',
        giftedBy: 'system',
        createdAt: now
      }
      
      const newCustomerCoins: CustomerCoins = {
        customerId,
        customerEmail: '',
        balance: 100,
        totalEarned: 100,
        totalSpent: 0,
        lastTransactionDate: now,
        createdAt: now,
        updatedAt: now,
        transactions: [welcomeTransaction]
      }
      
      db.customers[customerId] = newCustomerCoins
      writeCoinsDatabase(db)
      
      return {
        success: true,
        data: newCustomerCoins
      }
    }
    
    return {
      success: true,
      data: db.customers[customerId]
    }
  } catch (error) {
    console.error('Error getting customer coins:', error)
    return {
      success: false,
      error: 'Failed to get customer coins'
    }
  }
}

// Add coins to customer (purchase or gift)
export async function addCoins(
  customerId: string,
  customerEmail: string,
  amount: number,
  type: 'purchase' | 'gift',
  description: string,
  options?: {
    paymentMethod?: string
    paymentAmount?: number
    giftedBy?: string
  }
): Promise<DatabaseResponse<CustomerCoins>> {
  try {
    const db = readCoinsDatabase()
    const now = new Date().toISOString()
    
    // Get or create customer coins record
    if (!db.customers[customerId]) {
      db.customers[customerId] = {
        customerId,
        customerEmail,
        balance: 0,
        totalEarned: 0,
        totalSpent: 0,
        lastTransactionDate: now,
        createdAt: now,
        updatedAt: now,
        transactions: []
      }
    }
    
    const customerCoins = db.customers[customerId]
    const balanceBefore = customerCoins.balance
    const balanceAfter = balanceBefore + amount
    
    const transaction: CoinTransaction = {
      id: `txn_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      customerId,
      customerEmail,
      type,
      amount,
      balanceBefore,
      balanceAfter,
      description,
      paymentMethod: options?.paymentMethod,
      paymentAmount: options?.paymentAmount,
      giftedBy: options?.giftedBy,
      createdAt: now
    }
    
    // Update customer coins
    customerCoins.balance = balanceAfter
    customerCoins.totalEarned += amount
    customerCoins.lastTransactionDate = now
    customerCoins.updatedAt = now
    customerCoins.transactions.push(transaction)
    
    // Update email if provided and not set
    if (customerEmail && !customerCoins.customerEmail) {
      customerCoins.customerEmail = customerEmail
    }
    
    writeCoinsDatabase(db)
    
    return {
      success: true,
      data: customerCoins,
      message: `Successfully added ${amount} coins`
    }
  } catch (error) {
    console.error('Error adding coins:', error)
    return {
      success: false,
      error: 'Failed to add coins'
    }
  }
}

// Deduct coins from customer (for purchases)
export async function deductCoins(
  customerId: string,
  amount: number,
  description: string,
  orderId?: string
): Promise<DatabaseResponse<CustomerCoins>> {
  try {
    const db = readCoinsDatabase()
    
    if (!db.customers[customerId]) {
      return {
        success: false,
        error: 'Customer coins not found'
      }
    }
    
    const customerCoins = db.customers[customerId]
    
    // Check if customer has enough coins
    if (customerCoins.balance < amount) {
      return {
        success: false,
        error: 'Insufficient coin balance'
      }
    }
    
    const now = new Date().toISOString()
    const balanceBefore = customerCoins.balance
    const balanceAfter = balanceBefore - amount
    
    const transaction: CoinTransaction = {
      id: `txn_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      customerId,
      customerEmail: customerCoins.customerEmail,
      type: 'deduction',
      amount: -amount, // negative for deduction
      balanceBefore,
      balanceAfter,
      description,
      orderId,
      createdAt: now
    }
    
    // Update customer coins
    customerCoins.balance = balanceAfter
    customerCoins.totalSpent += amount
    customerCoins.lastTransactionDate = now
    customerCoins.updatedAt = now
    customerCoins.transactions.push(transaction)
    
    writeCoinsDatabase(db)
    
    return {
      success: true,
      data: customerCoins,
      message: `Successfully deducted ${amount} coins`
    }
  } catch (error) {
    console.error('Error deducting coins:', error)
    return {
      success: false,
      error: 'Failed to deduct coins'
    }
  }
}

// Get all customers coins (for admin)
export async function getAllCustomersCoins(): Promise<DatabaseResponse<CustomerCoins[]>> {
  try {
    const db = readCoinsDatabase()
    const customersCoinsList = Object.values(db.customers)
    
    // Sort by balance descending
    customersCoinsList.sort((a, b) => b.balance - a.balance)
    
    return {
      success: true,
      data: customersCoinsList
    }
  } catch (error) {
    console.error('Error getting all customers coins:', error)
    return {
      success: false,
      error: 'Failed to get customers coins'
    }
  }
}

// Get transaction history for a customer
export async function getTransactionHistory(
  customerId: string,
  limit?: number
): Promise<DatabaseResponse<CoinTransaction[]>> {
  try {
    const db = readCoinsDatabase()
    
    if (!db.customers[customerId]) {
      return {
        success: true,
        data: []
      }
    }
    
    let transactions = [...db.customers[customerId].transactions]
    
    // Sort by date descending (newest first)
    transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    // Apply limit if specified
    if (limit && limit > 0) {
      transactions = transactions.slice(0, limit)
    }
    
    return {
      success: true,
      data: transactions
    }
  } catch (error) {
    console.error('Error getting transaction history:', error)
    return {
      success: false,
      error: 'Failed to get transaction history'
    }
  }
}

// Refund coins (e.g., when order is cancelled)
export async function refundCoins(
  customerId: string,
  amount: number,
  description: string,
  orderId?: string
): Promise<DatabaseResponse<CustomerCoins>> {
  try {
    const db = readCoinsDatabase()
    
    if (!db.customers[customerId]) {
      return {
        success: false,
        error: 'Customer coins not found'
      }
    }
    
    const customerCoins = db.customers[customerId]
    const now = new Date().toISOString()
    const balanceBefore = customerCoins.balance
    const balanceAfter = balanceBefore + amount
    
    const transaction: CoinTransaction = {
      id: `txn_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      customerId,
      customerEmail: customerCoins.customerEmail,
      type: 'refund',
      amount,
      balanceBefore,
      balanceAfter,
      description,
      orderId,
      createdAt: now
    }
    
    // Update customer coins
    customerCoins.balance = balanceAfter
    customerCoins.totalEarned += amount
    customerCoins.totalSpent -= amount // adjust total spent
    customerCoins.lastTransactionDate = now
    customerCoins.updatedAt = now
    customerCoins.transactions.push(transaction)
    
    writeCoinsDatabase(db)
    
    return {
      success: true,
      data: customerCoins,
      message: `Successfully refunded ${amount} coins`
    }
  } catch (error) {
    console.error('Error refunding coins:', error)
    return {
      success: false,
      error: 'Failed to refund coins'
    }
  }
}

// Coin to currency conversion rate (1 coin = $0.01)
export const COIN_TO_CURRENCY_RATE = 0.01
export const CURRENCY_TO_COIN_RATE = 100

// Convert currency to coins
export function currencyToCoins(amount: number): number {
  return Math.floor(amount * CURRENCY_TO_COIN_RATE)
}

// Convert coins to currency
export function coinsToCurrency(coins: number): number {
  return coins * COIN_TO_CURRENCY_RATE
}
