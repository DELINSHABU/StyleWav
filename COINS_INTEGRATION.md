# Coins System Integration Guide

## Overview
The coins system has been successfully added to StyleWav. This document explains how to integrate coin payments into the checkout process.

## System Architecture

### Database
- **Location**: `jsonDatabase/coins.json`
- **Structure**: Stores customer coin balances and transaction history
- **Auto-initialization**: New customers automatically receive 100 welcome bonus coins

### API Endpoints

#### Customer Endpoints (`/api/coins`)
- **GET**: Fetch coin balance and transactions
  - Query params: `customerId`, `transactions=true`, `limit=50`
- **POST**: Add or deduct coins
  - Actions: `add` (purchase/gift) or `deduct` (spending)

#### Admin Endpoints (`/api/admin/coins`)
- **GET**: View all customer coins
- **POST**: Gift coins to customers

### UI Components
1. **Navbar Display**: Shows current coin balance (updates in real-time)
2. **Coins Page** (`/app/coins`): Recharge coins and view transaction history
3. **Admin Panel** (`/app/admin/coins`): Manage all customer coins

## Checkout Integration

To allow customers to pay with coins during checkout, update your checkout process:

### Example Checkout Integration

```typescript
// In your checkout page/component (e.g., app/checkout/page.tsx)

import { deductCoins, coinsToCurrency } from '@/lib/coins-database'

// 1. Fetch customer's coin balance
const [coinBalance, setCoinBalance] = useState(0)
const [useCoins, setUseCoins] = useState(false)
const [coinsToUse, setCoinsToUse] = useState(0)

useEffect(() => {
  if (currentUser?.uid) {
    fetchCoinBalance()
  }
}, [currentUser])

const fetchCoinBalance = async () => {
  const response = await fetch(`/api/coins?customerId=${currentUser?.uid}`)
  const data = await response.json()
  if (data.success && data.data) {
    setCoinBalance(data.data.balance)
  }
}

// 2. Calculate discount from coins
const maxCoinsUsable = Math.min(
  coinBalance,
  Math.floor(cartTotal * 100) // Convert to coins (100 coins = $1)
)

const coinDiscount = coinsToUse * 0.01 // 1 coin = $0.01

// 3. Display coin payment option
<div className="border rounded-lg p-4">
  <label className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={useCoins}
        onChange={(e) => {
          setUseCoins(e.target.checked)
          if (e.target.checked) {
            setCoinsToUse(maxCoinsUsable)
          } else {
            setCoinsToUse(0)
          }
        }}
      />
      <Coins className="h-5 w-5 text-yellow-500" />
      <span>Use Coins</span>
    </div>
    <span className="text-sm text-muted-foreground">
      Available: {coinBalance} coins
    </span>
  </label>
  
  {useCoins && (
    <div className="mt-3">
      <input
        type="range"
        min="0"
        max={maxCoinsUsable}
        value={coinsToUse}
        onChange={(e) => setCoinsToUse(parseInt(e.target.value))}
        className="w-full"
      />
      <div className="flex justify-between text-sm mt-1">
        <span>Using: {coinsToUse} coins</span>
        <span className="text-green-600">-${coinDiscount.toFixed(2)}</span>
      </div>
    </div>
  )}
</div>

// 4. Apply discount to order total
const finalTotal = cartTotal - coinDiscount

// 5. Deduct coins after successful order
const handlePlaceOrder = async () => {
  try {
    // Create order first...
    const order = await createOrder(...)
    
    // Deduct coins if used
    if (useCoins && coinsToUse > 0) {
      await fetch('/api/coins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deduct',
          customerId: currentUser.uid,
          amount: coinsToUse,
          description: `Payment for order ${order.orderNumber}`,
          options: {
            orderId: order.id
          }
        })
      })
    }
    
    // Refresh coin display in navbar
    if (typeof window !== 'undefined' && (window as any).refreshCoins) {
      (window as any).refreshCoins()
    }
    
    // Success!
    router.push(`/order-confirmation/${order.id}`)
  } catch (error) {
    console.error('Order failed:', error)
  }
}
```

## Conversion Rate
- **1 coin = $0.01 USD**
- **100 coins = $1.00 USD**

Use these helper functions:
- `currencyToCoins(amount)`: Convert dollars to coins
- `coinsToCurrency(coins)`: Convert coins to dollars

## Coin Purchase Packages

Predefined packages in `/app/coins/page.tsx`:
1. Starter Pack: 100 coins for $1.00
2. Value Pack: 550 coins for $4.50 (50 bonus)
3. Popular Pack: 1,100 coins for $9.00 (100 bonus)
4. Premium Pack: 2,300 coins for $17.00 (300 bonus)
5. Ultimate Pack: 6,000 coins for $40.00 (1,000 bonus)

## Payment Gateway Integration

For production, integrate with Razorpay, Stripe, or PayPal:

```typescript
// Example with Razorpay
const handlePurchase = async (pkg: CoinPackage) => {
  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
    amount: pkg.price * 100, // in paise
    currency: 'USD',
    name: 'StyleWav Coins',
    description: `Purchase ${pkg.name}`,
    handler: async (response: any) => {
      // After successful payment
      await fetch('/api/coins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          customerId: currentUser.uid,
          customerEmail: currentUser.email,
          amount: pkg.coins + (pkg.bonusCoins || 0),
          description: `Purchased ${pkg.name}`,
          options: {
            type: 'purchase',
            paymentMethod: 'razorpay',
            paymentAmount: pkg.price
          }
        })
      })
    }
  }
  
  const razorpay = new Razorpay(options)
  razorpay.open()
}
```

## Admin Features

Admins can:
1. View all customer coin balances
2. Gift coins to customers (promotions, compensation)
3. See transaction history
4. View statistics (total coins in circulation, earned, spent)

Access at: `/admin/coins`

## Testing

1. **Test coin purchase**: Visit `/coins` and click any purchase button
2. **Test checkout**: Add items to cart and try using coins at checkout
3. **Test admin**: Visit `/admin/coins` to gift coins and view statistics

## Important Notes

- Coins cannot be converted back to real money
- Minimum coin usage: 1 coin
- Maximum coins usable per order: Up to 100% of order value
- Welcome bonus: New users get 100 coins automatically
- Coin balance updates in real-time across the app
