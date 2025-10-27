'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tags, Check, X, Percent, DollarSign, Coins } from 'lucide-react'
import type { Offer } from '@/lib/database-types'

interface OffersSectionProps {
  subtotal: number
  paymentMethod: string
  cartItems: Array<{ id: string; [key: string]: any }>
  onOfferApply: (offer: Offer | null, discount: number) => void
}

export function OffersSection({ subtotal, paymentMethod, cartItems, onOfferApply }: OffersSectionProps) {
  const [offers, setOffers] = useState<Offer[]>([])
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [couponCode, setCouponCode] = useState('')
  const [couponError, setCouponError] = useState('')

  useEffect(() => {
    loadOffers()
  }, [])

  const loadOffers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/offers?active=true')
      if (response.ok) {
        const data = await response.json()
        setOffers(data)
      }
    } catch (error) {
      console.error('Error loading offers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const isOfferEligible = (offer: Offer): { eligible: boolean; reason?: string } => {
    // Check if offer is active
    if (!offer.isActive) {
      return { eligible: false, reason: 'Offer is inactive' }
    }

    // Check dates
    const now = new Date().toISOString()
    if (offer.startDate > now) {
      return { eligible: false, reason: 'Offer not started yet' }
    }
    if (offer.endDate < now) {
      return { eligible: false, reason: 'Offer expired' }
    }

    // Check usage limit
    if (offer.usageLimit && offer.usageCount >= offer.usageLimit) {
      return { eligible: false, reason: 'Offer limit reached' }
    }

    // Check minimum purchase amount
    if (offer.minPurchaseAmount && subtotal < offer.minPurchaseAmount) {
      return { eligible: false, reason: `Minimum purchase of ₹${offer.minPurchaseAmount} required` }
    }

    // Check payment method
    if (offer.type === 'payment_method' && offer.paymentMethods) {
      const normalizedPaymentMethod = paymentMethod.toLowerCase()
      const hasMatch = offer.paymentMethods.some(method => 
        method.toLowerCase() === normalizedPaymentMethod || 
        (normalizedPaymentMethod === 'card' && (method.toLowerCase() === 'credit card' || method.toLowerCase() === 'debit card'))
      )
      if (!hasMatch) {
        return { eligible: false, reason: `Only for ${offer.paymentMethods.join(', ')} payments` }
      }
    }

    // Check product-specific offers
    if (offer.type === 'product' && offer.productIds && offer.productIds.length > 0) {
      const hasProduct = cartItems.some(item => offer.productIds?.includes(item.id))
      if (!hasProduct) {
        return { eligible: false, reason: 'No eligible products in cart' }
      }
    }

    return { eligible: true }
  }

  const calculateDiscount = (offer: Offer): number => {
    if (offer.discountType === 'percentage') {
      let discount = (subtotal * offer.discountValue) / 100
      // Apply max discount cap if exists
      if (offer.maxDiscountAmount && discount > offer.maxDiscountAmount) {
        discount = offer.maxDiscountAmount
      }
      return Math.round(discount)
    } else if (offer.discountType === 'fixed') {
      return offer.discountValue
    } else if (offer.discountType === 'coins') {
      // Coins as discount value (not implemented in current flow, but structure is here)
      return offer.discountValue
    }
    return 0
  }

  const handleOfferSelect = (offer: Offer) => {
    if (selectedOffer?.id === offer.id) {
      // Deselect
      setSelectedOffer(null)
      onOfferApply(null, 0)
      setCouponCode('')
      setCouponError('')
    } else {
      const eligibility = isOfferEligible(offer)
      if (eligibility.eligible) {
        const discount = calculateDiscount(offer)
        setSelectedOffer(offer)
        onOfferApply(offer, discount)
        setCouponCode(offer.code || '')
        setCouponError('')
      }
    }
  }

  const handleApplyCoupon = () => {
    setCouponError('')
    
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code')
      return
    }

    const matchingOffer = offers.find(
      offer => offer.code && offer.code.toUpperCase() === couponCode.trim().toUpperCase()
    )

    if (!matchingOffer) {
      setCouponError('Invalid coupon code')
      return
    }

    const eligibility = isOfferEligible(matchingOffer)
    if (!eligibility.eligible) {
      setCouponError(eligibility.reason || 'This coupon is not eligible')
      return
    }

    const discount = calculateDiscount(matchingOffer)
    setSelectedOffer(matchingOffer)
    onOfferApply(matchingOffer, discount)
  }

  const getDiscountDisplay = (offer: Offer) => {
    if (offer.discountType === 'percentage') {
      return (
        <div className="flex items-center gap-1">
          <Percent className="h-3 w-3" />
          <span>{offer.discountValue}% OFF</span>
        </div>
      )
    } else if (offer.discountType === 'fixed') {
      return (
        <div className="flex items-center gap-1">
          <DollarSign className="h-3 w-3" />
          <span>₹{offer.discountValue} OFF</span>
        </div>
      )
    } else {
      return (
        <div className="flex items-center gap-1">
          <Coins className="h-3 w-3" />
          <span>{offer.discountValue} Coins</span>
        </div>
      )
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tags className="h-5 w-5" />
            Available Offers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading offers...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (offers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tags className="h-5 w-5" />
            Available Offers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            No offers available at the moment.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tags className="h-5 w-5" />
          Available Offers
        </CardTitle>
        <CardDescription>Select an offer or enter a coupon code</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Coupon Code Input */}
        <div className="mb-4 p-3 border rounded-lg bg-muted/30">
          <Label htmlFor="coupon" className="text-sm font-medium mb-2 block">
            Have a coupon code?
          </Label>
          <div className="flex gap-2">
            <Input
              id="coupon"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value.toUpperCase())
                setCouponError('')
              }}
              className="flex-1"
            />
            <Button
              onClick={handleApplyCoupon}
              variant="default"
              size="default"
              disabled={!couponCode.trim()}
            >
              Apply
            </Button>
          </div>
          {couponError && (
            <p className="text-xs text-destructive mt-2 flex items-center gap-1">
              <X className="h-3 w-3" />
              {couponError}
            </p>
          )}
        </div>

        <Separator className="my-4" />

        <p className="text-sm font-medium mb-3">Or choose from available offers:</p>
        <div 
          className="space-y-3 max-h-[420px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent"
        >
          {offers.map((offer) => {
            const eligibility = isOfferEligible(offer)
            const isSelected = selectedOffer?.id === offer.id
            const discount = calculateDiscount(offer)

            return (
              <div
                key={offer.id}
                className={`p-3 border-2 rounded-lg transition-all cursor-pointer ${
                  !eligibility.eligible
                    ? 'border-border bg-muted/30 opacity-60 cursor-not-allowed'
                    : isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => eligibility.eligible && handleOfferSelect(offer)}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 ${!eligibility.eligible ? 'opacity-50' : ''}`}>
                    {eligibility.eligible ? (
                      isSelected ? (
                        <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </div>
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-border" />
                      )
                    ) : (
                      <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center">
                        <X className="h-3 w-3 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <p className={`font-medium ${!eligibility.eligible ? 'text-muted-foreground' : ''}`}>
                          {offer.name}
                        </p>
                        {offer.code && (
                          <p className="text-xs text-muted-foreground font-mono mt-0.5">
                            Code: {offer.code}
                          </p>
                        )}
                      </div>
                      <Badge
                        variant={eligibility.eligible ? 'default' : 'secondary'}
                        className="text-xs font-semibold"
                      >
                        {getDiscountDisplay(offer)}
                      </Badge>
                    </div>

                    <p className={`text-sm mb-2 ${!eligibility.eligible ? 'text-muted-foreground' : ''}`}>
                      {offer.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <Badge variant="outline" className="font-normal">
                        {offer.type === 'sitewide' ? 'Sitewide' : 
                         offer.type === 'product' ? 'Product Specific' :
                         offer.type === 'payment_method' ? 'Payment Method' :
                         offer.type === 'category' ? 'Category' : 'Combo'}
                      </Badge>
                      
                      {offer.minPurchaseAmount && (
                        <span className="text-muted-foreground">
                          Min: ₹{offer.minPurchaseAmount}
                        </span>
                      )}

                      {offer.maxDiscountAmount && offer.discountType === 'percentage' && (
                        <span className="text-muted-foreground">
                          Max: ₹{offer.maxDiscountAmount}
                        </span>
                      )}

                      <span className="text-muted-foreground">
                        Valid till {formatDate(offer.endDate)}
                      </span>
                    </div>

                    {!eligibility.eligible && eligibility.reason && (
                      <div className="mt-2 text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                        <X className="h-3 w-3" />
                        {eligibility.reason}
                      </div>
                    )}

                    {isSelected && eligibility.eligible && (
                      <div className="mt-2 p-2 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-900">
                        <p className="text-xs text-green-800 dark:text-green-200 font-medium flex items-center gap-1">
                          <Check className="h-3 w-3" />
                          You save ₹{discount} with this offer!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {selectedOffer && (
          <div className="mt-4 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                setSelectedOffer(null)
                onOfferApply(null, 0)
                setCouponCode('')
                setCouponError('')
              }}
            >
              Remove Offer
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
