"use client"

import { useState, useEffect, useMemo } from "react"
import { Product, getAdminProducts } from "@/lib/products"
import { ProductGrid } from "./product-grid"
import Link from "next/link"

interface CategoryAwareProductSectionProps {
  fallbackProducts: Product[]
  maxItems?: number
  selectedCategory?: string | null
  onCategoryChange?: (category: string | null) => void
}

export function CategoryAwareProductSection({ 
  fallbackProducts, 
  maxItems = 8, 
  selectedCategory: externalSelectedCategory,
  onCategoryChange 
}: CategoryAwareProductSectionProps) {
  const [products, setProducts] = useState(fallbackProducts)
  const [isLoading, setIsLoading] = useState(false)
  const [internalSelectedCategory, setInternalSelectedCategory] = useState<string | null>(null)
  
  // Use external category if provided, otherwise use internal state
  const selectedCategory = externalSelectedCategory !== undefined ? externalSelectedCategory : internalSelectedCategory
  const setSelectedCategory = onCategoryChange || setInternalSelectedCategory

  // Map categories to display names
  const categoryMapping: { [key: string]: string } = {
    'Oversized Tees': 'Oversized Tees',
    'Graphic Tees': 'Graphic Tees', 
    'Co-ords': 'Co-ords',
    'New Arrivals': 'New Arrivals'
  }

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/products', {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.warn('Could not load products from API, using fallback:', error)
      const fallbackData = getAdminProducts()
      setProducts(fallbackData)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Filter products based on selected category
  const displayedProducts = useMemo(() => {
    let filtered = products
    
    if (selectedCategory) {
      filtered = products.filter(product => product.category === selectedCategory)
    }
    
    return filtered.slice(0, maxItems)
  }, [products, selectedCategory, maxItems])

  // Determine the section title
  const sectionTitle = selectedCategory || "Featured Drops"

  // Only use hash change handling if no external control is provided
  useEffect(() => {
    if (externalSelectedCategory === undefined && !onCategoryChange) {
      const handleHashChange = () => {
        const hash = window.location.hash.slice(1)
        if (hash && categoryMapping[hash]) {
          setInternalSelectedCategory(hash)
        } else {
          setInternalSelectedCategory(null)
        }
      }

      window.addEventListener('hashchange', handleHashChange)
      handleHashChange() // Check on initial load

      return () => window.removeEventListener('hashchange', handleHashChange)
    }
  }, [externalSelectedCategory, onCategoryChange])

  return (
    <section aria-labelledby="featured" className="container mx-auto px-4 pb-12 md:pb-16">
      <div className="flex items-center justify-between mb-4">
        <h2 id="featured" className="text-xl md:text-2xl font-semibold text-pretty">
          {sectionTitle}
        </h2>
        <div className="flex items-center gap-4">
          {selectedCategory && (
            <button 
              onClick={() => setSelectedCategory(null)}
              className="text-sm text-muted-foreground underline hover:opacity-80"
            >
              Show all
            </button>
          )}
          <Link href="/products" className="text-sm underline hover:opacity-80">
            View all
          </Link>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
            !selectedCategory
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-background text-foreground border-border hover:border-primary'
          }`}
        >
          All
        </button>
        {Object.keys(categoryMapping).map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
              selectedCategory === category
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-foreground border-border hover:border-primary'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Product Count */}
      {selectedCategory && (
        <div className="text-sm text-muted-foreground mb-4">
          Showing {displayedProducts.length} of {products.filter(p => p.category === selectedCategory).length} products in {selectedCategory}
        </div>
      )}

      {/* Product Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: maxItems }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-muted rounded-lg mb-3"></div>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : displayedProducts.length > 0 ? (
        <ProductGrid products={displayedProducts} />
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            No products found{selectedCategory && ` in ${selectedCategory}`}.
          </p>
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-sm underline hover:opacity-80"
          >
            View all products
          </button>
        </div>
      )}
    </section>
  )
}