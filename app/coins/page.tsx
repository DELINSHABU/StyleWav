"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Coins, ArrowUpRight, ArrowDownRight, Gift, ShoppingCart, RefreshCw } from "lucide-react"
import { toast } from "sonner"

interface CoinTransaction {
  id: string
  type: 'purchase' | 'gift' | 'deduction' | 'refund'
  amount: number
  balanceBefore: number
  balanceAfter: number
  description: string
  orderId?: string
  paymentMethod?: string
  paymentAmount?: number
  giftedBy?: string
  createdAt: string
}

interface CoinPackage {
  id: string
  name: string
  coins: number
  price: number
  bonusCoins?: number
  popular?: boolean
}

const COIN_PACKAGES: CoinPackage[] = [
  { id: 'pack_100', name: 'Starter Pack', coins: 100, price: 1.00 },
  { id: 'pack_500', name: 'Value Pack', coins: 500, price: 4.50, bonusCoins: 50 },
  { id: 'pack_1000', name: 'Popular Pack', coins: 1000, price: 9.00, bonusCoins: 100, popular: true },
  { id: 'pack_2000', name: 'Premium Pack', coins: 2000, price: 17.00, bonusCoins: 300 },
  { id: 'pack_5000', name: 'Ultimate Pack', coins: 5000, price: 40.00, bonusCoins: 1000 },
]

export default function CoinsPage() {
  const { currentUser } = useAuth()
  const router = useRouter()
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<CoinTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)

  useEffect(() => {
    if (!currentUser) {
      router.push('/')
      return
    }
    fetchCoinsData()
  }, [currentUser, router])

  const fetchCoinsData = async () => {
    try {
      setLoading(true)
      
      // Fetch balance and transactions in parallel
      const [balanceRes, transactionsRes] = await Promise.all([
        fetch(`/api/coins?customerId=${currentUser?.uid}`),
        fetch(`/api/coins?customerId=${currentUser?.uid}&transactions=true&limit=50`)
      ])

      const balanceData = await balanceRes.json()
      const transactionsData = await transactionsRes.json()

      if (balanceData.success && balanceData.data) {
        setBalance(balanceData.data.balance)
      }

      if (transactionsData.success && transactionsData.data) {
        setTransactions(transactionsData.data)
      }
    } catch (error) {
      console.error('Error fetching coins data:', error)
      toast.error('Failed to load coins data')
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async (pkg: CoinPackage) => {
    if (!currentUser) return

    setPurchasing(true)
    try {
      // In production, integrate with payment gateway (Razorpay, Stripe, etc.)
      // For demo, we'll simulate a purchase
      
      const totalCoins = pkg.coins + (pkg.bonusCoins || 0)
      
      const response = await fetch('/api/coins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          customerId: currentUser.uid,
          customerEmail: currentUser.email,
          amount: totalCoins,
          description: `Purchased ${pkg.name}`,
          options: {
            type: 'purchase',
            paymentMethod: 'demo',
            paymentAmount: pkg.price
          }
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success(`Successfully purchased ${totalCoins} coins!`)
        fetchCoinsData()
        // Refresh navbar coin display
        if (typeof window !== 'undefined' && (window as any).refreshCoins) {
          (window as any).refreshCoins()
        }
      } else {
        toast.error(data.error || 'Failed to purchase coins')
      }
    } catch (error) {
      console.error('Error purchasing coins:', error)
      toast.error('An error occurred')
    } finally {
      setPurchasing(false)
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <ArrowUpRight className="h-4 w-4 text-green-500" />
      case 'gift':
        return <Gift className="h-4 w-4 text-blue-500" />
      case 'deduction':
        return <ArrowDownRight className="h-4 w-4 text-red-500" />
      case 'refund':
        return <RefreshCw className="h-4 w-4 text-orange-500" />
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Balance Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-6 w-6 text-yellow-500" />
              Your Coin Balance
            </CardTitle>
            <CardDescription>Use coins to purchase products and get exclusive deals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-yellow-600">
              {balance.toLocaleString()} <span className="text-2xl text-muted-foreground">Coins</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              ≈ ${(balance * 0.01).toFixed(2)} USD
            </p>
          </CardContent>
        </Card>

        {/* Purchase Packs */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Recharge Coins</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {COIN_PACKAGES.map((pkg) => (
              <Card key={pkg.id} className={pkg.popular ? 'border-primary shadow-lg' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{pkg.name}</CardTitle>
                      <CardDescription className="mt-2">
                        <span className="text-2xl font-bold text-foreground">{pkg.coins}</span> Coins
                        {pkg.bonusCoins && (
                          <Badge variant="secondary" className="ml-2">
                            +{pkg.bonusCoins} Bonus
                          </Badge>
                        )}
                      </CardDescription>
                    </div>
                    {pkg.popular && (
                      <Badge variant="default">Popular</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-3xl font-bold">
                      ${pkg.price.toFixed(2)}
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => handlePurchase(pkg)}
                      disabled={purchasing}
                    >
                      {purchasing ? 'Processing...' : 'Purchase'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Transaction History */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
          <Card>
            <CardContent className="p-0">
              {transactions.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No transactions yet
                </div>
              ) : (
                <div className="divide-y">
                  {transactions.map((txn) => (
                    <div key={txn.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        {getTransactionIcon(txn.type)}
                        <div>
                          <p className="font-medium">{txn.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(txn.createdAt)}
                            {txn.giftedBy && txn.giftedBy !== 'system' && (
                              <span className="ml-2">• Gifted by {txn.giftedBy}</span>
                            )}
                            {txn.paymentMethod && (
                              <span className="ml-2">• Paid ${txn.paymentAmount?.toFixed(2)}</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${txn.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {txn.amount >= 0 ? '+' : ''}{txn.amount}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Balance: {txn.balanceAfter}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
