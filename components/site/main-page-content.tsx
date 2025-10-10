"use client"

import { useState, useEffect } from "react"
import { Product } from "@/lib/products"
import { CategoryAwareProductSection } from "./category-aware-product-section"

interface MainPageContentProps {
  products: Product[]
}

export function MainPageContent({ products }: MainPageContentProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Listen to custom events from category tiles
  useEffect(() => {
    const handleCategorySelect = (event: CustomEvent<string>) => {
      setSelectedCategory(event.detail)
    }

    const handleCategoryReset = () => {
      setSelectedCategory(null)
    }

    window.addEventListener('category-selected', handleCategorySelect as EventListener)
    window.addEventListener('category-reset', handleCategoryReset)

    return () => {
      window.removeEventListener('category-selected', handleCategorySelect as EventListener)
      window.removeEventListener('category-reset', handleCategoryReset)
    }
  }, [])

  return (
    <>
      <CategoryAwareProductSection 
        fallbackProducts={products}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
    </>
  )
}