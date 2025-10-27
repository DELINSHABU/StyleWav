'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import type { Product } from '@/lib/products';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';

interface CartProductSuggestionsProps {
  excludeIds?: string[];
}

export default function CartProductSuggestions({ excludeIds = [] }: CartProductSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const products = await response.json();
          
          // Filter products: in stock, not in cart
          let filtered = products.filter((p: Product) => 
            !excludeIds.includes(p.id) && 
            p.inStock && 
            p.stockQuantity > 0
          );

          // Shuffle and take first 8
          const shuffled = filtered.sort(() => 0.5 - Math.random());
          setSuggestions(shuffled.slice(0, 8));
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [excludeIds]);

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.sizes && product.sizes.length > 0) {
      // Redirect to product page if sizes needed
      window.location.href = `/products/${product.id}`;
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="animate-pulse">
              <div className="aspect-square bg-muted"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {suggestions.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
        >
          <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <Link href={`/products/${product.id}`}>
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img
                  src={
                    product.image
                      ? (product.image.startsWith('data:') || product.image.startsWith('http')
                        ? product.image
                        : `/api/images/${product.image}`)
                      : '/placeholder.svg'
                  }
                  alt={product.name}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.category === 'New Arrivals' && (
                    <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0 text-xs">
                      New
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-xs">
                    In Stock
                  </Badge>
                </div>

                {/* Quick Add Button */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button
                    size="sm"
                    className="bg-white text-black hover:bg-white/90"
                    onClick={(e) => handleQuickAdd(product, e)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.sizes && product.sizes.length > 0 ? 'View' : 'Quick Add'}
                  </Button>
                </div>
              </div>
            </Link>

            <CardContent className="p-4">
              <Link href={`/products/${product.id}`}>
                <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors mb-2 min-h-[40px]">
                  {product.name}
                </h3>
              </Link>

              <div className="flex items-center gap-1 mb-2">
                {product.rating && (
                  <>
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-muted-foreground">
                      {product.rating} ({product.reviews || 0})
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-center justify-between">
                <p className="text-lg font-bold">₹{product.price.toLocaleString()}</p>
                {product.category && (
                  <span className="text-xs text-muted-foreground">
                    {product.category}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
