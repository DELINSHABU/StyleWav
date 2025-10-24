import { promises as fs } from 'fs'
import path from 'path'
import { Product } from './products'

const DB_PATH = path.join(process.cwd(), 'jsonDatabase')
const PRODUCTS_FILE = path.join(DB_PATH, 'products.json')

// Ensure database directory exists
async function ensureDatabaseExists() {
  try {
    await fs.access(DB_PATH)
  } catch {
    await fs.mkdir(DB_PATH, { recursive: true })
  }
}

// Read products from JSON file
export async function readProductsFromFile(): Promise<Product[]> {
  try {
    await ensureDatabaseExists()
    const data = await fs.readFile(PRODUCTS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.warn('Could not read products file, returning empty array:', error)
    return []
  }
}

// Write products to JSON file
export async function writeProductsToFile(products: Product[]): Promise<void> {
  try {
    await ensureDatabaseExists()
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error writing products to file:', error)
    throw error
  }
}

// Initialize products file if it doesn't exist
export async function initializeProductsFile(): Promise<void> {
  try {
    await fs.access(PRODUCTS_FILE)
    // File exists, don't overwrite it
    return
  } catch {
    // File doesn't exist, create it with default products
    const defaultProducts: Product[] = [
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
        sizeStock: { "S": 10, "M": 25, "L": 45, "XL": 50, "XXL": 20 },
        inStock: true,
        rating: 4.8,
        reviews: 127,
        stockQuantity: 150, // Sum of all size stocks
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
        sizeStock: { "S": 5, "M": 12, "L": 18, "XL": 8 },
        inStock: true,
        rating: 4.6,
        reviews: 89,
        stockQuantity: 43, // Sum of all size stocks
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
        sizeStock: { "S": 2, "M": 3, "L": 2, "XL": 1 },
        inStock: true,
        rating: 4.5,
        reviews: 67,
        stockQuantity: 8, // Sum of all size stocks
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
    
    await writeProductsToFile(defaultProducts)
  }
}