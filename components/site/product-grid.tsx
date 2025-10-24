"use client"

import { motion } from "framer-motion"
import { ProductCard } from "./product-card"

type Product = {
  id: string
  name: string
  price: number
  image: string
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
}

const item = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.98
  },
  show: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
}

export function ProductGrid({ products }: { products: Product[] }) {
  // Create a unique key based on the products to force re-animation when category changes
  const gridKey = products.map(p => p.id).join('-')
  
  return (
    <motion.div 
      key={gridKey} // Force re-mount when products change
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {products.map((p, index) => (
        <motion.div 
          key={`${gridKey}-${p.id}`} // Unique key for each product in each category
          variants={item}
        >
          <ProductCard product={p} index={index} />
        </motion.div>
      ))}
    </motion.div>
  )
}
