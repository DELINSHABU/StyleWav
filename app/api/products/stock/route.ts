import { NextResponse } from 'next/server'
import { readProductsFromFile, writeProductsToFile, initializeProductsFile } from '@/lib/database'
import { updateStockAfterPurchase } from '@/lib/stock-utils'

// POST - Update product stock quantities
export async function POST(request: Request) {
  try {
    await initializeProductsFile()
    const { items } = await request.json()
    
    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Invalid items data' },
        { status: 400 }
      )
    }
    
    // Read current products from file
    let products = await readProductsFromFile()
    
    let updateCount = 0
    const updateResults = []
    
    // Process each purchased item
    for (const item of items) {
      const productIndex = products.findIndex(p => p.id === item.id)
      
      if (productIndex === -1) {
        console.log(`Product not found: ${item.id}`)
        continue
      }
      
      const product = products[productIndex]
      console.log(`Processing ${product.name}: Current stock ${product.stockQuantity}, Qty purchased: ${item.qty}${item.size ? `, Size: ${item.size}` : ''}`)
      
      // Skip if unlimited stock
      if (product.unlimitedStock) {
        console.log(`${product.name} has unlimited stock, no update needed`)
        updateResults.push({
          id: product.id,
          name: product.name,
          updated: false,
          reason: 'unlimited_stock'
        })
        continue
      }
      
      // Calculate stock updates with size consideration
      const stockUpdates = updateStockAfterPurchase(product, item.qty, item.size)
      
      // Apply updates to product
      products[productIndex] = { ...product, ...stockUpdates }
      updateCount++
      
      updateResults.push({
        id: product.id,
        name: product.name,
        size: item.size || 'N/A',
        updated: true,
        oldStock: product.stockQuantity,
        newStock: stockUpdates.stockQuantity,
        inStock: stockUpdates.inStock,
        sizeStockUpdated: stockUpdates.sizeStock ? 'Yes' : 'No'
      })
      
      if (item.size && stockUpdates.sizeStock) {
        console.log(`Updated ${product.name} (${item.size}): ${product.sizeStock?.[item.size] || 0} -> ${stockUpdates.sizeStock[item.size]}, Total: ${product.stockQuantity} -> ${stockUpdates.stockQuantity}`)
      } else {
        console.log(`Updated ${product.name}: ${product.stockQuantity} -> ${stockUpdates.stockQuantity}, In stock: ${stockUpdates.inStock}`)
      }
    }
    
    // Save updated products to file
    await writeProductsToFile(products)
    
    return NextResponse.json({
      success: true,
      updatedCount: updateCount,
      results: updateResults,
      message: `Stock updated for ${updateCount} products`
    })
    
  } catch (error) {
    console.error('Error updating stock:', error)
    return NextResponse.json(
      { error: 'Failed to update stock' },
      { status: 500 }
    )
  }
}