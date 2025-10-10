'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Order } from '@/lib/database-types'
import { Search, Eye, Edit, Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react'

type OrderStatus = Order['status']

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadOrders()
    loadStats()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchTerm, statusFilter])

  const loadOrders = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/orders')
      const data = await response.json()
      
      if (data.success) {
        setOrders(data.data)
      } else {
        throw new Error(data.error || 'Failed to load orders')
      }
    } catch (error) {
      console.error('Error loading orders:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load orders"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch('/api/orders?stats=true')
      const data = await response.json()
      
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const filterOrders = () => {
    let filtered = orders

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(term) ||
        order.customerEmail.toLowerCase().includes(term) ||
        (order.shippingAddress.firstName + ' ' + order.shippingAddress.lastName).toLowerCase().includes(term)
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus, notes?: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus, notes })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setOrders(orders.map(order => 
          order.id === orderId ? data.data : order
        ))
        toast({
          title: "Status Updated",
          description: `Order ${data.data.orderNumber} status changed to ${newStatus}`
        })
        // Reload stats after status update
        loadStats()
      } else {
        throw new Error(data.error || 'Failed to update order status')
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update order status"
      })
    }
  }

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />
      case 'processing':
        return <Package className="h-4 w-4" />
      case 'shipped':
        return <Truck className="h-4 w-4" />
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />
      case 'cancelled':
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getOrderStatusColor = (status: OrderStatus): string => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders Management</h1>
        <p className="text-muted-foreground">View and manage customer orders</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.statusBreakdown.pending}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.statusBreakdown.processing}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Shipped</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.statusBreakdown.shipped}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹{stats.totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Number</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                      <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <span className="text-sm font-medium">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                      <div className="text-xs text-muted-foreground max-w-xs">
                        {order.items.slice(0, 2).map((item, index) => (
                          <div key={index} className="truncate">
                            {item.name}{item.size ? ` (${item.size})` : ''}
                            {index < Math.min(order.items.length, 2) - 1 && ', '}
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <div className="text-xs text-muted-foreground">+{order.items.length - 2} more...</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">₹{order.total}</TableCell>
                  <TableCell>
                    <Badge className={`${getOrderStatusColor(order.status)} flex items-center gap-1 w-fit`}>
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <OrderDetailsDialog 
                          order={selectedOrder} 
                          onStatusUpdate={handleStatusUpdate}
                        />
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
      
      {/* Full Orders Management Button */}
      <div className="flex justify-center pt-6">
        <Button asChild className="px-8 py-3">
          <a href="/admin/orders" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            View Full Orders Management
          </a>
        </Button>
      </div>
    </div>
  )
}

// Order Details Dialog Component
function OrderDetailsDialog({ 
  order, 
  onStatusUpdate 
}: { 
  order: Order | null
  onStatusUpdate: (orderId: string, status: OrderStatus, notes?: string) => void
}) {
  const [newStatus, setNewStatus] = useState<OrderStatus>('pending')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (order) {
      setNewStatus(order.status)
      setNotes(order.notes || '')
    }
  }, [order])

  if (!order) return null

  const handleStatusSubmit = () => {
    onStatusUpdate(order.id, newStatus, notes)
  }

  return (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Order Details - {order.orderNumber}</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Customer Information */}
        <div>
          <h3 className="font-semibold mb-2">Customer Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Name:</strong> {order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
              <p><strong>Email:</strong> {order.customerEmail}</p>
            </div>
            <div>
              <p><strong>Address:</strong></p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <h3 className="font-semibold mb-2">Order Items</h3>
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div key={`${item.id}-${item.size || 'no-size'}-${index}`} className="flex items-center gap-3 p-2 bg-muted rounded">
                <img 
                  src={item.image || "/placeholder.svg"} 
                  alt={item.name}
                  className="w-12 h-12 rounded object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  {item.size && (
                    <p className="text-xs text-muted-foreground font-medium">Size: {item.size}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Qty: {item.quantity} × ₹{item.price} = ₹{item.quantity * item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <h3 className="font-semibold mb-2">Order Summary</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>{order.shipping === 0 ? 'Free' : `₹${order.shipping}`}</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-1">
              <span>Total:</span>
              <span>₹{order.total}</span>
            </div>
          </div>
        </div>

        {/* Status Management */}
        <div className="space-y-4">
          <h3 className="font-semibold">Update Order Status</h3>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={newStatus} onValueChange={(value: OrderStatus) => setNewStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this order..."
              />
            </div>
            
            <Button onClick={handleStatusSubmit} className="w-full">
              Update Status
            </Button>
          </div>
        </div>

        {/* Order Timeline */}
        <div>
          <h3 className="font-semibold mb-2">Order Timeline</h3>
          <div className="text-sm text-muted-foreground">
            <p><strong>Created:</strong> {new Date(order.orderDate).toLocaleString()}</p>
            <p><strong>Last Updated:</strong> {new Date(order.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </DialogContent>
  )
}