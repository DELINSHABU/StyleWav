"use client"

import { useState, useEffect } from "react"
import { ProductManager } from "@/components/admin/product-manager"
import { AdminStats } from "@/components/admin/admin-stats"
import { AdminAuth } from "@/components/admin/admin-auth"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminOrders } from "@/components/admin/admin-orders"
import { Product } from "@/lib/products"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('dashboard')
  
  // Check authentication and load products on mount
  useEffect(() => {
    const token = localStorage.getItem("stylewave-admin-token")
    if (token === "authenticated") {
      setIsAuthenticated(true)
    }
    
    // Load products from API
    fetchProducts()
  }, [])
  
  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Update products state (API calls will be handled by components)
  const updateProducts = (newProducts: Product[]) => {
    setProducts(newProducts)
  }
  
  const handleAuthenticated = () => {
    setIsAuthenticated(true)
  }
  
  if (!isAuthenticated) {
    return <AdminAuth onAuthenticated={handleAuthenticated} />
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your StyleWav store</p>
            </div>
            <AdminStats products={products} />
            <ProductManager products={products} setProducts={updateProducts} onRefresh={fetchProducts} />
          </div>
        )
      case 'products':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Products Management</h1>
              <p className="text-muted-foreground">Manage your product inventory</p>
            </div>
            <ProductManager products={products} setProducts={updateProducts} onRefresh={fetchProducts} />
          </div>
        )
      case 'orders':
        return <AdminOrders />
      case 'customers':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Customers Management</h1>
                <p className="text-muted-foreground">Manage customer accounts and data from the database</p>
              </div>
              <div className="flex gap-2">
                <a href="/admin/customers" className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                  Full Customer Management
                </a>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-6 border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">📊 Customer Database</h3>
                <p className="text-muted-foreground mb-4">View all customers with their order history, wishlists, and cart data.</p>
                <a href="/admin/customers" className="text-primary hover:underline">Manage Customers →</a>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">📋 Orders Database</h3>
                <p className="text-muted-foreground mb-4">Complete order management with status updates and tracking.</p>
                <a href="/admin/orders" className="text-primary hover:underline">Manage Orders →</a>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">📦 Products Database</h3>
                <p className="text-muted-foreground mb-4">Real-time inventory management with stock updates.</p>
                <a href="/api/products" className="text-primary hover:underline">View API →</a>
              </div>
            </div>
          </div>
        )
      case 'media':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Media Library</h1>
              <p className="text-muted-foreground">Manage images and media files</p>
            </div>
            <div className="text-center py-16 text-muted-foreground">
              <p>Media library coming soon...</p>
            </div>
          </div>
        )
      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground">Configure store settings</p>
            </div>
            <div className="text-center py-16 text-muted-foreground">
              <p>Settings panel coming soon...</p>
            </div>
          </div>
        )
      default:
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your StyleWav store</p>
            </div>
            <AdminStats products={products} />
            <ProductManager products={products} setProducts={updateProducts} onRefresh={fetchProducts} />
          </div>
        )
    }
  }

  return (
    <div className="flex">
      <AdminSidebar activeItem={activeSection} onItemClick={setActiveSection} />
      <main className="flex-1 p-6">
        {renderActiveSection()}
      </main>
    </div>
  )
}