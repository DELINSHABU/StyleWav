"use client"

import { useState, useRef } from "react"
import { Product } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Upload, X, Save, Infinity, Plus } from "lucide-react"

interface ProductFormProps {
  product?: Product | null
  onSubmit: (product: Product | Omit<Product, "id">) => void
  onCancel: () => void
  isEditing: boolean
}

export function ProductForm({ product, onSubmit, onCancel, isEditing }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    price: product?.price || 0,
    image: product?.image || "",
    images: product?.images || [],
    description: product?.description || "",
    category: product?.category || "",
    sizes: product?.sizes || [],
    colors: product?.colors || [],
    sizeStock: product?.sizeStock || {},
    stockQuantity: product?.stockQuantity || 0,
    lowStockThreshold: product?.lowStockThreshold || 10,
    unlimitedStock: product?.unlimitedStock || false,
    inStock: product?.inStock !== false,
  })
  const [imagePreview, setImagePreview] = useState<string>(() => {
    if (!product?.image) return ""
    // If it's a base64 image, use it directly
    if (product.image.startsWith('data:')) {
      return product.image
    }
    // If it's a filename, construct the API URL
    return `/api/images/${product.image}`
  })
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>(() => {
    if (!product?.images) return []
    return product.images.map(img => {
      if (img.startsWith('data:') || img.startsWith('http')) {
        return img
      }
      return `/api/images/${img}`
    })
  })
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const additionalImagesInputRef = useRef<HTMLInputElement>(null)
  const [newSize, setNewSize] = useState("")
  const [newColor, setNewColor] = useState("")

  const handleInputChange = (field: string, value: string | number | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addSize = () => {
    if (newSize.trim() && !formData.sizes.includes(newSize.trim().toUpperCase())) {
      handleInputChange("sizes", [...formData.sizes, newSize.trim().toUpperCase()])
      setNewSize("")
    }
  }

  const removeSize = (sizeToRemove: string) => {
    handleInputChange("sizes", formData.sizes.filter(size => size !== sizeToRemove))
  }

  const addColor = () => {
    if (newColor.trim() && !formData.colors.includes(newColor.trim())) {
      handleInputChange("colors", [...formData.colors, newColor.trim()])
      setNewColor("")
    }
  }

  const removeColor = (colorToRemove: string) => {
    handleInputChange("colors", formData.colors.filter(color => color !== colorToRemove))
  }

  const handleSizeStockChange = (size: string, stock: number) => {
    const newSizeStock = { ...formData.sizeStock, [size]: stock }
    setFormData(prev => ({
      ...prev,
      sizeStock: newSizeStock,
      stockQuantity: Object.values(newSizeStock).reduce((sum, s) => sum + s, 0)
    }))
  }

  const initializeSizeStock = () => {
    const newSizeStock: { [size: string]: number } = {}
    formData.sizes.forEach(size => {
      newSizeStock[size] = formData.sizeStock[size] || 0
    })
    setFormData(prev => ({
      ...prev,
      sizeStock: newSizeStock,
      stockQuantity: Object.values(newSizeStock).reduce((sum, s) => sum + s, 0)
    }))
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    
    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('image', file)

      // Upload file to our API
      const response = await fetch('/api/admin/products/upload-image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const result = await response.json()
      
      // Use the imageUrl for both preview and storage
      setImagePreview(result.imageUrl)
      setFormData(prev => ({
        ...prev,
        image: result.filename // Store just the filename in JSON
      }))
      
      console.log('Image uploaded successfully:', result)
    } catch (error) {
      console.error("Error uploading image:", error)
      alert(`Error uploading image: ${error.message}`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleAdditionalImagesUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    const uploadedImages: string[] = []
    const uploadedPreviews: string[] = []
    
    try {
      // Upload each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append('image', file)

        const response = await fetch('/api/admin/products/upload-image', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(`Error uploading ${file.name}: ${error.error || 'Upload failed'}`)
        }

        const result = await response.json()
        uploadedImages.push(result.filename)
        uploadedPreviews.push(result.imageUrl)
      }
      
      // Update form data and previews
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedImages]
      }))
      
      setAdditionalImagePreviews(prev => [...prev, ...uploadedPreviews])
      
      console.log('Additional images uploaded successfully:', uploadedImages)
    } catch (error) {
      console.error("Error uploading additional images:", error)
      alert(`Error uploading images: ${error.message}`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleImageUrl = (url: string) => {
    setImagePreview(url)
    setFormData(prev => ({
      ...prev,
      image: url // For URLs, store the full URL
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.price || !formData.image) {
      alert("Please fill in all fields")
      return
    }

    if (!formData.unlimitedStock && formData.stockQuantity < 0) {
      alert("Stock quantity cannot be negative")
      return
    }

    if (formData.lowStockThreshold < 0) {
      alert("Low stock threshold cannot be negative")
      return
    }

    const productData = {
      ...formData,
      // Ensure inStock is properly set based on stock management
      inStock: formData.unlimitedStock ? formData.inStock : (formData.stockQuantity > 0 && formData.inStock)
    }

    if (isEditing && product) {
      onSubmit({
        ...product,
        ...productData
      })
    } else {
      onSubmit(productData)
    }
  }

  const removeImage = () => {
    setImagePreview("")
    setFormData(prev => ({
      ...prev,
      image: ""
    }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeAdditionalImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
    setAdditionalImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const clearAllAdditionalImages = () => {
    setFormData(prev => ({
      ...prev,
      images: []
    }))
    setAdditionalImagePreviews([])
    if (additionalImagesInputRef.current) {
      additionalImagesInputRef.current.value = ""
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">
          {isEditing ? "Edit Product" : "Add New Product"}
        </h3>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter product name"
              required
            />
          </div>

          <div>
            <Label htmlFor="price">Price (₹)</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange("price", Number(e.target.value))}
              placeholder="Enter price"
              min="0"
              step="1"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter product description"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              placeholder="Enter product category"
            />
          </div>

          <div>
            <Label>Available Sizes</Label>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1 min-h-[32px] p-2 border border-border rounded-md bg-background">
                {formData.sizes.map((size) => (
                  <Badge key={size} variant="secondary" className="flex items-center gap-1">
                    {size}
                    <button
                      type="button"
                      onClick={() => removeSize(size)}
                      className="ml-1 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {formData.sizes.length === 0 && (
                  <span className="text-muted-foreground text-sm">No sizes added</span>
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  placeholder="Enter size (e.g., S, M, L, XL, XXL)"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                  className="flex-1"
                />
                <Button type="button" onClick={addSize} size="sm" disabled={!newSize.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div>
            <Label>Available Colors</Label>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1 min-h-[32px] p-2 border border-border rounded-md bg-background">
                {formData.colors.map((color) => (
                  <Badge key={color} variant="outline" className="flex items-center gap-1">
                    {color}
                    <button
                      type="button"
                      onClick={() => removeColor(color)}
                      className="ml-1 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {formData.colors.length === 0 && (
                  <span className="text-muted-foreground text-sm">No colors added</span>
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  placeholder="Enter color (e.g., Black, White, Navy)"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                  className="flex-1"
                />
                <Button type="button" onClick={addColor} size="sm" disabled={!newColor.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Stock Management Section */}
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Stock Management</Label>
              <div className="flex items-center space-x-2">
                <Infinity className={`h-4 w-4 ${formData.unlimitedStock ? 'text-blue-500' : 'text-gray-400'}`} />
                <Label htmlFor="unlimited-stock" className="text-sm">Unlimited Stock</Label>
                <Switch
                  id="unlimited-stock"
                  checked={formData.unlimitedStock}
                  onCheckedChange={(checked) => handleInputChange("unlimitedStock", checked)}
                />
              </div>
            </div>

            {!formData.unlimitedStock && (
              <>
                {formData.sizes.length > 0 ? (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">Size-Specific Stock</Label>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={initializeSizeStock}
                      >
                        Initialize Stock for All Sizes
                      </Button>
                    </div>
                    <div className="space-y-2 p-3 border border-border rounded-md bg-muted/20">
                      {formData.sizes.map((size) => (
                        <div key={size} className="flex items-center gap-2">
                          <Label className="w-8 text-sm font-medium">{size}:</Label>
                          <Input
                            type="number"
                            value={formData.sizeStock[size] || 0}
                            onChange={(e) => handleSizeStockChange(size, Number(e.target.value))}
                            min="0"
                            step="1"
                            className="flex-1"
                            placeholder="0"
                          />
                          <span className="text-xs text-muted-foreground w-12">units</span>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-border">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium">Total Stock:</span>
                          <span className="font-mono">{formData.stockQuantity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="stock-quantity">Stock Quantity</Label>
                    <Input
                      id="stock-quantity"
                      type="number"
                      value={formData.stockQuantity}
                      onChange={(e) => {
                        const quantity = Number(e.target.value)
                        handleInputChange("stockQuantity", quantity)
                        handleInputChange("inStock", quantity > 0)
                      }}
                      placeholder="Enter stock quantity"
                      min="0"
                      step="1"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="low-stock-threshold">Low Stock Alert Threshold</Label>
                  <Input
                    id="low-stock-threshold"
                    type="number"
                    value={formData.lowStockThreshold}
                    onChange={(e) => handleInputChange("lowStockThreshold", Number(e.target.value))}
                    placeholder="Enter low stock threshold"
                    min="0"
                    step="1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Alert when stock falls to or below this number
                  </p>
                </div>
              </>
            )}

            <div className="flex items-center space-x-2">
              <Switch
                id="in-stock"
                checked={formData.inStock}
                onCheckedChange={(checked) => handleInputChange("inStock", checked)}
                disabled={!formData.unlimitedStock && formData.stockQuantity <= 0}
              />
              <Label htmlFor="in-stock" className="text-sm">
                Available for purchase
              </Label>
            </div>
          </div>

          <div>
            <Label htmlFor="image-url">Image URL</Label>
            <Input
              id="image-url"
              value={formData.image.startsWith('data:') || (!formData.image.startsWith('http') && formData.image.length < 100) ? '' : formData.image}
              onChange={(e) => handleImageUrl(e.target.value)}
              placeholder="Enter image URL or upload file below"
            />
            {formData.image && !formData.image.startsWith('http') && !formData.image.startsWith('data:') && (
              <p className="text-xs text-muted-foreground mt-1">
                Uploaded file: {formData.image}
              </p>
            )}
          </div>

          <div>
            <Label>Upload Main Image</Label>
            <div className="flex items-center gap-2 mt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? "Uploading..." : "Choose Main Image"}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              This will be the primary product image displayed in listings.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Additional Images</Label>
              {formData.images.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearAllAdditionalImages}
                  className="text-destructive hover:text-destructive"
                >
                  Clear All
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => additionalImagesInputRef.current?.click()}
                disabled={isUploading}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? "Uploading..." : "Add More Images"}
              </Button>
              <input
                ref={additionalImagesInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleAdditionalImagesUpload}
                className="hidden"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Upload additional product images. You can select multiple files at once.
            </p>
            
            {/* Additional Images Preview */}
            {additionalImagePreviews.length > 0 && (
              <div className="mt-4">
                <div className="grid grid-cols-2 gap-2">
                  {additionalImagePreviews.map((preview, index) => (
                    <div key={index} className="relative border border-border rounded-lg p-2 bg-muted/50">
                      <img
                        src={preview}
                        alt={`Additional image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={() => removeAdditionalImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <div className="text-xs text-center mt-1 text-muted-foreground">
                        Image {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <Label>Image Preview</Label>
          <div className="relative border border-border rounded-lg p-4 bg-muted/50">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Product preview"
                  className="w-full h-48 object-cover rounded-md"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg?height=192&width=300&text=Invalid Image"
                  }}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="w-full h-48 border-2 border-dashed border-border rounded-md flex items-center justify-center text-muted-foreground">
                No image selected
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" />
          {isEditing ? "Update Product" : "Add Product"}
        </Button>
      </div>
    </form>
  )
}