import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const SETTINGS_FILE = path.join(process.cwd(), "jsonDatabase", "settings.json")

// GET - Fetch settings
export async function GET() {
  try {
    const data = await fs.readFile(SETTINGS_FILE, "utf-8")
    const settings = JSON.parse(data)
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error reading settings:", error)
    // Return default settings if file doesn't exist
    const defaultSettings = {
      hero: {
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
    }
    return NextResponse.json(defaultSettings)
  }
}

// PUT - Update settings
export async function PUT(request: Request) {
  try {
    const settings = await request.json()
    
    // Write to file
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf-8")
    
    return NextResponse.json({ 
      success: true, 
      message: "Settings updated successfully",
      data: settings 
    })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update settings" },
      { status: 500 }
    )
  }
}
