export interface BannerImage {
  id: string
  url: string
  alt: string
  title: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface MediaLibrary {
  banners: BannerImage[]
  productImages: Record<string, string[]> // productId -> image URLs
  uploadedAt: string
}
