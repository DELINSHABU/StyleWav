"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Coins, Gift, Users, TrendingUp, ShoppingCart } from "lucide-react"
import { toast } from "sonner"

interface CustomerCoins {
  customerId: string
  customerEmail: string
  balance: number
  totalEarned: number
  totalSpent: number
  lastTransactionDate: string
  createdAt: string
  updatedAt: string
}

export default function AdminCoinsPage() {
  const [customers, setCustomers] = useState<CustomerCoins[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerCoins | null>(null)
  const [giftAmount, setGiftAmount] = useState("")
  const [giftDescription, setGiftDescription] = useState("")
  const [gifting, setGifting] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [purchasedCoins, setPurchasedCoins] = useState(0)
  const [giftedCoins, setGiftedCoins] = useState(0)
  const [customersPurchased, setCustomersPurchased] = useState(0)
  const [customersGifted, setCustomersGifted] = useState(0)

  useEffect(() => {
    fetchCustomersCoins()
  }, [])

  const fetchCustomersCoins = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/coins')
      const data = await response.json()

      if (data.success && data.data) {
        setCustomers(data.data)
        
        // Calculate purchased and gifted statistics
        let totalPurchased = 0
        let totalGifted = 0
        const customersPurchasedSet = new Set()
        const customersGiftedSet = new Set()
        
        // Read transactions from each customer to calculate stats
        data.data.forEach((customer: any) => {
          if (customer.transactions) {
            customer.transactions.forEach((txn: any) => {
              if (txn.type === 'purchase') {
                totalPurchased += txn.amount
                customersPurchasedSet.add(customer.customerId)
              } else if (txn.type === 'gift') {
                totalGifted += txn.amount
                customersGiftedSet.add(customer.customerId)
              }
            })
          }
        })
        
        setPurchasedCoins(totalPurchased)
        setGiftedCoins(totalGifted)
        setCustomersPurchased(customersPurchasedSet.size)
        setCustomersGifted(customersGiftedSet.size)
      }
    } catch (error) {
      console.error('Error fetching customers coins:', error)
      toast.error('Failed to load customers coins')
    } finally {
      setLoading(false)
    }
  }

  const handleGiftCoins = async () => {
    if (!selectedCustomer || !giftAmount || parseFloat(giftAmount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    setGifting(true)
    try {
      const response = await fetch('/api/admin/coins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: selectedCustomer.customerId,
          customerEmail: selectedCustomer.customerEmail,
          amount: parseFloat(giftAmount),
          description: giftDescription || `Admin gift of ${giftAmount} coins`,
          giftedBy: 'admin'
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success(`Successfully gifted ${giftAmount} coins to ${selectedCustomer.customerEmail}`)
        setDialogOpen(false)
        setGiftAmount("")
        setGiftDescription("")
        setSelectedCustomer(null)
        fetchCustomersCoins()
      } else {
        toast.error(data.error || 'Failed to gift coins')
      }
    } catch (error) {
      console.error('Error gifting coins:', error)
      toast.error('An error occurred')
    } finally {
      setGifting(false)
    }
  }

  const totalCoinsInCirculation = customers.reduce((sum, c) => sum + c.balance, 0)
  const totalCoinsEarned = customers.reduce((sum, c) => sum + c.totalEarned, 0)
  const totalCoinsSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Coins Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage customer coins, gift coins, and view statistics
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customers.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coins in Circulation</CardTitle>
              <Coins className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCoinsInCirculation.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                ≈ ${(totalCoinsInCirculation * 0.01).toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCoinsEarned.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <TrendingUp className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCoinsSpent.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coins Purchased</CardTitle>
              <ShoppingCart className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{purchasedCoins.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {customersPurchased} customer{customersPurchased !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coins Gifted</CardTitle>
              <Gift className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{giftedCoins.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {customersGifted} customer{customersGifted !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Coins</CardTitle>
            <CardDescription>View and manage coins for all customers</CardDescription>
          </CardHeader>
          <CardContent>
            {customers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No customers with coins yet
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead className="text-right">Total Earned</TableHead>
                    <TableHead className="text-right">Total Spent</TableHead>
                    <TableHead>Last Transaction</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.customerId}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{customer.customerEmail || 'Unknown'}</p>
                          <p className="text-xs text-muted-foreground">{customer.customerId}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary" className="font-mono">
                          {customer.balance.toLocaleString()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {customer.totalEarned.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {customer.totalSpent.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(customer.lastTransactionDate)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog open={dialogOpen && selectedCustomer?.customerId === customer.customerId} onOpenChange={(open) => {
                          setDialogOpen(open)
                          if (!open) {
                            setSelectedCustomer(null)
                            setGiftAmount("")
                            setGiftDescription("")
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedCustomer(customer)}
                            >
                              <Gift className="h-4 w-4 mr-2" />
                              Gift Coins
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Gift Coins to Customer</DialogTitle>
                              <DialogDescription>
                                Send free coins to {customer.customerEmail}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="amount">Amount of Coins</Label>
                                <Input
                                  id="amount"
                                  type="number"
                                  placeholder="Enter amount"
                                  value={giftAmount}
                                  onChange={(e) => setGiftAmount(e.target.value)}
                                  min="1"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="description">Description (Optional)</Label>
                                <Input
                                  id="description"
                                  placeholder="e.g., Promotional gift, Compensation"
                                  value={giftDescription}
                                  onChange={(e) => setGiftDescription(e.target.value)}
                                />
                              </div>
                              <div className="bg-muted p-3 rounded-lg">
                                <p className="text-sm">
                                  <span className="font-medium">Current Balance:</span>{' '}
                                  {customer.balance.toLocaleString()} coins
                                </p>
                                {giftAmount && parseFloat(giftAmount) > 0 && (
                                  <p className="text-sm mt-1">
                                    <span className="font-medium">New Balance:</span>{' '}
                                    {(customer.balance + parseFloat(giftAmount)).toLocaleString()} coins
                                  </p>
                                )}
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setDialogOpen(false)}
                                disabled={gifting}
                              >
                                Cancel
                              </Button>
                              <Button onClick={handleGiftCoins} disabled={gifting}>
                                {gifting ? 'Gifting...' : 'Gift Coins'}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
