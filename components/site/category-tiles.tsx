"use client"

import Link from "next/link"

const categories = [
  { slug: "/products?category=oversized-tees", title: "Oversized Tees", query: "oversized+tshirt", category: "Oversized Tees" },
  { slug: "/products?category=graphic-tees", title: "Graphic Tees", query: "graphic+tee", category: "Graphic Tees" },
  { slug: "/products?category=co-ords", title: "Co-ords", query: "co-ords+set", category: "Co-ords" },
  { slug: "/products?category=new-arrivals", title: "New Arrivals", query: "new+arrivals", category: "New Arrivals" },
]

interface CategoryTilesProps {
  onCategoryClick?: (category: string) => void
  enableInlineFiltering?: boolean
}

export function CategoryTiles({ onCategoryClick, enableInlineFiltering = true }: CategoryTilesProps = {}) {
  const handleCategoryClick = (category: typeof categories[0], e: React.MouseEvent) => {
    // If we're on the main page, prevent navigation and trigger inline filtering
    if (enableInlineFiltering && window.location.pathname === '/') {
      e.preventDefault()
      if (onCategoryClick) {
        onCategoryClick(category.category)
      } else {
        // Dispatch custom event for category selection
        window.dispatchEvent(new CustomEvent('category-selected', { detail: category.category }))
      }
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
