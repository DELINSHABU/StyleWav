import { NextResponse } from 'next/server'
import { readProductsFromFile, initializeProductsFile } from '@/lib/database'
import { getAllProducts } from '@/lib/products'

// GET - Read all products (public route)
export async function GET() {
  try {
    await initializeProductsFile()
    let products = await readProductsFromFile()
    
    // If no products in JSON file, use default products
    if (products.length === 0) {
      products = getAllProducts()
    }
    
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error reading products:', error)
    // Fallback to default products
    const products = getAllProducts()
    return NextResponse.json(products)
  }
}