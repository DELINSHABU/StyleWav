import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const ABOUT_FILE = path.join(process.cwd(), 'jsonDatabase', 'about.json')

const defaultContent = {
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

export async function GET() {
  try {
    // Check if file exists
    try {
      const data = await fs.readFile(ABOUT_FILE, 'utf-8')
      return NextResponse.json(JSON.parse(data))
    } catch (error) {
      // File doesn't exist, return default content
      return NextResponse.json(defaultContent)
    }
  } catch (error) {
    console.error('Error reading about content:', error)
    return NextResponse.json(defaultContent)
  }
}

export async function POST(request: Request) {
  try {
    const content = await request.json()
    
    // Ensure jsonDatabase directory exists
    const dbDir = path.join(process.cwd(), 'jsonDatabase')
    try {
      await fs.access(dbDir)
    } catch {
      await fs.mkdir(dbDir, { recursive: true })
    }
    
    // Save content
    await fs.writeFile(ABOUT_FILE, JSON.stringify(content, null, 2))
    
    return NextResponse.json({ success: true, message: 'About content saved successfully' })
  } catch (error) {
    console.error('Error saving about content:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to save about content' },
      { status: 500 }
    )
  }
}
