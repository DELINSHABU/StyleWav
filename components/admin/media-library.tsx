"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, CheckCircle, Image as ImageIcon, Upload } from "lucide-react"
import { BannerImage } from "@/lib/media-types"
import { Product } from "@/lib/products"

export function MediaLibrary({ products }: { products: Product[] }) {
  const [banners, setBanners] = useState<BannerImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newBannerUrl, setNewBannerUrl] = useState("")
  const [newBannerAlt, setNewBannerAlt] = useState("")
  const [newBannerTitle, setNewBannerTitle] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [productImageUrl, setProductImageUrl] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState("")

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/admin/media/banners')
      if (response.ok) {
        const data = await response.json()
        setBanners(data)
      }
    } catch (error) {
      console.error('Error fetching banners:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (file: File, type: 'banner' | 'product') => {
    if (!file) return null

    setIsUploading(true)
    setUploadProgress('Uploading...')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setUploadProgress('Upload successful!')
        setTimeout(() => setUploadProgress(''), 2000)
        return data.url
      } else {
        const error = await response.json()
        alert(error.error || 'Upload failed')
        return null
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Upload failed')
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const handleBannerFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const url = await handleFileUpload(file, 'banner')
    if (url) {
      setNewBannerUrl(url)
    }
  }

  const handleProductFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const url = await handleFileUpload(file, 'product')
    if (url) {
      setProductImageUrl(url)
    }
  }

  const addBanner = async () => {
    if (!newBannerUrl || !newBannerAlt || !newBannerTitle) {
      alert('Please fill all fields')
      return
    }

    try {
      const response = await fetch('/api/admin/media/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: newBannerUrl,
          alt: newBannerAlt,
          title: newBannerTitle,
          isActive: banners.length === 0
        })
      })

      if (response.ok) {
        setNewBannerUrl("")
        setNewBannerAlt("")
        setNewBannerTitle("")
        fetchBanners()
      }
    } catch (error) {
      console.error('Error adding banner:', error)
    }
  }

  const setActiveBanner = async (id: string) => {
    try {
      const response = await fetch('/api/admin/media/banners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'setActive' })
      })

      if (response.ok) {
        fetchBanners()
      }
    } catch (error) {
      console.error('Error setting active banner:', error)
    }
  }

  const deleteBanner = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return

    try {
      const response = await fetch(`/api/admin/media/banners?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchBanners()
      }
    } catch (error) {
      console.error('Error deleting banner:', error)
    }
  }

  const updateProductImage = async () => {
    if (!selectedProduct || !productImageUrl) {
      alert('Please select a product and provide an image URL')
      return
    }

    try {
      const product = products.find(p => p.id === selectedProduct)
      if (!product) return

      const updatedImages = [...(product.images || [product.image]), productImageUrl]
      
      const response = await fetch(`/api/admin/products/${selectedProduct}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: updatedImages })
      })

      if (response.ok) {
        alert('Product image added successfully')
        setProductImageUrl("")
        setSelectedProduct("")
      }
    } catch (error) {
      console.error('Error updating product image:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading media library...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="banners" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="banners">Banner Images</TabsTrigger>
          <TabsTrigger value="products">Product Images</TabsTrigger>
        </TabsList>

        <TabsContent value="banners" className="space-y-6">
          {/* Add New Banner */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Banner
              </CardTitle>
              <CardDescription>
                Upload a new banner image for the hero section
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bannerFile">Upload Image File</Label>
                  <Input
                    id="bannerFile"
                    type="file"
                    accept="image/*"
                    onChange={handleBannerFileSelect}
                    disabled={isUploading}
                  />
                  {uploadProgress && (
                    <p className="text-xs text-green-600 font-medium">{uploadProgress}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Upload an image (max 5MB) or enter URL below
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bannerUrl">Or Enter Image URL</Label>
                  <Input
                    id="bannerUrl"
                    placeholder="https://example.com/banner.jpg or /images/banner.jpg"
                    value={newBannerUrl}
                    onChange={(e) => setNewBannerUrl(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bannerTitle">Banner Title</Label>
                  <Input
                    id="bannerTitle"
                    placeholder="e.g., Summer Collection 2025"
                    value={newBannerTitle}
                    onChange={(e) => setNewBannerTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bannerAlt">Alt Text</Label>
                  <Input
                    id="bannerAlt"
                    placeholder="e.g., Person wearing oversized graphic tee"
                    value={newBannerAlt}
                    onChange={(e) => setNewBannerAlt(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={addBanner} className="w-full" disabled={isUploading}>
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Add Banner'}
              </Button>
            </CardContent>
          </Card>

          {/* Existing Banners */}
          <Card>
            <CardHeader>
              <CardTitle>Existing Banners ({banners.length})</CardTitle>
              <CardDescription>
                Click "Set Active" to display a banner on the homepage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {banners.map((banner) => (
                  <Card key={banner.id} className={banner.isActive ? "border-primary shadow-md" : ""}>
                    <CardContent className="p-4 space-y-3">
                      <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
                        <img
                          src={banner.url}
                          alt={banner.alt}
                          className="w-full h-full object-cover"
                        />
                        {banner.isActive && (
                          <Badge className="absolute top-2 right-2 bg-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold">{banner.title}</h4>
                        <p className="text-xs text-muted-foreground">{banner.alt}</p>
                      </div>
                      <div className="flex gap-2">
                        {!banner.isActive && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setActiveBanner(banner.id)}
                            className="flex-1"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Set Active
                          </Button>
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteBanner(banner.id)}
                          className={banner.isActive ? "flex-1" : ""}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {banners.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No banners yet. Add your first banner above.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Product Image
              </CardTitle>
              <CardDescription>
                Add additional images to product listings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product">Select Product</Label>
                <select
                  id="product"
                  className="w-full p-2 border rounded-md bg-background"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                >
                  <option value="">-- Select a product --</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="productImageFile">Upload Image File</Label>
                <Input
                  id="productImageFile"
                  type="file"
                  accept="image/*"
                  onChange={handleProductFileSelect}
                  disabled={isUploading}
                />
                {uploadProgress && (
                  <p className="text-xs text-green-600 font-medium">{uploadProgress}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Upload an image (max 5MB) or enter URL below
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="productImageUrl">Or Enter Image URL</Label>
                <Input
                  id="productImageUrl"
                  placeholder="https://example.com/product.jpg"
                  value={productImageUrl}
                  onChange={(e) => setProductImageUrl(e.target.value)}
                />
              </div>
              <Button onClick={updateProductImage} className="w-full" disabled={isUploading}>
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Add Image to Product'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Image Gallery</CardTitle>
              <CardDescription>
                View all products and their images
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <Card key={product.id}>
                    <CardContent className="p-4 space-y-2">
                      <div className="aspect-square bg-muted rounded-md overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{product.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {product.images?.length || 1} image(s)
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
