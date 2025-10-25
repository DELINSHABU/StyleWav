"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Eye, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AboutContent {
  hero: {
    title: string
    subtitle: string
  }
  story: {
    title: string
    paragraphs: string[]
  }
  mission: {
    title: string
    items: {
      title: string
      description: string
    }[]
  }
  stats: {
    title: string
    items: {
      value: string
      label: string
    }[]
  }
  cta: {
    title: string
    subtitle: string
    buttonText: string
  }
}

const defaultContent: AboutContent = {
  hero: {
    title: "StyleWav",
    subtitle: "Where style meets the streets"
  },
  story: {
    title: "Our Story",
    paragraphs: [
      "Born from the streets and crafted for the culture, StyleWav is more than just a clothing brand—it's a movement. We believe that fashion should be accessible, expressive, and bold.",
      "Every piece we create is designed to make a statement, to turn heads, and to give you the confidence to be unapologetically yourself."
    ]
  },
  mission: {
    title: "Our Mission",
    items: [
      {
        title: "Quality First",
        description: "We source premium materials and work with skilled artisans to ensure every piece meets our high standards."
      },
      {
        title: "Sustainable Fashion",
        description: "We're committed to reducing our environmental impact through responsible manufacturing and sustainable practices."
      },
      {
        title: "Community Driven",
        description: "Your feedback shapes our designs. We listen, we adapt, and we create what you want to wear."
      }
    ]
  },
  stats: {
    title: "By The Numbers",
    items: [
      { value: "10K+", label: "Happy Customers" },
      { value: "500+", label: "Unique Designs" },
      { value: "5★", label: "Average Rating" }
    ]
  },
  cta: {
    title: "Join The Wave",
    subtitle: "Be part of something bigger. Shop the latest collection now.",
    buttonText: "Shop Now"
  }
}

export function AdminAbout() {
  const [content, setContent] = useState<AboutContent>(defaultContent)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/about')
      if (response.ok) {
        const data = await response.json()
        setContent(data)
      }
    } catch (error) {
      console.error('Error loading about content:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "About page content saved successfully",
        })
      } else {
        throw new Error('Failed to save')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save about page content",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const updateField = (section: keyof AboutContent, field: string, value: any) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const updateArrayField = (section: keyof AboutContent, field: string, index: number, key: string, value: string) => {
    setContent(prev => {
      const sectionData: any = prev[section]
      const items = [...sectionData[field]]
      items[index] = { ...items[index], [key]: value }
      return {
        ...prev,
        [section]: {
          ...sectionData,
          [field]: items
        }
      }
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button variant="outline" onClick={loadContent}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
        <Button variant="outline" asChild>
          <a href="/about" target="_blank">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </a>
        </Button>
      </div>

      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
          <CardDescription>Main landing section of the about page</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={content.hero.title}
              onChange={(e) => updateField('hero', 'title', e.target.value)}
              placeholder="StyleWav"
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              value={content.hero.subtitle}
              onChange={(e) => updateField('hero', 'subtitle', e.target.value)}
              placeholder="Where style meets the streets"
            />
          </div>
        </CardContent>
      </Card>

      {/* Story Section */}
      <Card>
        <CardHeader>
          <CardTitle>Story Section</CardTitle>
          <CardDescription>Tell your brand story</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={content.story.title}
              onChange={(e) => updateField('story', 'title', e.target.value)}
              placeholder="Our Story"
            />
          </div>
          {content.story.paragraphs.map((paragraph, index) => (
            <div key={index}>
              <Label>Paragraph {index + 1}</Label>
              <Textarea
                value={paragraph}
                onChange={(e) => {
                  const newParagraphs = [...content.story.paragraphs]
                  newParagraphs[index] = e.target.value
                  updateField('story', 'paragraphs', newParagraphs)
                }}
                rows={4}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Mission Section */}
      <Card>
        <CardHeader>
          <CardTitle>Mission Section</CardTitle>
          <CardDescription>Your mission and values</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={content.mission.title}
              onChange={(e) => updateField('mission', 'title', e.target.value)}
              placeholder="Our Mission"
            />
          </div>
          {content.mission.items.map((item, index) => (
            <Card key={index}>
              <CardContent className="pt-6 space-y-3">
                <div>
                  <Label>Mission {index + 1} - Title</Label>
                  <Input
                    value={item.title}
                    onChange={(e) => updateArrayField('mission', 'items', index, 'title', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Mission {index + 1} - Description</Label>
                  <Textarea
                    value={item.description}
                    onChange={(e) => updateArrayField('mission', 'items', index, 'description', e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Stats Section */}
      <Card>
        <CardHeader>
          <CardTitle>Statistics Section</CardTitle>
          <CardDescription>Show your achievements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={content.stats.title}
              onChange={(e) => updateField('stats', 'title', e.target.value)}
              placeholder="By The Numbers"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {content.stats.items.map((item, index) => (
              <Card key={index}>
                <CardContent className="pt-6 space-y-3">
                  <div>
                    <Label>Stat {index + 1} - Value</Label>
                    <Input
                      value={item.value}
                      onChange={(e) => updateArrayField('stats', 'items', index, 'value', e.target.value)}
                      placeholder="10K+"
                    />
                  </div>
                  <div>
                    <Label>Stat {index + 1} - Label</Label>
                    <Input
                      value={item.label}
                      onChange={(e) => updateArrayField('stats', 'items', index, 'label', e.target.value)}
                      placeholder="Happy Customers"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card>
        <CardHeader>
          <CardTitle>Call to Action</CardTitle>
          <CardDescription>Final section with CTA</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={content.cta.title}
              onChange={(e) => updateField('cta', 'title', e.target.value)}
              placeholder="Join The Wave"
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Textarea
              value={content.cta.subtitle}
              onChange={(e) => updateField('cta', 'subtitle', e.target.value)}
              rows={2}
            />
          </div>
          <div>
            <Label>Button Text</Label>
            <Input
              value={content.cta.buttonText}
              onChange={(e) => updateField('cta', 'buttonText', e.target.value)}
              placeholder="Shop Now"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
