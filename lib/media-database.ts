import fs from 'fs'
import path from 'path'
import { MediaLibrary, BannerImage } from './media-types'

const MEDIA_DB_PATH = path.join(process.cwd(), 'jsonDatabase', 'media.json')

// Read media data
export function readMediaData(): MediaLibrary {
  try {
    const data = fs.readFileSync(MEDIA_DB_PATH, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading media database:', error)
    return {
      banners: [],
      productImages: {},
      uploadedAt: new Date().toISOString()
    }
  }
}

// Write media data
export function writeMediaData(data: MediaLibrary): void {
  try {
    fs.writeFileSync(MEDIA_DB_PATH, JSON.stringify(data, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error writing media database:', error)
    throw error
  }
}

// Get active banner
export function getActiveBanner(): BannerImage | null {
  const media = readMediaData()
  return media.banners.find(b => b.isActive) || media.banners[0] || null
}

// Get all banners
export function getAllBanners(): BannerImage[] {
  const media = readMediaData()
  return media.banners
}

// Add banner
export function addBanner(banner: Omit<BannerImage, 'id' | 'createdAt' | 'updatedAt'>): BannerImage {
  const media = readMediaData()
  const newBanner: BannerImage = {
    ...banner,
    id: `banner-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  media.banners.push(newBanner)
  media.uploadedAt = new Date().toISOString()
  writeMediaData(media)
  return newBanner
}

// Update banner
export function updateBanner(id: string, updates: Partial<Omit<BannerImage, 'id' | 'createdAt'>>): BannerImage | null {
  const media = readMediaData()
  const index = media.banners.findIndex(b => b.id === id)
  if (index === -1) return null
  
  media.banners[index] = {
    ...media.banners[index],
    ...updates,
    updatedAt: new Date().toISOString()
  }
  
  media.uploadedAt = new Date().toISOString()
  writeMediaData(media)
  return media.banners[index]
}

// Delete banner
export function deleteBanner(id: string): boolean {
  const media = readMediaData()
  const index = media.banners.findIndex(b => b.id === id)
  if (index === -1) return false
  
  media.banners.splice(index, 1)
  media.uploadedAt = new Date().toISOString()
  writeMediaData(media)
  return true
}

// Set active banner
export function setActiveBanner(id: string): boolean {
  const media = readMediaData()
  const banner = media.banners.find(b => b.id === id)
  if (!banner) return false
  
  // Deactivate all banners
  media.banners.forEach(b => b.isActive = false)
  // Activate the selected one
  banner.isActive = true
  banner.updatedAt = new Date().toISOString()
  
  media.uploadedAt = new Date().toISOString()
  writeMediaData(media)
  return true
}

// Get product images
export function getProductImages(productId: string): string[] {
  const media = readMediaData()
  return media.productImages[productId] || []
}

// Update product images
export function updateProductImages(productId: string, imageUrls: string[]): void {
  const media = readMediaData()
  media.productImages[productId] = imageUrls
  media.uploadedAt = new Date().toISOString()
  writeMediaData(media)
}
