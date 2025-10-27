"use client"

import { useState, useEffect, useMemo } from "react"
import { Product, getAdminProducts } from "@/lib/products"
import { ProductGrid } from "./product-grid"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
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
    <section aria-labelledby="featured" className="container mx-auto px-4 py-16 md:py-24">
      <motion.div 
        className="text-center mb-12 md:mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2 
          id="featured" 
          className="text-3xl md:text-5xl font-bold text-pretty mb-4 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {sectionTitle}
        </motion.h2>
        <motion.p 
          className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Discover our latest collection of premium streetwear designed for comfort and style
        </motion.p>
        <motion.div 
          className="flex items-center justify-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {selectedCategory && (
            <button 
              onClick={() => setSelectedCategory(null)}
              className="text-sm text-muted-foreground underline hover:text-primary transition-colors duration-300"
            >
              Show all products
            </button>
          )}
          <Link href="/products" className="text-sm underline hover:text-primary transition-colors duration-300 font-medium">
            View all products →
          </Link>
        </motion.div>
      </motion.div>

      {/* Category Filter Pills */}
      <motion.div 
        className="flex flex-wrap justify-center gap-4 mb-12 md:mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <motion.button
          onClick={() => setSelectedCategory(null)}
          className={`px-6 py-3 text-sm font-medium rounded-full border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg relative overflow-hidden group ${
            !selectedCategory
              ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-105'
              : 'bg-background/80 backdrop-blur-sm text-foreground border-border hover:border-primary hover:bg-primary/5'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <span className="relative z-10">All Products</span>
          {!selectedCategory && (
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.button>
        {Object.keys(categoryMapping).map((category, index) => (
          <motion.button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-3 text-sm font-medium rounded-full border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg relative overflow-hidden group ${
              selectedCategory === category
                ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-105'
                : 'bg-background/80 backdrop-blur-sm text-foreground border-border hover:border-primary hover:bg-primary/5'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <span className="relative z-10">{category}</span>
            {selectedCategory === category && (
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* Product Count */}
      {selectedCategory && (
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-full text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{displayedProducts.length}</span>
            of {products.filter(p => p.category === selectedCategory).length} products in {selectedCategory}
          </div>
        </motion.div>
      )}

      {/* Product Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: maxItems }).map((_, i) => (
            <motion.div
              key={i}
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Skeleton className="aspect-square w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            </motion.div>
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