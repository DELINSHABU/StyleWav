import { AnnouncementBar } from "@/components/site/announcement-bar"
import { Header } from "@/components/site/header"
import { Hero } from "@/components/site/hero"
import { Footer } from "@/components/site/footer"
import { getFeaturedProducts } from "@/lib/products"
import { MainPageContent } from "@/components/site/main-page-content"

export default async function Page() {
  // Server component: pull mock featured products
  const products = getFeaturedProducts()
  return (
    <main>
      <AnnouncementBar />
      <Header />
      <Hero />
      <MainPageContent products={products} />
      <Footer />
    </main>
  )
}
