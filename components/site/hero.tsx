"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, TrendingUp, Heart } from "lucide-react"
import { BannerImage } from "@/lib/media-types"

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

export function Hero() {
  const [banner, setBanner] = useState<BannerImage | null>(null)
  const [settings, setSettings] = useState<HeroSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch banner
        const bannerResponse = await fetch('/api/media/banner')
        if (bannerResponse.ok) {
          const bannerData = await bannerResponse.json()
          setBanner(bannerData)
        }

        // Fetch settings
        const settingsResponse = await fetch('/api/settings')
        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json()
          setSettings(settingsData.hero)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Default banner if none is set
  const bannerUrl = banner?.url || '/placeholder.svg?height=600&width=500&query=stylish+person+wearing+oversized+graphic+tee'
  const bannerAlt = banner?.alt || 'Hero banner showing StyleWav graphic tees'

  // Default settings
  const heroSettings = settings || {
    heading: {
      line1: "Bold.",
      line2: "Graphic.",
      line3: "Oversized."
    },
    description: "Make waves with StyleWav. Street-ready tees and oversized fits crafted for comfort, style, and attitude.",
    stats: {
      customers: "50K+",
      customersLabel: "Happy Customers",
      rating: "4.9/5",
      ratingLabel: "Customer Rating"
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>
      
      <div className="container mx-auto px-4 pt-12 pb-16 md:pt-16 md:pb-24 relative">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Text Content */}
          <motion.div 
            className="order-2 md:order-1 space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Badge variant="secondary" className="mb-4 px-3 py-1 text-xs font-medium bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-all duration-300">
                <Sparkles className="w-3 h-3 mr-1" />
                New Collection Drop
              </Badge>
            </motion.div>

            {/* Main heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-pretty leading-tight tracking-tight">
                <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  {heroSettings.heading.line1}
                </span>
                {" "}
                <span className="bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
                  {heroSettings.heading.line2}
                </span>
                <br />
                <span className="bg-gradient-to-r from-foreground/90 to-foreground/60 bg-clip-text text-transparent">
                  {heroSettings.heading.line3}
                </span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground max-w-prose leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {heroSettings.description}
            </motion.p>

            {/* Stats */}
            <motion.div 
              className="flex items-center gap-6 py-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span><span className="font-semibold text-foreground">{heroSettings.stats.customers}</span> {heroSettings.stats.customersLabel}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Heart className="w-4 h-4 text-red-500" />
                <span><span className="font-semibold text-foreground">{heroSettings.stats.rating}</span> {heroSettings.stats.ratingLabel}</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row items-start gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
            >
              <Button 
                size="lg" 
                className="group bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 h-auto shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Shop Men
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="group border-2 border-border hover:border-primary px-8 py-3 h-auto font-semibold hover:bg-primary/5 transition-all duration-300"
              >
                Shop Women
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div 
            className="order-1 md:order-2 relative"
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <div className="relative group">
              {/* Background glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-60" />
              
              {/* Main image */}
              <motion.div
                className="relative bg-gradient-to-br from-secondary/10 to-primary/10 rounded-2xl overflow-hidden border border-border/50 shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
              >
                <img
                  src={bannerUrl}
                  alt={bannerAlt}
                  className="w-full h-[500px] md:h-[600px] object-cover"
                />
                
                {/* Floating badges */}
                <motion.div
                  className="absolute top-4 right-4"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                >
                  <Badge className="bg-white/90 text-foreground shadow-lg border border-white/20 backdrop-blur-sm">
                    New Arrival
                  </Badge>
                </motion.div>
                
                <motion.div
                  className="absolute bottom-4 left-4"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.4 }}
                >
                  <Badge variant="secondary" className="bg-black/80 text-white shadow-lg border border-white/10 backdrop-blur-sm">
                    Limited Edition
                  </Badge>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
