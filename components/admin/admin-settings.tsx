"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Save, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface HeroSettings {
  heading: {
    line1: string
    line2: string
    line3: string
  }
  description: string
  stats: {
    customers: string
    customersLabel: string
    rating: string
    ratingLabel: string
  }
}

export function AdminSettings() {
  const [settings, setSettings] = useState<HeroSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data.hero)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!settings) return

    setSaving(true)
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hero: settings })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Settings saved successfully"
        })
      } else {
        throw new Error('Failed to save')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!settings) return null

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hero Section Settings</CardTitle>
          <CardDescription>
            Update the main banner text and statistics on your homepage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Heading Lines */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Hero Heading</h3>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="line1">Line 1</Label>
                <Input
                  id="line1"
                  value={settings.heading.line1}
                  onChange={(e) => setSettings({
                    ...settings,
                    heading: { ...settings.heading, line1: e.target.value }
                  })}
                  placeholder="Bold."
                />
              </div>
              <div>
                <Label htmlFor="line2">Line 2</Label>
                <Input
                  id="line2"
                  value={settings.heading.line2}
                  onChange={(e) => setSettings({
                    ...settings,
                    heading: { ...settings.heading, line2: e.target.value }
                  })}
                  placeholder="Graphic."
                />
              </div>
              <div>
                <Label htmlFor="line3">Line 3</Label>
                <Input
                  id="line3"
                  value={settings.heading.line3}
                  onChange={(e) => setSettings({
                    ...settings,
                    heading: { ...settings.heading, line3: e.target.value }
                  })}
                  placeholder="Oversized."
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={settings.description}
              onChange={(e) => setSettings({
                ...settings,
                description: e.target.value
              })}
              placeholder="Make waves with StyleWav..."
              rows={3}
            />
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Statistics</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customers">Customers Count</Label>
                <Input
                  id="customers"
                  value={settings.stats.customers}
                  onChange={(e) => setSettings({
                    ...settings,
                    stats: { ...settings.stats, customers: e.target.value }
                  })}
                  placeholder="50K+"
                />
              </div>
              <div>
                <Label htmlFor="customersLabel">Customers Label</Label>
                <Input
                  id="customersLabel"
                  value={settings.stats.customersLabel}
                  onChange={(e) => setSettings({
                    ...settings,
                    stats: { ...settings.stats, customersLabel: e.target.value }
                  })}
                  placeholder="Happy Customers"
                />
              </div>
              <div>
                <Label htmlFor="rating">Rating</Label>
                <Input
                  id="rating"
                  value={settings.stats.rating}
                  onChange={(e) => setSettings({
                    ...settings,
                    stats: { ...settings.stats, rating: e.target.value }
                  })}
                  placeholder="4.9/5"
                />
              </div>
              <div>
                <Label htmlFor="ratingLabel">Rating Label</Label>
                <Input
                  id="ratingLabel"
                  value={settings.stats.ratingLabel}
                  onChange={(e) => setSettings({
                    ...settings,
                    stats: { ...settings.stats, ratingLabel: e.target.value }
                  })}
                  placeholder="Customer Rating"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
