export type Product = {
  id: string
  name: string
  price: number
  image: string
  description?: string
  category?: string
  images?: string[]
  sizes?: string[]
  colors?: string[]
  sizeStock?: { [size: string]: number } // Stock quantity for each size
  inStock?: boolean
  rating?: number
  reviews?: number
  stockQuantity?: number // Total stock (calculated from sizeStock or manual)
  lowStockThreshold?: number
  unlimitedStock?: boolean
}

// Helper function to calculate total stock from size stocks
export function calculateTotalStock(product: Product): number {
  if (product.unlimitedStock) {
    return product.stockQuantity || 0
  }
  
  if (product.sizeStock) {
    return Object.values(product.sizeStock).reduce((total, stock) => total + stock, 0)
  }
  
  return product.stockQuantity || 0
}

// Helper function to check if product is in stock
export function isProductInStock(product: Product): boolean {
  if (product.unlimitedStock) {
    return product.inStock !== false
  }
  
  const totalStock = calculateTotalStock(product)
  return totalStock > 0 && product.inStock !== false
}

const allProducts: Product[] = [
  {
    id: "sw-001",
    name: "Wave Rider Oversized Tee",
    price: 699,
    image: "/oversized-graphic-tee.png",
    description: "Ride the waves of style with this premium oversized graphic tee. Made from 100% cotton with a unique wave-inspired design that embodies the free-spirited lifestyle.",
    category: "Graphic Tees",
    images: ["/oversized-graphic-tee.png", "/oversized-graphic-tee-2.png", "/oversized-graphic-tee-3.png"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Navy", "Black", "White"],
    inStock: true,
    rating: 4.8,
    reviews: 127,
    stockQuantity: 75,
    lowStockThreshold: 10,
    unlimitedStock: false
  },
  {
    id: "sw-002",
    name: "Monochrome Graphic Tee",
    price: 649,
    image: "/monochrome-tee.jpg",
    description: "Clean and minimalist design meets bold statement. This monochrome graphic tee features high-quality printing on soft cotton fabric.",
    category: "Graphic Tees",
    images: ["/monochrome-tee.jpg", "/monochrome-tee-2.jpg"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White"],
    inStock: true,
    rating: 4.6,
    reviews: 89,
    stockQuantity: 32,
    lowStockThreshold: 15,
    unlimitedStock: false
  },
  {
    id: "sw-003",
    name: "Retro Script Tee",
    price: 749,
    image: "/retro-script-tee.jpg",
    description: "Throwback vibes with modern comfort. This retro script tee brings vintage aesthetics to your contemporary wardrobe.",
    category: "Vintage",
    images: ["/retro-script-tee.jpg", "/retro-script-tee-2.jpg", "/retro-script-tee-3.jpg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Cream", "Brown", "Green"],
    inStock: false,
    rating: 4.7,
    reviews: 156,
    stockQuantity: 0,
    lowStockThreshold: 5,
    unlimitedStock: false
  },
  {
    id: "sw-004",
    name: "Core Black Tee",
    price: 599,
    image: "/black-tee-minimal.jpg",
    description: "The essential black tee every wardrobe needs. Premium cotton construction with perfect fit and lasting comfort.",
    category: "Essentials",
    images: ["/black-tee-minimal.jpg", "/black-tee-minimal-2.jpg"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black"],
    inStock: true,
    rating: 4.9,
    reviews: 203,
    stockQuantity: 0,
    lowStockThreshold: 20,
    unlimitedStock: true
  },
  {
    id: "sw-005",
    name: "Neon Print Tee",
    price: 799,
    image: "/neon-print-tee.jpg",
    description: "Electric style meets street fashion. Bold neon prints that glow under UV light, perfect for festivals and night outs.",
    category: "Streetwear",
    images: ["/neon-print-tee.jpg", "/neon-print-tee-2.jpg", "/neon-print-tee-glow.jpg"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Neon Green", "Electric Blue", "Hot Pink"],
    inStock: true,
    rating: 4.5,
    reviews: 67,
    stockQuantity: 8,
    lowStockThreshold: 10,
    unlimitedStock: false
  },
  {
    id: "sw-006",
    name: "Skater Fit Tee",
    price: 699,
    image: "/skater-fit-tee.jpg",
    description: "Loose, comfortable fit inspired by skate culture. Durable construction that can handle your active lifestyle.",
    category: "Streetwear",
    images: ["/skater-fit-tee.jpg", "/skater-fit-tee-2.jpg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Gray", "Black", "Navy"],
    inStock: true,
    rating: 4.4,
    reviews: 78,
    stockQuantity: 150,
    lowStockThreshold: 25,
    unlimitedStock: false
  },
  {
    id: "sw-007",
    name: "Minimal Logo Tee",
    price: 599,
    image: "/minimal-logo-tee.jpg",
    description: "Subtle branding, maximum style. Clean design with small logo placement for those who prefer understated fashion.",
    category: "Essentials",
    images: ["/minimal-logo-tee.jpg", "/minimal-logo-tee-2.jpg"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Gray", "Navy"],
    inStock: true,
    rating: 4.8,
    reviews: 134,
    stockQuantity: 42,
    lowStockThreshold: 50,
    unlimitedStock: false
  },
  {
    id: "sw-008",
    name: "Daily Comfort Tee",
    price: 549,
    image: "/plain-tee-comfort.jpg",
    description: "Your go-to tee for everyday wear. Super soft cotton blend that gets softer with every wash. Perfect for layering or wearing solo.",
    category: "Essentials",
    images: ["/plain-tee-comfort.jpg", "/plain-tee-comfort-2.jpg"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["White", "Gray", "Black", "Navy", "Olive"],
    inStock: true,
    rating: 4.9,
    reviews: 267,
    stockQuantity: 200,
    lowStockThreshold: 30,
    unlimitedStock: false
  },
]

export function getFeaturedProducts(): Product[] {
  // Could filter or slice for featured
  const currentProducts = getAdminProducts() // Use the same data source
  return currentProducts.slice(0, 8)
}

export function getAllProducts(): Product[] {
  return getAdminProducts() // Use the same data source
}

// Admin functions for product management
let products = [...allProducts] // Working copy for admin panel

export function getAdminProducts(): Product[] {
  // In a real app, this would fetch from a database
  const saved = typeof window !== 'undefined' ? localStorage.getItem('stylewave-products') : null
  if (saved) {
    try {
      products = JSON.parse(saved)
    } catch (e) {
      console.error('Error loading products from localStorage:', e)
    }
  }
  return products
}

export function saveProducts(newProducts: Product[]) {
  products = newProducts
  // In a real app, this would save to a database
  if (typeof window !== 'undefined') {
    localStorage.setItem('stylewave-products', JSON.stringify(products))
  }
}

export function addProduct(product: Omit<Product, 'id'>): Product {
  const newProduct: Product = {
    ...product,
    id: `sw-${String(Date.now()).slice(-6)}`,
  }
  products.push(newProduct)
  saveProducts(products)
  return newProduct
}

export function updateProduct(id: string, updates: Partial<Omit<Product, 'id'>>): Product | null {
  const index = products.findIndex(p => p.id === id)
  if (index === -1) return null
  
  products[index] = { ...products[index], ...updates }
  saveProducts(products)
  return products[index]
}

export function deleteProduct(id: string): boolean {
  const index = products.findIndex(p => p.id === id)
  if (index === -1) return false
  
  products.splice(index, 1)
  saveProducts(products)
  return true
}

export function getProductById(id: string): Product | null {
  const currentProducts = getAdminProducts() // Use the same data source
  return currentProducts.find(p => p.id === id) || null
}
