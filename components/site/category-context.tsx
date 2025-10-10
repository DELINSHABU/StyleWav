"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

interface CategoryContextType {
  selectedCategory: string | null
  setSelectedCategory: (category: string | null) => void
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined)

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Listen to hash changes for browser back/forward support
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      if (hash) {
        setSelectedCategory(hash)
      } else {
        setSelectedCategory(null)
      }
    }

    // Check initial hash
    handleHashChange()

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Update URL hash when category changes
  const updateSelectedCategory = (category: string | null) => {
    setSelectedCategory(category)
    if (category) {
      window.history.pushState(null, '', `#${category}`)
    } else {
      window.history.pushState(null, '', window.location.pathname)
    }
  }

  return (
    <CategoryContext.Provider value={{ 
      selectedCategory, 
      setSelectedCategory: updateSelectedCategory 
    }}>
      {children}
    </CategoryContext.Provider>
  )
}

export function useCategory() {
  const context = useContext(CategoryContext)
  if (context === undefined) {
    throw new Error('useCategory must be used within a CategoryProvider')
  }
  return context
}