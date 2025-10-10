'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/site/header'
import { Footer } from '@/components/site/footer'
import { useCart } from '@/hooks/use-cart'
import { CheckCircle, ShoppingBag, Heart } from 'lucide-react'

export default function ThankYouPage() {
  const { clear } = useCart()
  const [orderInfo, setOrderInfo] = useState<{orderNumber: string, customerEmail: string} | null>(null)

  // Clear the cart and get order info when the user reaches the thank you page
  useEffect(() => {
    clear()
    
    // Get order info from session storage
    const orderNumber = sessionStorage.getItem('lastOrderNumber')
    const customerEmail = sessionStorage.getItem('customerEmail')
    
    if (orderNumber && customerEmail) {
      setOrderInfo({ orderNumber, customerEmail })
      // Clear from session storage
      sessionStorage.removeItem('lastOrderNumber')
      sessionStorage.removeItem('customerEmail')
    }
  }, [clear])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="relative inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
              <div className="absolute -top-2 -right-2 text-2xl animate-bounce">🎉</div>
            </div>
          </div>

          {/* Main Message */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-bold text-green-600 mb-2">
                Thank You for Your Purchase! 🛍️
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg text-muted-foreground">
                We're thrilled that you chose StyleWav! Your order has been confirmed and saved to our system.
              </p>
              
              {orderInfo && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-4">
                  <p className="text-sm font-medium text-green-800 mb-2">📋 Order Details</p>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Order Number:</span> <span className="font-mono text-green-700">{orderInfo.orderNumber}</span></p>
                    <p><span className="font-medium">Email:</span> <span className="text-green-700">{orderInfo.customerEmail}</span></p>
                  </div>
                </div>
              )}
              
              <div className="flex justify-center items-center gap-2 text-4xl my-6">
                🎊 💫 ✨ 🎁 ✨ 💫 🎊
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium">What's next?</p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>📧 You'll receive an order confirmation email shortly</p>
                  <p>📦 We'll send you tracking information once your order ships</p>
                  <p>🚚 Expected delivery: 3-5 business days</p>
                  <p>📱 You can track your order anytime in "Your Orders" section</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button asChild size="lg" className="w-full sm:w-auto px-8">
              <Link href="/" className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Continue Shopping
              </Link>
            </Button>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" asChild>
                <Link href="/orders" className="flex items-center gap-2">
                  📋 View Order History
                </Link>
              </Button>
              
              <Button variant="outline" asChild>
                <Link href="/wishlist" className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  My Wishlist
                </Link>
              </Button>
            </div>
          </div>

          {/* Social Sharing */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">
              Love your StyleWav purchase? Share the love! 💕
            </p>
            <div className="flex justify-center gap-4 text-2xl">
              <span className="cursor-pointer hover:scale-110 transition-transform" title="Share on social media">📱</span>
              <span className="cursor-pointer hover:scale-110 transition-transform" title="Tell a friend">👥</span>
              <span className="cursor-pointer hover:scale-110 transition-transform" title="Rate us">⭐</span>
            </div>
          </div>

          {/* Fun Message */}
          <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
            <p className="text-sm font-medium text-purple-700 mb-2">
              🎨 Style Tip
            </p>
            <p className="text-sm text-purple-600">
              Follow us on social media for styling inspiration and exclusive deals! 
              Your new StyleWav pieces are going to look amazing! ✨
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}