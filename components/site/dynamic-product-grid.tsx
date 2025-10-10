"use client"

import { useState, useEffect } from "react"
import { Product, getAdminProducts } from "@/lib/products"
import { ProductGrid } from "./product-grid"

interface DynamicProductGridProps {
  fallbackProducts: Product[]
  maxItems?: number
}

export function DynamicProductGrid({ fallbackProducts, maxItems = 8 }: DynamicProductGridProps) {
  const [products, setProducts] = useState(fallbackProducts)
  const [isLoading, setIsLoading] = useState(false)

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/products', {
        // Add cache-busting to ensure fresh data
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      if (response.ok) {
        const data = await response.json()
        console.log('Fetched fresh product data from API')
        setProducts(data.slice(0, maxItems))
      }
    } catch (error) {
      console.warn('Could not load products from API, using fallback:', error)
      // Fallback to localStorage products
      const fallbackData = getAdminProducts()
      setProducts(fallbackData.slice(0, maxItems))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [maxItems])

  // Refresh products when the window gains focus (e.g., after returning from checkout)
  useEffect(() => {
    const handleFocus = () => {
      console.log('Window focused, refreshing product grid...')
      fetchProducts()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [maxItems])

  return <ProductGrid products={products} />
}
