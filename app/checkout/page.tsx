'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/site/header'
import { Footer } from '@/components/site/footer'
import { useCart } from '@/hooks/use-cart'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, CreditCard, Truck, Shield, Smartphone, Coins as CoinsIcon, MapPin, Plus, Star } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AddressForm, AddressFormData } from '@/components/site/address-form'
import { OffersSection } from '@/components/checkout/offers-section'
import type { Offer } from '@/lib/database-types'

export default function CheckoutPage() {
  const { items, total } = useCart()
  const { toast } = useToast()
  const router = useRouter()
  const { currentUser } = useAuth()
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'coins'>('card')
  const [upiId, setUpiId] = useState('')
  const [coinsBalance, setCoinsBalance] = useState<number>(0)
  const [loadingCoins, setLoadingCoins] = useState(true)
  const [appliedOffer, setAppliedOffer] = useState<Offer | null>(null)
  const [offerDiscount, setOfferDiscount] = useState<number>(0)
  const [isAddressAutoFilled, setIsAddressAutoFilled] = useState(false)
  const [savedAddresses, setSavedAddresses] = useState<any[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: ''
  })

  // Fetch coins balance and customer data
  useEffect(() => {
    const fetchCoinsBalance = async () => {
      if (currentUser) {
        try {
          const response = await fetch(`/api/coins?customerId=${currentUser.uid}`);
          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              setCoinsBalance(result.data.balance);
            }
          }
        } catch (error) {
          console.error('Error fetching coins:', error);
        } finally {
          setLoadingCoins(false);
        }
      } else {
        setLoadingCoins(false);
      }
    };

    const fetchCustomerData = async () => {
      if (currentUser && currentUser.email) {
        try {
          // Fetch customer addresses
          const encodedEmail = encodeURIComponent(currentUser.email);
          const addressResponse = await fetch(`/api/customers/${encodedEmail}/addresses`);
          
          if (addressResponse.ok) {
            const addressResult = await addressResponse.json();
            if (addressResult.success) {
              const addresses = addressResult.data.addresses || [];
              const defaultAddress = addressResult.data.defaultShippingAddress;
              
              setSavedAddresses(addresses);
              
              // If there's a default address, select it and pre-fill form
              if (defaultAddress) {
                setSelectedAddressId(defaultAddress.id);
                fillFormWithAddress(defaultAddress);
                setIsAddressAutoFilled(true);
                console.log('Default address auto-selected');
              } else if (addresses.length > 0) {
                // If no default but addresses exist, select the first one
                setSelectedAddressId(addresses[0].id);
                fillFormWithAddress(addresses[0]);
              }
            }
          }
          
          // Also fetch customer data for email if not in address
          const customerResponse = await fetch(`/api/customers/${encodedEmail}`);
          if (customerResponse.ok) {
            const customerResult = await customerResponse.json();
            if (customerResult.success && customerResult.data) {
              const customer = customerResult.data;
              // Update form with customer email if address doesn't have it
              if (!formData.email) {
                setFormData(prev => ({
                  ...prev,
                  email: customer.email || currentUser.email || prev.email,
                }));
              }
            }
          }
        } catch (error) {
          console.error('Error fetching customer data:', error);
        }
      }
    };

    const fillFormWithAddress = (address: any) => {
      setFormData({
        firstName: address.firstName || '',
        lastName: address.lastName || '',
        email: address.email || currentUser?.email || '',
        phone: address.phone || '',
        address: address.address || '',
        city: address.city || '',
        state: address.state || '',
        zipCode: address.zipCode || '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardHolder: ''
      });
    };

    fetchCoinsBalance();
    fetchCustomerData();
  }, [currentUser]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
    const selectedAddress = savedAddresses.find(addr => addr.id === addressId);
    if (selectedAddress) {
      fillFormWithAddress(selectedAddress);
    }
  }

  const fillFormWithAddress = (address: any) => {
    setFormData({
      firstName: address.firstName || '',
      lastName: address.lastName || '',
      email: address.email || currentUser?.email || '',
      phone: address.phone || '',
      address: address.address || '',
      city: address.city || '',
      state: address.state || '',
      zipCode: address.zipCode || '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardHolder: ''
    });
  }

  const handleAddNewAddress = async (data: AddressFormData) => {
    if (!currentUser?.email) return;
    
    try {
      const response = await fetch(`/api/customers/${encodeURIComponent(currentUser.email)}/addresses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Address added",
          description: "Your address has been successfully added."
        });
        setIsAddressModalOpen(false);
        // Refresh addresses
        const addressResponse = await fetch(`/api/customers/${encodeURIComponent(currentUser.email)}/addresses`);
        if (addressResponse.ok) {
          const addressResult = await addressResponse.json();
          if (addressResult.success) {
            const addresses = addressResult.data.addresses || [];
            setSavedAddresses(addresses);
            // Select the newly added address
            if (addresses.length > 0) {
              const newAddress = addresses[addresses.length - 1];
              setSelectedAddressId(newAddress.id);
              fillFormWithAddress(newAddress);
            }
          }
        }
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to add address",
        description: error.message
      });
    }
  }

  const handleOfferApply = (offer: Offer | null, discount: number) => {
    setAppliedOffer(offer)
    setOfferDiscount(discount)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode']
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData].trim())
    
    if (missingFields.length > 0) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields."
      })
      return
    }

    if (items.length === 0) {
      toast({
        variant: "destructive",
        title: "Empty Cart",
        description: "Your cart is empty. Add some items before checking out."
      })
      return
    }

    // Validate coins payment
    if (paymentMethod === 'coins') {
      if (!currentUser) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "Please sign in to use coins payment."
        })
        return
      }
      
      const shippingCost = total >= 999 ? 0 : 99
      const finalTotal = total + shippingCost
      
      if (coinsBalance < finalTotal) {
        toast({
          variant: "destructive",
          title: "Insufficient Coins",
          description: `You need ${finalTotal.toLocaleString()} coins but only have ${coinsBalance.toLocaleString()} coins.`
        })
        return
      }
    }

    setIsProcessing(true)
    
    // Calculate shipping and total with offer discount
    const shippingCost = total >= 999 ? 0 : 99
    const subtotalAfterDiscount = total - offerDiscount
    const finalTotal = subtotalAfterDiscount + shippingCost
    
    console.log('🛒 Starting checkout process...')
    console.log(`📊 Order summary: Items: ${items.length}, Subtotal: ₹${total}, Shipping: ₹${shippingCost}, Total: ₹${finalTotal}`)

    try {
      // Step 1: Create or get customer
      let customerId = ''
      console.log('👤 Creating/getting customer...')
      
      const customerData = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        }
      }
      
      const customerResponse = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      })
      
      if (!customerResponse.ok) {
        throw new Error(`Customer API failed: ${customerResponse.status}`)
      }
      
      const customerResult = await customerResponse.json()
      if (customerResult.success) {
        customerId = customerResult.data.id
        console.log('✅ Customer created/retrieved:', customerResult.data.email)
      } else {
        throw new Error('Customer creation failed: ' + customerResult.error)
      }
      
      // Step 2: Create order in database
      console.log('📝 Creating order...')
      
      const orderData = {
        customerId,
        customerEmail: formData.email,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.qty,
          image: item.image,
          size: item.size,
          color: item.color
        })),
        subtotal: total,
        discount: offerDiscount,
        appliedOfferId: appliedOffer?.id,
        shipping: shippingCost,
        total: finalTotal,
        status: 'confirmed' as const,
        paymentStatus: 'paid' as const,
        paymentMethod: paymentMethod === 'card' ? 'Credit Card' : paymentMethod === 'upi' ? 'UPI' : 'Coins',
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        }
      }
      
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })
      
      if (!orderResponse.ok) {
        throw new Error(`Order API failed: ${orderResponse.status}`)
      }
      
      const orderResult = await orderResponse.json()
      if (orderResult.success) {
        console.log('✅ Order created:', orderResult.data.orderNumber)
        
        // Store order info for thank you page
        sessionStorage.setItem('lastOrderNumber', orderResult.data.orderNumber)
        sessionStorage.setItem('customerEmail', formData.email)
      } else {
        throw new Error('Order creation failed: ' + orderResult.error)
      }
      
      // Step 2.5: Deduct coins if paying with coins
      if (paymentMethod === 'coins' && currentUser) {
        console.log('💰 Deducting coins from balance...')
        console.log('Deduction details:', {
          customerId: currentUser.uid,
          amount: finalTotal,
          orderNumber: orderResult.data.orderNumber
        })
        
        try {
          const coinsResponse = await fetch('/api/coins', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'deduct',
              customerId: currentUser.uid,
              customerEmail: formData.email,
              amount: finalTotal,
              description: `Payment for order ${orderResult.data.orderNumber}`,
              options: {
                orderId: orderResult.data.orderNumber
              }
            }),
          })
          
          const coinsResult = await coinsResponse.json()
          console.log('Coins API response:', coinsResult)
          
          if (!coinsResponse.ok || !coinsResult.success) {
            console.error('⚠️ Coins deduction failed:', coinsResult.error || 'Unknown error')
            // Don't fail the order, but log the issue
            toast({
              variant: 'destructive',
              title: 'Warning',
              description: 'Order placed but coins deduction may have failed. Contact support if needed.'
            })
          } else {
            console.log('✅ Coins deducted successfully. New balance:', coinsResult.data.balance)
          }
        } catch (coinsError) {
          console.error('⚠️ Coins deduction error:', coinsError)
        }
      }
      
      // Step 3: Update stock quantities
      console.log('📦 Updating inventory...')
      
      const stockResponse = await fetch('/api/products/stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      })
      
      if (!stockResponse.ok) {
        console.error('⚠️ Stock update failed, but order was created')
      } else {
        const stockResult = await stockResponse.json()
        console.log('✅ Stock update result:', stockResult.message)
      }
      
      // Success! Show confirmation and redirect
      const paymentMethodText = paymentMethod === 'coins' 
        ? `Paid with ${finalTotal} coins` 
        : paymentMethod === 'upi' 
        ? 'Paid via UPI' 
        : 'Paid with card'
      
      toast({
        title: "Order Placed Successfully! 🎉",
        description: `Order ${orderResult.data.orderNumber} has been confirmed. ${paymentMethodText}. Redirecting...`
      })
      
      console.log('🎉 Checkout completed successfully!')
      
      // Small delay for user to see success message, then redirect
      setTimeout(() => {
        router.push('/thank-you')
      }, 1000)
      
    } catch (error) {
      console.error('❌ Checkout failed:', error)
      
      toast({
        variant: "destructive",
        title: "Order Failed",
        description: error instanceof Error ? error.message : "There was an error processing your order. Please try again."
      })
      
      setIsProcessing(false)
    }
  }

  // Redirect to cart if empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Add some items to your cart before checking out.
          </p>
          <Button asChild>
            <Link href="/">Continue Shopping</Link>
          </Button>
        </main>
        <Footer />
      </div>
    )
  }

  const shippingCost = total >= 999 ? 0 : 99
  const subtotalAfterDiscount = total - offerDiscount
  const finalTotal = subtotalAfterDiscount + shippingCost

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/cart" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Link>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Offers at top, Shipping Information at bottom */}
            <div className="space-y-6">
              {/* Offers Section */}
              <OffersSection
                subtotal={total}
                paymentMethod={paymentMethod}
                cartItems={items}
                onOfferApply={handleOfferApply}
              />

              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Shipping Information
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAddressModalOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New Address
                    </Button>
                  </div>
                  {isAddressAutoFilled && savedAddresses.length > 0 && (
                    <div className="mt-2 p-2 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
                      <p className="text-xs text-green-800 dark:text-green-200 flex items-center gap-1">
                        ✓ Your saved address has been loaded.
                      </p>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {savedAddresses.length > 0 ? (
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Select a saved address:</Label>
                      <RadioGroup value={selectedAddressId || ''} onValueChange={handleAddressSelect}>
                        {savedAddresses.map((address) => (
                          <label
                            key={address.id}
                            className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              selectedAddressId === address.id
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-medium">
                                  {address.firstName} {address.lastName}
                                </p>
                                {address.isDefault && (
                                  <Badge variant="secondary" className="text-xs">
                                    <Star className="h-3 w-3 mr-1" />
                                    Default
                                  </Badge>
                                )}
                              </div>
                              {address.email && (
                                <p className="text-sm text-muted-foreground">{address.email}</p>
                              )}
                              {address.phone && (
                                <p className="text-sm text-muted-foreground">{address.phone}</p>
                              )}
                              <p className="text-sm text-muted-foreground mt-1">{address.address}</p>
                              <p className="text-sm text-muted-foreground">
                                {address.city}, {address.state} {address.zipCode}
                              </p>
                            </div>
                          </label>
                        ))}
                      </RadioGroup>
                    </div>
                  ) : (
                    <div className="text-center py-8 border-2 border-dashed rounded-lg">
                      <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                      <p className="text-muted-foreground mb-2">No saved addresses</p>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => setIsAddressModalOpen(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Address
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Add Address Modal */}
              <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Shipping Address</DialogTitle>
                    <DialogDescription>
                      Add a new delivery address for this order.
                    </DialogDescription>
                  </DialogHeader>
                  <AddressForm
                    onSubmit={handleAddNewAddress}
                    onCancel={() => setIsAddressModalOpen(false)}
                    submitLabel="Add Address"
                  />
                </DialogContent>
              </Dialog>

              {/* Hidden fields to maintain form data - only shown for debugging */}
              <Card className="hidden">
                <CardHeader>
                  <CardTitle>Form Data (Hidden)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Security & Shipping Info */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span>Secure 256-bit SSL encryption</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-blue-600" />
                      <span>Free shipping on orders over ₹999</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>30-day return policy</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Payment Method at top, Order Summary at bottom */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Payment Method Selection */}
                  <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                    <div className="space-y-3">
                      {/* Credit/Debit Card */}
                      <label 
                        className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          paymentMethod === 'card' 
                            ? 'border-[#0000D1]' 
                            : 'border-border hover:border-[#0000D1]/50'
                        }`}
                        style={{
                          backgroundColor: paymentMethod === 'card' ? 'rgba(0, 0, 209, 0.1)' : 'transparent'
                        }}
                      >
                        <RadioGroupItem value="card" id="card" />
                        <div className="flex-1 flex items-center gap-3">
                          <CreditCard className="h-5 w-5" style={{ color: paymentMethod === 'card' ? '#0000D1' : undefined }} />
                          <div>
                            <p className="font-medium" style={{ color: paymentMethod === 'card' ? '#0000D1' : undefined }}>
                              Credit / Debit Card
                            </p>
                            <p className="text-xs text-muted-foreground">Visa, Mastercard, Rupay</p>
                          </div>
                        </div>
                      </label>

                      {/* UPI */}
                      <label 
                        className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          paymentMethod === 'upi' 
                            ? 'border-[#008000]' 
                            : 'border-border hover:border-[#008000]/50'
                        }`}
                        style={{
                          backgroundColor: paymentMethod === 'upi' ? 'rgba(0, 128, 0, 0.1)' : 'transparent'
                        }}
                      >
                        <RadioGroupItem value="upi" id="upi" />
                        <div className="flex-1 flex items-center gap-3">
                          <Smartphone className="h-5 w-5" style={{ color: paymentMethod === 'upi' ? '#008000' : undefined }} />
                          <div>
                            <p className="font-medium" style={{ color: paymentMethod === 'upi' ? '#008000' : undefined }}>
                              UPI Payment
                            </p>
                            <p className="text-xs text-muted-foreground">Google Pay, PhonePe, Paytm</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">Demo</Badge>
                      </label>

                      {/* Coins */}
                      <label 
                        className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          paymentMethod === 'coins' 
                            ? 'border-yellow-500' 
                            : 'border-border hover:border-yellow-500/50'
                        }`}
                        style={{
                          backgroundColor: paymentMethod === 'coins' ? 'rgba(234, 179, 8, 0.1)' : 'transparent'
                        }}
                      >
                        <RadioGroupItem value="coins" id="coins" />
                        <div className="flex-1 flex items-center gap-3">
                          <CoinsIcon className="h-5 w-5 text-yellow-500" />
                          <div>
                            <p className="font-medium" style={{ color: paymentMethod === 'coins' ? '#eab308' : undefined }}>
                              Pay with Coins
                            </p>
                            <p className="text-xs text-muted-foreground">Use your reward coins</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-600">
                          {loadingCoins ? 'Loading...' : `${coinsBalance.toLocaleString()} Coins Available`}
                        </Badge>
                      </label>
                    </div>
                  </RadioGroup>

                  <Separator />

                  {/* Card Payment Form */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-4 animate-in fade-in-50 duration-300">
                      <div>
                        <Label htmlFor="cardHolder">Cardholder Name</Label>
                        <Input
                          id="cardHolder"
                          value={formData.cardHolder}
                          onChange={(e) => handleInputChange('cardHolder', e.target.value)}
                          placeholder="Name on card"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          value={formData.cardNumber}
                          onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            value={formData.expiryDate}
                            onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                            placeholder="MM/YY"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            value={formData.cvv}
                            onChange={(e) => handleInputChange('cvv', e.target.value)}
                            placeholder="123"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* UPI Payment Form */}
                  {paymentMethod === 'upi' && (
                    <div className="space-y-4 animate-in fade-in-50 duration-300">
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm text-center text-muted-foreground mb-3">
                          💡 This is a demo mode. In production, you'll be redirected to UPI payment gateway.
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="upiId">UPI ID (Optional)</Label>
                        <Input
                          id="upiId"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="yourname@upi"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1" type="button">
                          <img src="/placeholder.svg" alt="GPay" className="h-4 w-4 mr-2" />
                          Google Pay
                        </Button>
                        <Button variant="outline" className="flex-1" type="button">
                          <img src="/placeholder.svg" alt="PhonePe" className="h-4 w-4 mr-2" />
                          PhonePe
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Coins Payment Info */}
                  {paymentMethod === 'coins' && (
                    <div className="space-y-4 animate-in fade-in-50 duration-300">
                      {loadingCoins ? (
                        <div className="text-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                          <p className="text-sm text-muted-foreground mt-2">Loading coins balance...</p>
                        </div>
                      ) : !currentUser ? (
                        <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-200 dark:border-orange-900">
                          <p className="text-sm text-orange-800 dark:text-orange-200 text-center">
                            ⚠️ Please sign in to use coins payment
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-900">
                            <div className="flex items-center gap-3 mb-3">
                              <CoinsIcon className="h-6 w-6 text-yellow-600" />
                              <div>
                                <p className="font-semibold text-yellow-900 dark:text-yellow-100">Available Balance</p>
                                <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                                  {coinsBalance.toLocaleString()} Coins
                                </p>
                              </div>
                            </div>
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                              1 Coin = ₹1 • Total order: {finalTotal} coins needed
                            </p>
                          </div>
                          
                          {finalTotal > coinsBalance && (
                            <div className="bg-orange-50 dark:bg-orange-950/20 p-3 rounded-lg border border-orange-200 dark:border-orange-900">
                              <p className="text-sm text-orange-800 dark:text-orange-200">
                                ⚠️ Insufficient coins. You need {(finalTotal - coinsBalance).toLocaleString()} more coins.
                              </p>
                              <Link href="/coins" className="text-sm text-orange-600 dark:text-orange-400 underline mt-1 inline-block">
                                Buy more coins →
                              </Link>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Place Order Button */}
              <Button 
                onClick={handleSubmit} 
                className="w-full h-12 text-lg"
                disabled={isProcessing || (paymentMethod === 'coins' && (finalTotal > coinsBalance || !currentUser))}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    {paymentMethod === 'card' && <CreditCard className="h-5 w-5 mr-2" />}
                    {paymentMethod === 'upi' && <Smartphone className="h-5 w-5 mr-2" />}
                    {paymentMethod === 'coins' && <CoinsIcon className="h-5 w-5 mr-2" />}
                    {paymentMethod === 'coins' 
                      ? 'Pay with Coins' 
                      : 'Complete Purchase'
                    }
                  </>
                )}
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                By placing this order, you agree to our Terms of Service and Privacy Policy.
              </p>

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item, index) => (
                    <div key={`${item.id}-${item.size || 'no-size'}-${item.color || 'no-color'}-${index}`} className="flex items-center gap-3">
                      <img
                        src={item.image || "/placeholder.svg?height=60&width=60"}
                        alt={item.name}
                        className="h-15 w-15 rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <div className="flex gap-3 text-xs text-muted-foreground font-medium">
                          {item.size && (
                            <span>Size: {item.size}</span>
                          )}
                          {item.color && (
                            <span>Color: {item.color}</span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.qty} × ₹{item.price}
                        </p>
                      </div>
                      <p className="font-medium">₹{item.price * item.qty}</p>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>₹{total}</span>
                    </div>
                    {offerDiscount > 0 && (
                      <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                        <span>Offer Discount</span>
                        <span>-₹{offerDiscount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>₹{finalTotal}</span>
                    </div>
                    {offerDiscount > 0 && (
                      <div className="text-xs text-green-600 dark:text-green-400 text-right">
                        You saved ₹{offerDiscount}!
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}