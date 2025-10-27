'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { Product } from '@/lib/products';

interface ProductSuggestionsProps {
  currentProductId: string;
  currentCategory?: string;
}

export default function ProductSuggestions({ currentProductId, currentCategory }: ProductSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const products = await response.json();
          
          // Filter products: in stock, not current product
          let filtered = products.filter((p: Product) => 
            p.id !== currentProductId && 
            p.inStock && 
            p.stockQuantity > 0
          );

          // Prioritize same category
          if (currentCategory) {
            const sameCategory = filtered.filter((p: Product) => p.category === currentCategory);
            const otherCategory = filtered.filter((p: Product) => p.category !== currentCategory);
            filtered = [...sameCategory, ...otherCategory];
          }

          // Shuffle and take first 4
          const shuffled = filtered.sort(() => 0.5 - Math.random());
          setSuggestions(shuffled.slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [currentProductId, currentCategory]);

  if (loading) {
    return (
      <Card className="sticky top-4">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-3/4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <Card className="sticky top-4">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center justify-between">
          You May Also Like
          <Badge variant="secondary" className="text-xs">In Stock</Badge>
        </h3>

        <div className="space-y-4">
          {suggestions.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link href={`/products/${product.id}`}>
                <div className="group flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="relative w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={
                        product.image
                          ? (product.image.startsWith('data:') || product.image.startsWith('http')
                            ? product.image
                            : `/api/images/${product.image}`)
                          : '/placeholder.svg'
                      }
                      alt={product.name}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {product.category === 'New Arrivals' && (
                      <Badge className="absolute top-1 left-1 text-xs py-0 px-1">
                        New
                      </Badge>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors mb-1">
                      {product.name}
                    </h4>
                    
                    <div className="flex items-center gap-1 mb-1">
                      {product.rating && (
                        <>
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-muted-foreground">
                            {product.rating}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold">₹{product.price.toLocaleString()}</p>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <Button 
          asChild 
          variant="outline" 
          className="w-full mt-4"
        >
          <Link href="/products">
            View All Products
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
