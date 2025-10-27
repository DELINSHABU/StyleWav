"use client"

import { useState, useEffect } from "react"
import { ProductManager } from "@/components/admin/product-manager"
import { AdminStats } from "@/components/admin/admin-stats"
import { AdminAuth } from "@/components/admin/admin-auth"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminOrders } from "@/components/admin/admin-orders"
import { AdminCoins } from "@/components/admin/admin-coins"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { MediaLibrary } from "@/components/admin/media-library"
import { AdminSettings } from "@/components/admin/admin-settings"
import { AdminAbout } from "@/components/admin/admin-about"
import { AdminCareers } from "@/components/admin/admin-careers"
import { AdminOffers } from "@/components/admin/admin-offers"
import { ThemeToggle } from "@/components/theme-toggle"
import { Product } from "@/lib/products"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

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
              <p className="text-muted-foreground">Manage your StyleWav store with interactive analytics</p>
            </div>
            <AdminStats products={products} />
            <AdminDashboard products={products} />
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
      case 'coins':
        return <AdminCoins />
      case 'offers':
        return <AdminOffers />
      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Notification Manager</h1>
                <p className="text-muted-foreground">Send offers, promotions, and updates to customers</p>
              </div>
              <div className="flex gap-2">
                <a href="/admin/notifications" className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                  Full Notification Manager
                </a>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-6 border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">🔔 Send Notifications</h3>
                <p className="text-muted-foreground mb-4">Create and send notifications to customers about offers and updates.</p>
                <a href="/admin/notifications" className="text-primary hover:underline">Send Notifications →</a>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">🎯 Broadcast Messages</h3>
                <p className="text-muted-foreground mb-4">Send bulk notifications to all customers at once.</p>
                <a href="/admin/notifications" className="text-primary hover:underline">Broadcast →</a>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">🏷️ Quick Templates</h3>
                <p className="text-muted-foreground mb-4">Use pre-made templates for flash sales, promotions, and more.</p>
                <a href="/admin/notifications" className="text-primary hover:underline">View Templates →</a>
              </div>
            </div>
          </div>
        )
      case 'media':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Media Library</h1>
              <p className="text-muted-foreground">Manage banner and product images</p>
            </div>
            <MediaLibrary products={products} />
          </div>
        )
      case 'about':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">About Us Management</h1>
              <p className="text-muted-foreground">Edit your about page content</p>
            </div>
            <AdminAbout />
          </div>
        )
      case 'careers':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Careers Management</h1>
              <p className="text-muted-foreground">Manage job postings on your careers page</p>
            </div>
            <AdminCareers />
          </div>
        )
      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground">Configure store settings</p>
            </div>
            <AdminSettings />
          </div>
        )
      default:
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your StyleWav store with interactive analytics</p>
            </div>
            <AdminStats products={products} />
            <AdminDashboard products={products} />
          </div>
        )
    }
  }

  return (
    <div className="flex h-screen">
      <AdminSidebar activeItem={activeSection} onItemClick={setActiveSection} />
      <div className="flex-1 flex flex-col">
        {/* Admin Header */}
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <h2 className="font-semibold text-foreground">StyleWav Admin</h2>
              <span className="text-sm text-muted-foreground">Manage your store</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="outline" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Shop
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </header>
        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          {renderActiveSection()}
        </main>
      </div>
    </div>
  )
}