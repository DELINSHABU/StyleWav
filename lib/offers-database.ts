import fs from 'fs/promises'
import path from 'path'
import type { Offer, OfferUsage, OffersDatabase } from './database-types'

const OFFERS_DB_PATH = path.join(process.cwd(), 'jsonDatabase', 'offers.json')

// Initialize database if it doesn't exist
async function initializeDatabase(): Promise<OffersDatabase> {
  try {
    const data = await fs.readFile(OFFERS_DB_PATH, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    // If file doesn't exist, create it with default structure
    const defaultDb: OffersDatabase = {
      offers: [],
      usage: []
    }
    await fs.writeFile(OFFERS_DB_PATH, JSON.stringify(defaultDb, null, 2))
    return defaultDb
  }
}

// Read offers database
export async function readOffersDatabase(): Promise<OffersDatabase> {
  return initializeDatabase()
}

// Write to offers database
async function writeOffersDatabase(data: OffersDatabase): Promise<void> {
  await fs.writeFile(OFFERS_DB_PATH, JSON.stringify(data, null, 2))
}

// Get all offers
export async function getAllOffers(): Promise<Offer[]> {
  const db = await readOffersDatabase()
  return db.offers
}

// Get offer by ID
export async function getOfferById(id: string): Promise<Offer | null> {
  const db = await readOffersDatabase()
  return db.offers.find(offer => offer.id === id) || null
}

// Get active offers
export async function getActiveOffers(): Promise<Offer[]> {
  const db = await readOffersDatabase()
  const now = new Date().toISOString()
  
  return db.offers.filter(offer => 
    offer.isActive && 
    offer.startDate <= now && 
    offer.endDate >= now &&
    (!offer.usageLimit || offer.usageCount < offer.usageLimit)
  )
}

// Get offers by type
export async function getOffersByType(type: Offer['type']): Promise<Offer[]> {
  const db = await readOffersDatabase()
  return db.offers.filter(offer => offer.type === type)
}

// Create new offer
export async function createOffer(offerData: Omit<Offer, 'id' | 'usageCount' | 'createdAt' | 'updatedAt'>): Promise<Offer> {
  const db = await readOffersDatabase()
  
  const newOffer: Offer = {
    ...offerData,
    id: `offer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    usageCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  db.offers.push(newOffer)
  await writeOffersDatabase(db)
  
  return newOffer
}

// Update offer
export async function updateOffer(id: string, updates: Partial<Omit<Offer, 'id' | 'createdAt'>>): Promise<Offer | null> {
  const db = await readOffersDatabase()
  const offerIndex = db.offers.findIndex(offer => offer.id === id)
  
  if (offerIndex === -1) {
    return null
  }
  
  db.offers[offerIndex] = {
    ...db.offers[offerIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  }
  
  await writeOffersDatabase(db)
  return db.offers[offerIndex]
}

// Delete offer
export async function deleteOffer(id: string): Promise<boolean> {
  const db = await readOffersDatabase()
  const offerIndex = db.offers.findIndex(offer => offer.id === id)
  
  if (offerIndex === -1) {
    return false
  }
  
  db.offers.splice(offerIndex, 1)
  await writeOffersDatabase(db)
  
  return true
}

// Toggle offer active status
export async function toggleOfferStatus(id: string): Promise<Offer | null> {
  const db = await readOffersDatabase()
  const offerIndex = db.offers.findIndex(offer => offer.id === id)
  
  if (offerIndex === -1) {
    return null
  }
  
  db.offers[offerIndex].isActive = !db.offers[offerIndex].isActive
  db.offers[offerIndex].updatedAt = new Date().toISOString()
  
  await writeOffersDatabase(db)
  return db.offers[offerIndex]
}

// Record offer usage
export async function recordOfferUsage(
  offerId: string,
  customerId: string,
  customerEmail: string,
  orderId: string,
  discountApplied: number
): Promise<OfferUsage | null> {
  const db = await readOffersDatabase()
  const offerIndex = db.offers.findIndex(offer => offer.id === offerId)
  
  if (offerIndex === -1) {
    return null
  }
  
  // Increment usage count
  db.offers[offerIndex].usageCount += 1
  db.offers[offerIndex].updatedAt = new Date().toISOString()
  
  // Create usage record
  const usage: OfferUsage = {
    id: `usage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    offerId,
    customerId,
    customerEmail,
    orderId,
    discountApplied,
    usedAt: new Date().toISOString()
  }
  
  db.usage.push(usage)
  await writeOffersDatabase(db)
  
  return usage
}

// Get customer usage for an offer
export async function getCustomerOfferUsage(customerId: string, offerId: string): Promise<number> {
  const db = await readOffersDatabase()
  return db.usage.filter(u => u.customerId === customerId && u.offerId === offerId).length
}

// Get offer statistics
export async function getOfferStats(offerId: string) {
  const db = await readOffersDatabase()
  const offer = db.offers.find(o => o.id === offerId)
  
  if (!offer) {
    return null
  }
  
  const usages = db.usage.filter(u => u.offerId === offerId)
  const totalDiscountGiven = usages.reduce((sum, u) => sum + u.discountApplied, 0)
  const uniqueCustomers = new Set(usages.map(u => u.customerId)).size
  
  return {
    offer,
    totalUsages: usages.length,
    totalDiscountGiven,
    uniqueCustomers,
    recentUsages: usages.slice(-10).reverse()
  }
}

// Validate if customer can use offer
export async function canCustomerUseOffer(customerId: string, offerId: string): Promise<{ canUse: boolean; reason?: string }> {
  const db = await readOffersDatabase()
  const offer = db.offers.find(o => o.id === offerId)
  
  if (!offer) {
    return { canUse: false, reason: 'Offer not found' }
  }
  
  if (!offer.isActive) {
    return { canUse: false, reason: 'Offer is not active' }
  }
  
  const now = new Date().toISOString()
  if (offer.startDate > now) {
    return { canUse: false, reason: 'Offer has not started yet' }
  }
  
  if (offer.endDate < now) {
    return { canUse: false, reason: 'Offer has expired' }
  }
  
  if (offer.usageLimit && offer.usageCount >= offer.usageLimit) {
    return { canUse: false, reason: 'Offer usage limit reached' }
  }
  
  if (offer.perCustomerLimit) {
    const customerUsage = await getCustomerOfferUsage(customerId, offerId)
    if (customerUsage >= offer.perCustomerLimit) {
      return { canUse: false, reason: 'Customer usage limit reached' }
    }
  }
  
  return { canUse: true }
}
