# 🪙 StyleWav Coins System

A complete virtual currency system for your e-commerce application, similar to PUBG/Valorant VP (Virtual Points).

## ✨ Features Implemented

### For Customers
- ✅ **Coin Balance Display** - Real-time balance shown in navbar after "Track Order"
- ✅ **Coin Recharge Page** - Purchase coin packages with real money (`/coins`)
- ✅ **Transaction History** - View all coin purchases, gifts, and spending
- ✅ **Welcome Bonus** - New users automatically receive 100 free coins
- ✅ **Multiple Purchase Packages** - 5 different coin packages with bonus coins
- ✅ **Checkout Integration** - Ready to use coins as payment method

### For Admins
- ✅ **Coins Management Panel** - View all customer coins (`/admin/coins`)
- ✅ **Gift Coins** - Send free coins to any customer
- ✅ **Statistics Dashboard** - Track total coins in circulation, earned, and spent
- ✅ **Transaction Monitoring** - View all customer transaction histories

## 📂 Files Created

### Database & Types
- `jsonDatabase/coins.json` - Coins database file
- `lib/database-types.ts` - Added coin-related TypeScript interfaces
- `lib/coins-database.ts` - Core coin operations (add, deduct, refund, etc.)

### API Routes
- `app/api/coins/route.ts` - Customer coin operations
- `app/api/admin/coins/route.ts` - Admin coin management

### UI Components & Pages
- `components/site/coins-display.tsx` - Navbar coin balance display
- `app/coins/page.tsx` - Customer coins page (recharge + history)
- `app/admin/coins/page.tsx` - Admin coins management
- `components/admin/admin-sidebar.tsx` - Updated with coins section

### Documentation
- `COINS_INTEGRATION.md` - Detailed integration guide for checkout
- `COINS_README.md` - This file

## 🚀 Quick Start

### Testing the System

1. **View Your Coins**
   - Login to the application
   - Look at the navbar (after "Track Order") - you'll see your coin balance
   - Click on it to go to the coins page

2. **Purchase Coins**
   - Visit `/coins`
   - Click any purchase package
   - Coins will be added instantly (demo mode)

3. **View Transaction History**
   - Scroll down on `/coins` page
   - See all your transactions with timestamps

4. **Admin Panel**
   - Visit `/admin`
   - Click "Coins" in the sidebar
   - View all customer balances
   - Gift coins to any customer

## 💰 Coin Packages

| Package | Coins | Bonus | Price |
|---------|-------|-------|-------|
| Starter Pack | 100 | - | $1.00 |
| Value Pack | 500 | +50 | $4.50 |
| Popular Pack ⭐ | 1,000 | +100 | $9.00 |
| Premium Pack | 2,000 | +300 | $17.00 |
| Ultimate Pack | 5,000 | +1,000 | $40.00 |

## 🔄 Conversion Rate

- **1 coin = $0.01 USD**
- **100 coins = $1.00 USD**

## 🛒 Checkout Integration

To use coins during checkout, see `COINS_INTEGRATION.md` for detailed code examples.

Basic steps:
1. Fetch customer's coin balance
2. Allow customer to select how many coins to use
3. Apply coin discount to order total
4. Deduct coins after successful order
5. Refresh navbar display

## 🎯 API Usage Examples

### Get Customer Coins
```bash
GET /api/coins?customerId=USER_ID
```

### Get Transaction History
```bash
GET /api/coins?customerId=USER_ID&transactions=true&limit=50
```

### Add Coins (Purchase)
```bash
POST /api/coins
{
  "action": "add",
  "customerId": "USER_ID",
  "customerEmail": "user@example.com",
  "amount": 1000,
  "description": "Purchased Popular Pack",
  "options": {
    "type": "purchase",
    "paymentMethod": "razorpay",
    "paymentAmount": 9.00
  }
}
```

### Deduct Coins (Spending)
```bash
POST /api/coins
{
  "action": "deduct",
  "customerId": "USER_ID",
  "amount": 500,
  "description": "Payment for order #12345",
  "options": {
    "orderId": "order_123"
  }
}
```

### Gift Coins (Admin)
```bash
POST /api/admin/coins
{
  "customerId": "USER_ID",
  "customerEmail": "user@example.com",
  "amount": 200,
  "description": "Promotional gift",
  "giftedBy": "admin"
}
```

## 🔐 Security Notes

- Admin endpoints (`/api/admin/coins`) need authentication in production
- Add proper admin authentication before deploying
- Validate payment gateway responses before adding coins
- Log all coin transactions for audit trails

## 🎨 Customization

### Change Coin Packages
Edit `app/coins/page.tsx` - `COIN_PACKAGES` array

### Change Conversion Rate
Edit `lib/coins-database.ts`:
```typescript
export const COIN_TO_CURRENCY_RATE = 0.01 // Change this
export const CURRENCY_TO_COIN_RATE = 100   // Change this
```

### Change Welcome Bonus
Edit `lib/coins-database.ts` - `getCustomerCoins()` function (line 66)

## 🐛 Troubleshooting

**Coins not showing in navbar?**
- Make sure you're logged in
- Refresh the page
- Check browser console for errors

**Purchase not working?**
- This is demo mode - purchases are instant
- For production, integrate payment gateway (see COINS_INTEGRATION.md)

**Admin panel not accessible?**
- Navigate to `/admin/coins` directly
- Or click "Coins" in admin sidebar

## 📱 Mobile Responsive

All coin-related pages and components are fully responsive and work great on mobile devices.

## 🔮 Future Enhancements

Potential features to add:
- Coin expiration dates
- Referral bonuses (earn coins for referring friends)
- Daily login bonuses
- Coin multiplier events
- Coin gifting between users
- Coin redemption for exclusive items
- Loyalty program tiers

## 📄 License

Part of the StyleWav project.

---

**Need Help?** Check `COINS_INTEGRATION.md` for detailed integration examples.
