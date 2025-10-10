import { NextRequest, NextResponse } from 'next/server'
import { readProductsFromFile, writeProductsToFile, initializeProductsFile } from '@/lib/database'
import { Product } from '@/lib/products'

// GET - Read all products
export async function GET() {
  try {
    await initializeProductsFile()
    const products = await readProductsFromFile()
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error reading products:', error)
    return NextResponse.json(
      { error: 'Failed to read products' },
      { status: 500 }
    )
  }
}

// POST - Add new product
export async function POST(request: NextRequest) {
  try {
    const newProduct = await request.json()
    
    // Validate required fields
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      return NextResponse.json(
        { error: 'Missing required fields: name, price, image' },
        { status: 400 }
      )
    }

    // Read existing products
    const products = await readProductsFromFile()
    
    // Generate ID
    const id = `sw-${String(Date.now()).slice(-6)}`
    
    // Create product with ID and all fields
    const productToAdd: Product = {
      id,
      name: newProduct.name,
      price: Number(newProduct.price),
      image: newProduct.image,
      description: newProduct.description || undefined,
      category: newProduct.category || undefined,
      images: newProduct.images || undefined,
      sizes: newProduct.sizes || undefined,
      colors: newProduct.colors || undefined,
      sizeStock: newProduct.sizeStock || undefined,
      inStock: newProduct.inStock !== false,
      rating: newProduct.rating || undefined,
      reviews: newProduct.reviews || undefined,
      stockQuantity: newProduct.stockQuantity || undefined,
      lowStockThreshold: newProduct.lowStockThreshold || undefined,
      unlimitedStock: newProduct.unlimitedStock || false,
    }
    
    // Add to products array
    products.push(productToAdd)
    
    // Save to file
    await writeProductsToFile(products)
    
    return NextResponse.json(productToAdd, { status: 201 })
  } catch (error) {
    console.error('Error adding product:', error)
    return NextResponse.json(
      { error: 'Failed to add product' },
      { status: 500 }
    )
  }
}

// PUT - Update existing product
export async function PUT(request: NextRequest) {
  try {
    const updatedProduct = await request.json()
    
    if (!updatedProduct.id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Read existing products
    const products = await readProductsFromFile()
    
    // Find product index
    const productIndex = products.findIndex(p => p.id === updatedProduct.id)
    
    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    // Update product
    products[productIndex] = {
      ...products[productIndex],
      ...updatedProduct,
      id: products[productIndex].id, // Ensure ID doesn't change
    }
    
    // Save to file
    await writeProductsToFile(products)
    
    return NextResponse.json(products[productIndex])
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE - Delete product
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Read existing products
    const products = await readProductsFromFile()
    
    // Find product index
    const productIndex = products.findIndex(p => p.id === id)
    
    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    // Remove product
    const deletedProduct = products.splice(productIndex, 1)[0]
    
    // Save to file
    await writeProductsToFile(products)
    
    return NextResponse.json({ message: 'Product deleted', product: deletedProduct })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}