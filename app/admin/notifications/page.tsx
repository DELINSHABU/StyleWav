"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Bell, Send, Users, Gift, Tag, Tags } from "lucide-react"
import { toast } from "sonner"
import type { Offer } from "@/lib/database-types"

type NotificationType = 'coin_gift' | 'offer' | 'order_update' | 'system' | 'promotion'
type ActionType = 'broadcast' | 'sendToOne' | 'sendToMultiple'

export default function AdminNotificationsPage() {
  const [notificationType, setNotificationType] = useState<NotificationType>('offer')
  const [actionType, setActionType] = useState<ActionType>('broadcast')
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [link, setLink] = useState("")
  const [customerId, setCustomerId] = useState("")
  const [customerIds, setCustomerIds] = useState("")
  const [sending, setSending] = useState(false)
  const [offers, setOffers] = useState<Offer[]>([])
  const [loadingOffers, setLoadingOffers] = useState(true)

  useEffect(() => {
    loadOffers()
  }, [])

  const loadOffers = async () => {
    try {
      const response = await fetch('/api/admin/offers?active=true')
      if (response.ok) {
        const data = await response.json()
        setOffers(data)
      }
    } catch (error) {
      console.error('Error loading offers:', error)
    } finally {
      setLoadingOffers(false)
    }
  }

  const handleSendNotification = async () => {
    if (!title || !message) {
      toast.error('Title and message are required')
      return
    }

    if (actionType === 'sendToOne' && !customerId) {
      toast.error('Customer ID is required for single customer notification')
      return
    }

    if (actionType === 'sendToMultiple' && !customerIds) {
      toast.error('Customer IDs are required for multiple customer notification')
      return
    }

    setSending(true)
    try {
      const requestBody: any = {
        action: actionType,
        type: notificationType,
        title,
        message,
        data: link ? { link } : undefined
      }

      if (actionType === 'sendToOne') {
        requestBody.customerId = customerId
      } else if (actionType === 'sendToMultiple') {
        requestBody.customerIds = customerIds.split(',').map(id => id.trim()).filter(id => id)
      }

      const response = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })

      const data = await response.json()

      if (data.success) {
        toast.success(
          actionType === 'broadcast'
            ? `Notification sent to ${data.data} customers`
            : data.message || 'Notification sent successfully'
        )
        // Reset form
        setTitle("")
        setMessage("")
        setLink("")
        setCustomerId("")
        setCustomerIds("")
      } else {
        toast.error(data.error || 'Failed to send notification')
      }
    } catch (error) {
      console.error('Error sending notification:', error)
      toast.error('An error occurred')
    } finally {
      setSending(false)
    }
  }

  const getDiscountText = (offer: Offer) => {
    if (offer.discountType === 'percentage') {
      return `${offer.discountValue}% OFF`
    } else if (offer.discountType === 'fixed') {
      return `₹${offer.discountValue} OFF`
    } else {
      return `${offer.discountValue} Coins Bonus`
    }
  }

  const notificationTemplates = [
    {
      type: 'offer' as NotificationType,
      title: '🔥 Flash Sale Alert!',
      message: 'Get 50% OFF on all products! Limited time offer. Shop now and save big!',
      link: '/products'
    },
    {
      type: 'promotion' as NotificationType,
      title: '✨ New Collection Launch',
      message: 'Check out our latest arrivals! Fresh styles just dropped.',
      link: '/products'
    },
    {
      type: 'coin_gift' as NotificationType,
      title: '🪙 Double Coins Event',
      message: 'Purchase any coin package and get 2x bonus coins! Valid for 24 hours.',
      link: '/coins'
    },
    // Add offer templates dynamically from database
    ...offers.map(offer => ({
      type: 'offer' as NotificationType,
      title: `🏷️ ${offer.name}`,
      message: `${offer.description} - ${getDiscountText(offer)}${offer.code ? ` Use code: ${offer.code}` : ''}`,
      link: '/checkout'
    }))
  ]

  const applyTemplate = (template: typeof notificationTemplates[0]) => {
    setNotificationType(template.type)
    setTitle(template.title)
    setMessage(template.message)
    setLink(template.link)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="h-8 w-8" />
            Notification Manager
          </h1>
          <p className="text-muted-foreground mt-2">
            Send offers, promotions, and updates to your customers
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Tags className="h-4 w-4" />
                Quick Notification
              </CardTitle>
              <CardDescription>Use pre-made templates or active offers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {loadingOffers ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-xs text-muted-foreground">Loading templates...</p>
                </div>
              ) : notificationTemplates.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No templates available</p>
              ) : (
                notificationTemplates.map((template, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3"
                    onClick={() => applyTemplate(template)}
                  >
                    <div className="space-y-1 w-full">
                      <div className="font-medium">{template.title}</div>
                      <div className="text-xs text-muted-foreground line-clamp-2">
                        {template.message}
                      </div>
                    </div>
                  </Button>
                ))
              )}
            </CardContent>
          </Card>

          {/* Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Create Notification</CardTitle>
              <CardDescription>Compose and send notifications to customers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Recipient Type */}
              <div className="space-y-2">
                <Label>Recipient</Label>
                <Select value={actionType} onValueChange={(value) => setActionType(value as ActionType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="broadcast">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Broadcast to All Customers
                      </div>
                    </SelectItem>
                    <SelectItem value="sendToOne">Send to One Customer</SelectItem>
                    <SelectItem value="sendToMultiple">Send to Multiple Customers</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Customer IDs (conditional) */}
              {actionType === 'sendToOne' && (
                <div className="space-y-2">
                  <Label htmlFor="customerId">Customer ID</Label>
                  <Input
                    id="customerId"
                    placeholder="Enter customer ID"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                  />
                </div>
              )}

              {actionType === 'sendToMultiple' && (
                <div className="space-y-2">
                  <Label htmlFor="customerIds">Customer IDs</Label>
                  <Input
                    id="customerIds"
                    placeholder="Enter customer IDs separated by commas"
                    value={customerIds}
                    onChange={(e) => setCustomerIds(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Example: user1, user2, user3
                  </p>
                </div>
              )}

              {/* Notification Type */}
              <div className="space-y-2">
                <Label>Notification Type</Label>
                <Select value={notificationType} onValueChange={(value) => setNotificationType(value as NotificationType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="offer">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-green-500" />
                        Offer / Discount
                      </div>
                    </SelectItem>
                    <SelectItem value="promotion">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-blue-500" />
                        Promotion / Announcement
                      </div>
                    </SelectItem>
                    <SelectItem value="coin_gift">
                      <div className="flex items-center gap-2">
                        <Gift className="h-4 w-4 text-yellow-500" />
                        Coin Gift / Bonus
                      </div>
                    </SelectItem>
                    <SelectItem value="order_update">Order Update</SelectItem>
                    <SelectItem value="system">System Message</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., 🔥 Flash Sale Alert!"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                />
                <p className="text-xs text-muted-foreground">
                  {title.length}/100 characters
                </p>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  placeholder="Enter your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground">
                  {message.length}/500 characters
                </p>
              </div>

              {/* Link (optional) */}
              <div className="space-y-2">
                <Label htmlFor="link">Link (Optional)</Label>
                <Input
                  id="link"
                  placeholder="/products, /coins, etc."
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Add a link for customers to take action
                </p>
              </div>

              {/* Preview */}
              {(title || message) && (
                <div className="border rounded-lg p-4 space-y-2 bg-muted/50">
                  <p className="text-xs font-medium text-muted-foreground">PREVIEW</p>
                  <div className="space-y-1">
                    <div className="font-semibold flex items-center gap-2">
                      {title}
                      <Badge variant="default" className="text-xs">New</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{message}</p>
                    {link && (
                      <p className="text-sm text-primary">View Details →</p>
                    )}
                  </div>
                </div>
              )}

              {/* Send Button */}
              <Button
                onClick={handleSendNotification}
                disabled={sending || !title || !message}
                className="w-full"
                size="lg"
              >
                <Send className="h-4 w-4 mr-2" />
                {sending ? 'Sending...' : 'Send Notification'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
