'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

import { Footer } from '@/components/site/footer'
import { Customer } from '@/lib/database-types'
import { Eye, Search, Filter, RefreshCw, Users, TrendingUp, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [ordersFilter, setOrdersFilter] = useState<string>('all')
  const [stats, setStats] = useState<any>(null)

  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/customers')
      if (response.ok) {
        const result = await response.json()
        setCustomers(result.data)
        setFilteredCustomers(result.data)
        console.log('Admin: Fetched customers from database')
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/customers?stats=true')
      if (response.ok) {
        const result = await response.json()
        setStats(result.data)
        console.log('Admin: Fetched customer statistics')
      }
    } catch (error) {
      console.error('Error fetching customer stats:', error)
    }
  }

  useEffect(() => {
    fetchCustomers()
    fetchStats()
  }, [])

  useEffect(() => {
    let filtered = customers

    // Filter by search term (name, email, phone)
    if (searchTerm) {
      filtered = filtered.filter(customer =>
        `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
      )
    }

    // Filter by active status
    if (activeFilter !== 'all') {
      filtered = filtered.filter(customer =>
        activeFilter === 'active' ? customer.isActive : !customer.isActive
      )
    }

    // Filter by order status
    if (ordersFilter !== 'all') {
      filtered = filtered.filter(customer =>
        ordersFilter === 'has-orders' ? customer.totalOrders > 0 : customer.totalOrders === 0
      )
    }

    setFilteredCustomers(filtered)
  }, [customers, searchTerm, activeFilter, ordersFilter])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getCustomerStatusBadge = (customer: Customer) => {
    if (!customer.isActive) {
      return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
    }

    if (customer.totalOrders === 0) {
      return <Badge className="bg-blue-100 text-blue-800">New Customer</Badge>
    }

    if (customer.totalSpent > 5000) {
      return <Badge className="bg-gold-100 text-gold-800">VIP</Badge>
    }

    return <Badge className="bg-green-100 text-green-800">Active</Badge>
  }

  return (
    <div>
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Customer Management</h1>
            <div className="flex gap-2">
              <Button onClick={fetchCustomers} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button asChild>
                <Link href="/admin" className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Admin Dashboard
                </Link>
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Customers</p>
                      <p className="text-2xl font-bold">{stats.totalCustomers}</p>
                    </div>
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Customers</p>
                      <p className="text-2xl font-bold">{stats.activeCustomers}</p>
                    </div>
                    <div className="h-8 w-8 flex items-center justify-center text-muted-foreground text-xl">✅</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Customers with Orders</p>
                      <p className="text-2xl font-bold">{stats.customersWithOrders}</p>
                    </div>
                    <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Customer Spend</p>
                      <p className="text-2xl font-bold">₹{stats.totalCustomerSpend.toLocaleString()}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Top Customers */}
          {stats && stats.topCustomers.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Top Customers by Spend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.topCustomers.slice(0, 5).map((customer: any, index: number) => (
                    <div key={customer.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-mono w-6">#{index + 1}</span>
                        <span>{customer.name}</span>
                        <span className="text-muted-foreground">({customer.email})</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span>{customer.totalOrders} orders</span>
                        <span className="font-semibold">₹{customer.totalSpent.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Search Customers</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Name, email, phone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={activeFilter} onValueChange={setActiveFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Customers</SelectItem>
                      <SelectItem value="active">Active Only</SelectItem>
                      <SelectItem value="inactive">Inactive Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Orders</Label>
                  <Select value={ordersFilter} onValueChange={setOrdersFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Customers</SelectItem>
                      <SelectItem value="has-orders">Has Orders</SelectItem>
                      <SelectItem value="no-orders">No Orders</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Actions</Label>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSearchTerm('')
                      setActiveFilter('all')
                      setOrdersFilter('all')
                    }}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customers List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Customers ({filteredCustomers.length})
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading customers from database...</p>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No customers found</p>
              </CardContent>
            </Card>
          ) : (
            filteredCustomers.map((customer) => (
              <Card key={customer.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {customer.firstName} {customer.lastName}
                      </h3>
                      <p className="text-sm text-muted-foreground">{customer.email}</p>
                      <p className="text-sm text-muted-foreground">{customer.phone}</p>
                    </div>
                    <div className="flex gap-2">
                      {getCustomerStatusBadge(customer)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium">Member Since</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(customer.dateJoined)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium">Total Orders</p>
                      <p className="text-lg font-semibold">{customer.totalOrders}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium">Total Spent</p>
                      <p className="text-lg font-semibold">₹{customer.totalSpent.toLocaleString()}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium">Last Active</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(customer.lastActive)}
                      </p>
                    </div>
                  </div>

                  {customer.wishlist.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">
                        Wishlist ({customer.wishlist.length} items)
                      </p>
                      <div className="text-sm text-muted-foreground">
                        {customer.wishlist.slice(0, 3).map(item => item.name).join(', ')}
                        {customer.wishlist.length > 3 && ` + ${customer.wishlist.length - 3} more`}
                      </div>
                    </div>
                  )}

                  {customer.cart.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">
                        Current Cart ({customer.cart.length} items)
                      </p>
                      <div className="text-sm text-muted-foreground">
                        {customer.cart.slice(0, 3).map(item => `${item.name} (${item.quantity})`).join(', ')}
                        {customer.cart.length > 3 && ` + ${customer.cart.length - 3} more`}
                      </div>
                    </div>
                  )}

                  {customer.defaultShippingAddress && (
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Default Address</p>
                      <div className="text-sm text-muted-foreground">
                        {customer.defaultShippingAddress.address}, {customer.defaultShippingAddress.city}, {customer.defaultShippingAddress.state} {customer.defaultShippingAddress.zipCode}
                      </div>
                    </div>
                  )}

                  <Separator className="my-4" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>📧 Email Marketing: {customer.emailMarketing ? 'Yes' : 'No'}</span>
                      <span>📱 SMS Marketing: {customer.smsMarketing ? 'Yes' : 'No'}</span>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Orders
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Navigate to customer orders
                          window.open(`/admin/orders?customerId=${customer.id}`, '_blank')
                        }}
                      >
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Orders History
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
