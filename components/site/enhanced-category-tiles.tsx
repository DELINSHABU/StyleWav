"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

const categories = [
  { 
    slug: "/products?category=oversized-tees", 
    title: "Oversized Tees", 
    query: "oversized+tshirt",
    category: "Oversized Tees"
  },
  { 
    slug: "/products?category=graphic-tees", 
    title: "Graphic Tees", 
    query: "graphic+tee",
    category: "Graphic Tees" 
  },
  { 
    slug: "/products?category=co-ords", 
    title: "Co-ords", 
    query: "co-ords+set",
    category: "Co-ords"
  },
  { 
    slug: "/products?category=new-arrivals", 
    title: "New Arrivals", 
    query: "new+arrivals",
    category: "New Arrivals"
  },
]

interface EnhancedCategoryTilesProps {
  onCategorySelect?: (category: string) => void
  showInlineFiltering?: boolean
}

export function EnhancedCategoryTiles({ 
  onCategorySelect, 
  showInlineFiltering = true 
}: EnhancedCategoryTilesProps = {}) {
  const router = useRouter()

  const handleCategoryClick = (category: typeof categories[0], e: React.MouseEvent) => {
    if (showInlineFiltering && onCategorySelect) {
      // Prevent navigation and use inline filtering
      e.preventDefault()
      onCategorySelect(category.category)
      // Update URL hash for browser back/forward support
      window.history.pushState(null, '', `#${category.category}`)
    }
    // Otherwise, let the Link handle navigation normally
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {categories.map((c) => (
        <Link 
          key={c.title} 
          href={c.slug} 
          className="group"
          onClick={(e) => handleCategoryClick(c, e)}
        >
          <div className="aspect-[4/5] w-full overflow-hidden rounded-lg border border-border">
            <img
              src={`/.jpg?height=560&width=420&query=${encodeURIComponent(c.query)}`}
              alt={`${c.title} category`}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
          <p className="mt-2 text-sm font-medium">{c.title}</p>
        </Link>
      ))}
    </div>
  )
}