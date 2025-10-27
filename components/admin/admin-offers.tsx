'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tags, Plus, Edit, Trash2, ToggleLeft, ToggleRight, TrendingUp, Users, DollarSign } from 'lucide-react'
import type { Offer } from '@/lib/database-types'

export function AdminOffers() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null)
  const [stats, setStats] = useState({
    totalOffers: 0,
    activeOffers: 0,
    totalUsage: 0,
    totalDiscount: 0
  })

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'product' as Offer['type'],
    discountType: 'percentage' as 'percentage' | 'fixed' | 'coins',
    discountValue: 0,
    productIds: '',
    paymentMethods: '',
    categories: '',
    minPurchaseAmount: '',
    maxDiscountAmount: '',
    usageLimit: '',
    perCustomerLimit: '',
    startDate: '',
    endDate: '',
    code: '',
    priority: 1,
    isActive: true
  })

  useEffect(() => {
    loadOffers()
  }, [])

  const loadOffers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/offers')
      if (response.ok) {
        const data = await response.json()
        setOffers(data)
        
        // Calculate stats
        const activeCount = data.filter((o: Offer) => o.isActive).length
        const totalUsage = data.reduce((sum: number, o: Offer) => sum + o.usageCount, 0)
        
        setStats({
          totalOffers: data.length,
          activeOffers: activeCount,
          totalUsage: totalUsage,
          totalDiscount: 0 // Can be calculated from usage data
        })
      }
    } catch (error) {
      console.error('Error loading offers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateOffer = async () => {
    try {
      const offerData = {
        ...formData,
        discountValue: Number(formData.discountValue),
        priority: Number(formData.priority),
        productIds: formData.productIds ? formData.productIds.split(',').map(id => id.trim()) : undefined,
        paymentMethods: formData.paymentMethods ? formData.paymentMethods.split(',').map(m => m.trim()) : undefined,
        categories: formData.categories ? formData.categories.split(',').map(c => c.trim()) : undefined,
        minPurchaseAmount: formData.minPurchaseAmount ? Number(formData.minPurchaseAmount) : undefined,
        maxDiscountAmount: formData.maxDiscountAmount ? Number(formData.maxDiscountAmount) : undefined,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : undefined,
        perCustomerLimit: formData.perCustomerLimit ? Number(formData.perCustomerLimit) : undefined,
        code: formData.code || undefined,
        createdBy: 'admin'
      }

      const response = await fetch('/api/admin/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offerData)
      })

      if (response.ok) {
        setIsCreateDialogOpen(false)
        resetForm()
        loadOffers()
      }
    } catch (error) {
      console.error('Error creating offer:', error)
    }
  }

  const handleUpdateOffer = async () => {
    if (!editingOffer) return

    try {
      const offerData = {
        ...formData,
        discountValue: Number(formData.discountValue),
        priority: Number(formData.priority),
        productIds: formData.productIds ? formData.productIds.split(',').map(id => id.trim()) : undefined,
        paymentMethods: formData.paymentMethods ? formData.paymentMethods.split(',').map(m => m.trim()) : undefined,
        categories: formData.categories ? formData.categories.split(',').map(c => c.trim()) : undefined,
        minPurchaseAmount: formData.minPurchaseAmount ? Number(formData.minPurchaseAmount) : undefined,
        maxDiscountAmount: formData.maxDiscountAmount ? Number(formData.maxDiscountAmount) : undefined,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : undefined,
        perCustomerLimit: formData.perCustomerLimit ? Number(formData.perCustomerLimit) : undefined,
        code: formData.code || undefined
      }

      const response = await fetch(`/api/admin/offers/${editingOffer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offerData)
      })

      if (response.ok) {
        setEditingOffer(null)
        resetForm()
        loadOffers()
      }
    } catch (error) {
      console.error('Error updating offer:', error)
    }
  }

  const handleDeleteOffer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) return

    try {
      const response = await fetch(`/api/admin/offers/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        loadOffers()
      }
    } catch (error) {
      console.error('Error deleting offer:', error)
    }
  }

  const handleToggleStatus = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/offers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle' })
      })

      if (response.ok) {
        loadOffers()
      }
    } catch (error) {
      console.error('Error toggling offer status:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'product',
      discountType: 'percentage',
      discountValue: 0,
      productIds: '',
      paymentMethods: '',
      categories: '',
      minPurchaseAmount: '',
      maxDiscountAmount: '',
      usageLimit: '',
      perCustomerLimit: '',
      startDate: '',
      endDate: '',
      code: '',
      priority: 1,
      isActive: true
    })
  }

  const startEdit = (offer: Offer) => {
    setEditingOffer(offer)
    setFormData({
      name: offer.name,
      description: offer.description,
      type: offer.type,
      discountType: offer.discountType,
      discountValue: offer.discountValue,
      productIds: offer.productIds?.join(', ') || '',
      paymentMethods: offer.paymentMethods?.join(', ') || '',
      categories: offer.categories?.join(', ') || '',
      minPurchaseAmount: offer.minPurchaseAmount?.toString() || '',
      maxDiscountAmount: offer.maxDiscountAmount?.toString() || '',
      usageLimit: offer.usageLimit?.toString() || '',
      perCustomerLimit: offer.perCustomerLimit?.toString() || '',
      startDate: offer.startDate.split('T')[0],
      endDate: offer.endDate.split('T')[0],
      code: offer.code || '',
      priority: offer.priority,
      isActive: offer.isActive
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getDiscountDisplay = (offer: Offer) => {
    if (offer.discountType === 'percentage') {
      return `${offer.discountValue}%`
    } else if (offer.discountType === 'fixed') {
      return `$${offer.discountValue}`
    } else {
      return `${offer.discountValue} coins`
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading offers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Offers Management</h1>
          <p className="text-muted-foreground">Create and manage product offers, combo deals, and payment-specific discounts</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Offer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[95vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Create New Offer</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4 overflow-y-auto pr-2" style={{ maxHeight: 'calc(95vh - 180px)' }}>
              <div className="grid gap-2">
                <Label htmlFor="name">Offer Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Summer Sale 2025"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the offer..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">Offer Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as Offer['type'] })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product">Product Specific</SelectItem>
                      <SelectItem value="combo">Combo Deal</SelectItem>
                      <SelectItem value="payment_method">Payment Method</SelectItem>
                      <SelectItem value="category">Category</SelectItem>
                      <SelectItem value="sitewide">Sitewide</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="discountType">Discount Type *</Label>
                  <Select value={formData.discountType} onValueChange={(value) => setFormData({ ...formData, discountType: value as 'percentage' | 'fixed' | 'coins' })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                      <SelectItem value="coins">Coins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="discountValue">Discount Value *</Label>
                <Input
                  id="discountValue"
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                  placeholder="e.g., 10 for 10%, or 50 for $50"
                />
              </div>

              {formData.type === 'product' && (
                <div className="grid gap-2">
                  <Label htmlFor="productIds">Product IDs (comma-separated)</Label>
                  <Input
                    id="productIds"
                    value={formData.productIds}
                    onChange={(e) => setFormData({ ...formData, productIds: e.target.value })}
                    placeholder="e.g., prod1, prod2, prod3"
                  />
                </div>
              )}

              {formData.type === 'payment_method' && (
                <div className="grid gap-2">
                  <Label htmlFor="paymentMethods">Payment Methods (comma-separated)</Label>
                  <Input
                    id="paymentMethods"
                    value={formData.paymentMethods}
                    onChange={(e) => setFormData({ ...formData, paymentMethods: e.target.value })}
                    placeholder="e.g., card, upi, wallet"
                  />
                </div>
              )}

              {formData.type === 'category' && (
                <div className="grid gap-2">
                  <Label htmlFor="categories">Categories (comma-separated)</Label>
                  <Input
                    id="categories"
                    value={formData.categories}
                    onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
                    placeholder="e.g., t-shirts, hoodies"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="minPurchaseAmount">Min Purchase Amount</Label>
                  <Input
                    id="minPurchaseAmount"
                    type="number"
                    value={formData.minPurchaseAmount}
                    onChange={(e) => setFormData({ ...formData, minPurchaseAmount: e.target.value })}
                    placeholder="Optional"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="maxDiscountAmount">Max Discount Cap</Label>
                  <Input
                    id="maxDiscountAmount"
                    type="number"
                    value={formData.maxDiscountAmount}
                    onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="usageLimit">Total Usage Limit</Label>
                  <Input
                    id="usageLimit"
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    placeholder="Optional"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="perCustomerLimit">Per Customer Limit</Label>
                  <Input
                    id="perCustomerLimit"
                    type="number"
                    value={formData.perCustomerLimit}
                    onChange={(e) => setFormData({ ...formData, perCustomerLimit: e.target.value })}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="code">Promo Code (Optional)</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g., SUMMER2025"
                />
              </div>

              <div className="grid gap-2">
                  <Label htmlFor="priority">Priority (Higher = Applied First)</Label>
                <Input
                  id="priority"
                  type="number"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                />
              </div>

              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive" className="cursor-pointer">Activate offer immediately</Label>
              </div>
            </div>
            <DialogFooter className="mt-4 pt-4 border-t">
              <Button variant="outline" onClick={() => { setIsCreateDialogOpen(false); resetForm() }}>
                Cancel
              </Button>
              <Button onClick={handleCreateOffer}>Create Offer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Offers</CardTitle>
            <Tags className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOffers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Offers</CardTitle>
            <ToggleRight className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeOffers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsage}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Offers</CardTitle>
            <ToggleLeft className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOffers - stats.activeOffers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Offers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Offers</CardTitle>
          <CardDescription>Manage your promotional offers and discounts</CardDescription>
        </CardHeader>
        <CardContent>
          {offers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No offers created yet. Click "Create Offer" to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Valid Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offers.map((offer) => (
                  <TableRow key={offer.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{offer.name}</p>
                        {offer.code && (
                          <p className="text-xs text-muted-foreground">Code: {offer.code}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{offer.type}</Badge>
                    </TableCell>
                    <TableCell className="font-mono">
                      {getDiscountDisplay(offer)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{offer.usageCount} used</p>
                        {offer.usageLimit && (
                          <p className="text-xs text-muted-foreground">
                            Limit: {offer.usageLimit}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div>
                        <p>{formatDate(offer.startDate)}</p>
                        <p className="text-muted-foreground">to {formatDate(offer.endDate)}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={offer.isActive ? 'default' : 'secondary'}>
                        {offer.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(offer.id)}
                          title={offer.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {offer.isActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                        </Button>
                        <Dialog open={editingOffer?.id === offer.id} onOpenChange={(open) => !open && setEditingOffer(null)}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => startEdit(offer)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
                            <DialogHeader>
                              <DialogTitle>Edit Offer</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4 overflow-y-auto pr-2" style={{ maxHeight: 'calc(95vh - 180px)' }}>
                              {/* Same form fields as create, but for editing */}
                              <div className="grid gap-2">
                                <Label htmlFor="edit-name">Offer Name *</Label>
                                <Input
                                  id="edit-name"
                                  value={formData.name}
                                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="edit-description">Description *</Label>
                                <Textarea
                                  id="edit-description"
                                  value={formData.description}
                                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                  <Label>Discount Value</Label>
                                  <Input
                                    type="number"
                                    value={formData.discountValue}
                                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label>Priority</Label>
                                  <Input
                                    type="number"
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                                  />
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                                <Switch
                                  id="edit-active"
                                  checked={formData.isActive}
                                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                                />
                                <Label htmlFor="edit-active" className="cursor-pointer">Activate offer</Label>
                              </div>
                            </div>
                            <DialogFooter className="mt-4 pt-4 border-t">
                              <Button variant="outline" onClick={() => { setEditingOffer(null); resetForm() }}>
                                Cancel
                              </Button>
                              <Button onClick={handleUpdateOffer}>Update Offer</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteOffer(offer.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
