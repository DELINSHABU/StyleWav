import { NextRequest, NextResponse } from 'next/server'
import { getAllBanners, addBanner, updateBanner, deleteBanner, setActiveBanner } from '@/lib/media-database'

// GET all banners
export async function GET() {
  try {
    const banners = getAllBanners()
    return NextResponse.json(banners)
  } catch (error) {
    console.error('Error fetching banners:', error)
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 })
  }
}

// POST - Add new banner
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, alt, title, isActive } = body
    
    if (!url || !alt || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    const newBanner = addBanner({ url, alt, title, isActive: isActive ?? false })
    return NextResponse.json(newBanner, { status: 201 })
  } catch (error) {
    console.error('Error adding banner:', error)
    return NextResponse.json({ error: 'Failed to add banner' }, { status: 500 })
  }
}

// PUT - Update banner
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, action, ...updates } = body
    
    if (!id) {
      return NextResponse.json({ error: 'Banner ID is required' }, { status: 400 })
    }
    
    // Handle set active action
    if (action === 'setActive') {
      const success = setActiveBanner(id)
      if (!success) {
        return NextResponse.json({ error: 'Banner not found' }, { status: 404 })
      }
      return NextResponse.json({ success: true, message: 'Banner activated' })
    }
    
    // Handle regular update
    const updatedBanner = updateBanner(id, updates)
    if (!updatedBanner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 })
    }
    
    return NextResponse.json(updatedBanner)
  } catch (error) {
    console.error('Error updating banner:', error)
    return NextResponse.json({ error: 'Failed to update banner' }, { status: 500 })
  }
}

// DELETE - Remove banner
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Banner ID is required' }, { status: 400 })
    }
    
    const success = deleteBanner(id)
    if (!success) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, message: 'Banner deleted' })
  } catch (error) {
    console.error('Error deleting banner:', error)
    return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 })
  }
}
