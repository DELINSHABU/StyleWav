import { AnnouncementBar } from "@/components/site/announcement-bar"
import { Header } from "@/components/site/header"
import { Hero } from "@/components/site/hero"
import { CategoryTiles } from "@/components/site/category-tiles"
import { ProductGrid } from "@/components/site/product-grid"
import { Footer } from "@/components/site/footer"
import { getFeaturedProducts } from "@/lib/products"
import { DynamicProductGrid } from "@/components/site/dynamic-product-grid"

export default async function Page() {
  // Server component: pull mock featured products
  const products = getFeaturedProducts()
  return (
    <main>
      <AnnouncementBar />
      <Header />
      <Hero />
      <section aria-labelledby="categories" className="container mx-auto px-4 py-8 md:py-10">
        <h2 id="categories" className="sr-only">
          Shop by category
        </h2>
        <CategoryTiles />
      </section>
      <section aria-labelledby="featured" className="container mx-auto px-4 pb-12 md:pb-16">
        <div className="flex items-center justify-between mb-4">
          <h2 id="featured" className="text-xl md:text-2xl font-semibold text-pretty">
            Featured Drops
          </h2>
          <a href="#" className="text-sm underline hover:opacity-80">
            View all
          </a>
        </div>
        <DynamicProductGrid fallbackProducts={products} />
      </section>
      <Footer />
    </main>
  )
}
