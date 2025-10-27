'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
}

export default function ProductCollage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/admin/products');
        if (response.ok) {
          const data = await response.json();
          // Select random 12 products with stock
          const inStockProducts = data.filter((p: Product) => p.image);
          const shuffled = inStockProducts.sort(() => 0.5 - Math.random());
          setProducts(shuffled.slice(0, 12));
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const collageLayout = [
    { col: 'span 2', row: 'span 2', size: 'large' },
    { col: 'span 1', row: 'span 1', size: 'small' },
    { col: 'span 1', row: 'span 2', size: 'medium' },
    { col: 'span 2', row: 'span 1', size: 'wide' },
    { col: 'span 1', row: 'span 1', size: 'small' },
    { col: 'span 1', row: 'span 2', size: 'medium' },
    { col: 'span 2', row: 'span 1', size: 'wide' },
    { col: 'span 1', row: 'span 1', size: 'small' },
    { col: 'span 1', row: 'span 1', size: 'small' },
    { col: 'span 2', row: 'span 2', size: 'large' },
    { col: 'span 1', row: 'span 1', size: 'small' },
    { col: 'span 1', row: 'span 1', size: 'small' }
  ];

  return (
    <section className="relative min-h-screen bg-neutral-950 px-4 py-20 md:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center text-4xl font-bold text-white md:text-6xl"
        >
          Our Collection
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[150px] md:auto-rows-[200px]">
          {products.map((product, index) => {
            const layout = collageLayout[index % collageLayout.length];
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className={`group relative overflow-hidden rounded-lg bg-neutral-900 ${layout.col} ${layout.row}`}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="h-full w-full"
                >
                  <Image
                    src={
                      product.image
                        ? (product.image.startsWith('data:') || product.image.startsWith('http')
                          ? product.image
                          : `/api/images/${product.image}`)
                        : '/placeholder.svg'
                    }
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </motion.div>

                {/* Hover Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col items-center justify-end p-4 md:p-6"
                >
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="text-center"
                  >
                    <h3 className="text-sm md:text-lg font-bold text-white mb-1">
                      {product.name}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-300">
                      {product.category}
                    </p>
                  </motion.div>
                </motion.div>

                {/* Animated Border */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 border-2 border-white rounded-lg pointer-events-none"
                />
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <a
            href="/products"
            className="inline-block bg-white px-8 py-4 text-lg font-semibold text-black transition-all hover:scale-105 hover:shadow-xl"
          >
            Explore Full Collection
          </a>
        </motion.div>
      </div>
    </section>
  );
}
