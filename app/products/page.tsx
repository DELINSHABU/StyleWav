import { AnnouncementBar } from "@/components/site/announcement-bar"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { FilteredProductGrid } from "@/components/site/filtered-product-grid"
import { getAllProducts } from "@/lib/products"

export default async function ProductsPage({
  searchParams
}: {
  searchParams: { category?: string }
}) {
  // Server component: pull all products
  const products = getAllProducts()
  const category = searchParams.category

  // Map category URL params to display names
  const categoryDisplayNames: { [key: string]: string } = {
    'oversized-tees': 'Oversized Tees',
    'graphic-tees': 'Graphic Tees',
    'co-ords': 'Co-ords',
    'new-arrivals': 'New Arrivals'
  }

  const displayTitle = category && categoryDisplayNames[category] 
    ? categoryDisplayNames[category]
    : 'Featured Drops'

  return (
    <main>
      <AnnouncementBar />
      <Header />
      <section className="container mx-auto px-4 py-8 md:py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-pretty">
            {displayTitle}
          </h1>
          <div className="text-sm text-muted-foreground">
            {category && (
              <a href="/" className="underline hover:opacity-80">
                ← Back to Home
              </a>
            )}
          </div>
        </div>
        <FilteredProductGrid 
          fallbackProducts={products} 
          initialCategory={category}
        />
      </section>
      <Footer />
    </main>
  )
}