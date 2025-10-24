"use client"

import Link from "next/link"

type Product = {
  id: string
  name: string
  price: number
  image: string
  description?: string
  category?: string
  rating?: number
  reviews?: number
}

interface SimpleProductCardProps {
  product: Product
}

export function SimpleProductCard({ product }: SimpleProductCardProps) {
  return (
    <Link href={`/products/${product.id}`}>
      <div 
        className="bg-white border-2 border-black rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer min-h-[300px]"
        style={{
          backgroundColor: 'white',
          border: '2px solid #000',
          color: '#000',
          padding: '16px',
          borderRadius: '8px',
          minHeight: '300px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Image */}
        <div 
          className="w-full h-48 bg-gray-200 rounded mb-4 flex items-center justify-center"
          style={{
            backgroundColor: '#e5e7eb',
            height: '192px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px'
          }}
        >
          {product.image ? (
            <img 
              src={product.image.startsWith('data:') || product.image.startsWith('http') 
                ? product.image 
                : `/api/images/${product.image}`} 
              alt={product.name}
              className="w-full h-full object-cover rounded"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <span style={{ color: '#666', fontSize: '14px' }}>No Image</span>
          )}
        </div>

        {/* Category */}
        {product.category && (
          <span 
            className="text-xs text-gray-600 uppercase mb-2"
            style={{ 
              fontSize: '12px', 
              color: '#666', 
              textTransform: 'uppercase',
              marginBottom: '8px',
              display: 'block'
            }}
          >
            {product.category}
          </span>
        )}

        {/* Product Name */}
        <h3 
          className="text-lg font-bold mb-2 text-black"
          style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            color: '#000', 
            marginBottom: '8px',
            lineHeight: '1.2'
          }}
        >
          {product.name}
        </h3>

        {/* Rating */}
        {product.rating && (
          <div 
            className="flex items-center mb-2"
            style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}
          >
            <span style={{ color: '#000', fontSize: '14px' }}>
              ★ {product.rating} ({product.reviews || 0} reviews)
            </span>
          </div>
        )}

        {/* Price */}
        <div 
          className="text-xl font-bold text-black"
          style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            color: '#000',
            marginTop: 'auto'
          }}
        >
          ₹{product.price.toLocaleString()}
        </div>
      </div>
    </Link>
  )
}