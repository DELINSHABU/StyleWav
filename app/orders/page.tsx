'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/site/header'
import { Footer } from '@/components/site/footer'
import { Order } from '@/lib/database-types'
import { useAuth } from '@/lib/auth-context'
import { AuthModal } from '@/components/auth/auth-modal'
import { Package, Search, RefreshCw, ArrowLeft, Eye, Download, User } from 'lucide-react'
import Link from 'next/link'

export default function YourOrdersPage() {
  const { currentUser, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [customerEmail, setCustomerEmail] = useState('')
  const [searchEmail, setSearchEmail] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [showManualSearch, setShowManualSearch] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Auto-fetch orders for authenticated users
  useEffect(() => {
    if (!authLoading && currentUser?.email) {
      fetchOrdersByEmail(currentUser.email)
    }
  }, [currentUser, authLoading])

  const fetchOrdersByEmail = async (email: string) => {
    if (!email.trim()) return
    
    setLoading(true)
    setHasSearched(true)
    try {
      const encodedEmail = encodeURIComponent(email.trim())
      const response = await fetch(`/api/orders/customer/${encodedEmail}`)
      if (response.ok) {
        const result = await response.json()
        setOrders(result.data)
        setCustomerEmail(email.trim())
        console.log(`Customer: Fetched ${result.data.length} orders for ${email}`)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchOrdersByEmail(searchEmail)
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-purple-100 text-purple-800'
      case 'shipped': return 'bg-orange-100 text-orange-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'paid': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'refunded': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusMessage = (order: Order) => {
    switch (order.status) {
      case 'pending': return '⏳ Your order is being reviewed'
      case 'confirmed': return '✅ Your order has been confirmed'
      case 'processing': return '📦 Your order is being prepared'
      case 'shipped': return '🚚 Your order has been shipped'
      case 'delivered': return '🎉 Your order has been delivered'
      case 'cancelled': return '❌ Your order has been cancelled'
      default: return 'Order status unknown'
    }
  }

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading your account...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Your Orders</h1>
              <p className="text-muted-foreground mt-2">
                {currentUser ? (
                  <>Welcome back, {currentUser.displayName || currentUser.email}! Track your StyleWav orders below.</>
                ) : (
                  "Track and manage your StyleWav orders"
                )}
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
          </div>

          {/* Email Search Form - Show for non-authenticated users or manual search */}
          {!currentUser && !customerEmail && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl">Find Your Orders</CardTitle>
                <p className="text-muted-foreground">
                  Enter your email address to view your order history, or{' '}
                  <button 
                    onClick={() => setShowAuthModal(true)}
                    className="text-primary hover:underline"
                  >
                    log in
                  </button>{' '}
                  to view your orders automatically.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearchSubmit} className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter the email used for your orders"
                        value={searchEmail}
                        onChange={(e) => setSearchEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Searching Orders...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Find My Orders
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Manual search option for authenticated users */}
          {currentUser && !showManualSearch && !loading && orders.length === 0 && hasSearched && (
            <Card className="mb-8">
              <CardContent className="p-6 text-center">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Orders Found</h3>
                <p className="text-muted-foreground mb-4">
                  We couldn't find any orders for your account ({currentUser.email}).
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  If you placed orders using a different email address, you can search manually:
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setShowManualSearch(true)}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search with Different Email
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Manual search form for authenticated users */}
          {currentUser && showManualSearch && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl">Search with Different Email</CardTitle>
                <p className="text-muted-foreground">
                  Enter a different email address to search for orders.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearchSubmit} className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Label htmlFor="manual-email">Email Address</Label>
                      <Input
                        id="manual-email"
                        type="email"
                        placeholder="Enter email address"
                        value={searchEmail}
                        onChange={(e) => setSearchEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={loading} className="flex-1">
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          Search Orders
                        </>
                      )}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setShowManualSearch(false)
                        setSearchEmail('')
                        if (currentUser?.email) {
                          fetchOrdersByEmail(currentUser.email)
                        }
                      }}
                    >
                      Back to My Orders
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Orders Display */}
          {customerEmail && (
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {currentUser?.email === customerEmail ? 'Your orders' : 'Showing orders for'}
                  </p>
                  <p className="font-medium">
                    {currentUser?.email === customerEmail ? (
                      <span className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {currentUser.displayName || customerEmail}
                      </span>
                    ) : (
                      customerEmail
                    )}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => fetchOrdersByEmail(customerEmail)}
                    disabled={loading}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  {!currentUser && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setCustomerEmail('')
                        setSearchEmail('')
                        setOrders([])
                        setHasSearched(false)
                      }}
                    >
                      Change Email
                    </Button>
                  )}
                  {currentUser && currentUser.email !== customerEmail && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setShowManualSearch(false)
                        setSearchEmail('')
                        if (currentUser.email) {
                          fetchOrdersByEmail(currentUser.email)
                        }
                      }}
                    >
                      Back to My Orders
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Orders List */}
          {hasSearched && (
            <div className="space-y-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Loading your orders from database...</p>
                </div>
              ) : orders.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Orders Found</h3>
                    <p className="text-muted-foreground mb-6">
                      {customerEmail 
                        ? `We couldn't find any orders for ${customerEmail}. Make sure you're using the correct email address.`
                        : "You haven't placed any orders yet."
                      }
                    </p>
                    <Button asChild>
                      <Link href="/">Start Shopping</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                      {orders.length} Order{orders.length > 1 ? 's' : ''} Found
                    </h2>
                  </div>

                  {orders.map((order) => (
                    <Card key={order.id}>
                      <CardContent className="p-6">
                        {/* Order Header */}
                        <div className="flex items-start justify-between mb-6">
                          <div>
                            <h3 className="font-semibold text-xl">{order.orderNumber}</h3>
                            <p className="text-muted-foreground">
                              Placed on {formatDate(order.orderDate)}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={getStatusBadgeColor(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                            <Badge className={getPaymentBadgeColor(order.paymentStatus)}>
                              {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                            </Badge>
                          </div>
                        </div>

                        {/* Status Message */}
                        <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                          <p className="text-sm font-medium">{getStatusMessage(order)}</p>
                          {order.status === 'shipped' && order.trackingNumber && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Tracking Number: <span className="font-mono">{order.trackingNumber}</span>
                            </p>
                          )}
                        </div>

                        {/* Order Items */}
                        <div className="mb-6">
                          <h4 className="font-medium mb-4">Items Ordered ({order.items.length})</h4>
                          <div className="space-y-4">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                                  {item.image ? (
                                    <img 
                                      src={item.image} 
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <Package className="h-8 w-8 text-muted-foreground" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Quantity: {item.quantity} × ₹{item.price}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold">₹{item.price * item.quantity}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <h4 className="font-medium mb-2">Shipping Address</h4>
                            <div className="text-sm text-muted-foreground">
                              <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                              <p>{order.shippingAddress.address}</p>
                              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Order Total</h4>
                            <div className="text-sm space-y-1">
                              <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>₹{order.subtotal}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>{order.shipping === 0 ? 'Free' : `₹${order.shipping}`}</span>
                              </div>
                              <Separator className="my-2" />
                              <div className="flex justify-between font-semibold">
                                <span>Total</span>
                                <span>₹{order.total}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <Separator className="my-4" />

                        {/* Order Actions */}
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            Last updated: {formatDate(order.updatedAt)}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            {order.status === 'delivered' && (
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Download Invoice
                              </Button>
                            )}
                            {(order.status === 'confirmed' || order.status === 'processing') && (
                              <Button variant="outline" size="sm">
                                Cancel Order
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </div>
          )}

          {/* Help Section */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium mb-2">📞 Customer Support</p>
                  <p className="text-muted-foreground">Call us at +91-XXXX-XXXXXX</p>
                  <p className="text-muted-foreground">Mon-Sat, 10 AM - 7 PM</p>
                </div>
                <div>
                  <p className="font-medium mb-2">📧 Email Support</p>
                  <p className="text-muted-foreground">support@stylewave.com</p>
                  <p className="text-muted-foreground">Response within 24 hours</p>
                </div>
                <div>
                  <p className="font-medium mb-2">❓ FAQ</p>
                  <Link href="/faq" className="text-primary hover:underline">
                    Check our FAQ section
                  </Link>
                  <p className="text-muted-foreground">for common questions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        defaultTab="login"
      />
    </div>
  )
}
