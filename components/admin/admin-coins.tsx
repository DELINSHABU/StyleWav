'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Coins, Users, TrendingUp, Gift, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface CustomerCoins {
  customerId: string
  customerEmail: string
  balance: number
  totalEarned: number
  totalSpent: number
  lastTransactionDate: string
}

export function AdminCoins() {
  const [customers, setCustomers] = useState<CustomerCoins[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalCoinsInCirculation: 0,
    totalCoinsEarned: 0,
    totalCoinsSpent: 0
  })

  useEffect(() => {
    loadCoinsData()
  }, [])

  const loadCoinsData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/coins')
      const data = await response.json()

      if (data.success && data.data) {
        setCustomers(data.data.slice(0, 10)) // Show only top 10
        
        // Calculate stats
        const allCustomers = data.data
        setStats({
          totalCustomers: allCustomers.length,
          totalCoinsInCirculation: allCustomers.reduce((sum: number, c: CustomerCoins) => sum + c.balance, 0),
          totalCoinsEarned: allCustomers.reduce((sum: number, c: CustomerCoins) => sum + c.totalEarned, 0),
          totalCoinsSpent: allCustomers.reduce((sum: number, c: CustomerCoins) => sum + c.totalSpent, 0)
        })
      }
    } catch (error) {
      console.error('Error loading coins data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading coins data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Coins Management</h1>
          <p className="text-muted-foreground">View and manage customer coins</p>
        </div>
        <Link href="/admin/coins">
          <Button>
            <ExternalLink className="h-4 w-4 mr-2" />
            Full Coins Management
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coins in Circulation</CardTitle>
            <Coins className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCoinsInCirculation.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              ≈ ${(stats.totalCoinsInCirculation * 0.01).toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCoinsEarned.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCoinsSpent.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Top Customers Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Top 10 Customers by Balance</CardTitle>
            <Link href="/admin/coins" className="text-sm text-primary hover:underline">
              View All →
            </Link>
          </div>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.customerId}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{customer.customerEmail || 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {customer.customerId}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary" className="font-mono">
                        <Coins className="h-3 w-3 mr-1 text-yellow-500" />
                        {customer.balance.toLocaleString()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {customer.totalEarned.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {customer.totalSpent.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(customer.lastTransactionDate)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/coins">
              <Button variant="outline" className="w-full justify-start">
                <Gift className="h-4 w-4 mr-2" />
                Gift Coins to Customers
              </Button>
            </Link>
            <Link href="/admin/coins">
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                View All Customers
              </Button>
            </Link>
            <Link href="/admin/coins">
              <Button variant="outline" className="w-full justify-start">
                <Coins className="h-4 w-4 mr-2" />
                View Full Statistics
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
