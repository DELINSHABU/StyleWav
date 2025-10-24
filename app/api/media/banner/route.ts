import { NextResponse } from 'next/server'
import { getActiveBanner } from '@/lib/media-database'

// GET active banner (public endpoint)
export async function GET() {
  try {
    const banner = getActiveBanner()
    if (!banner) {
      return NextResponse.json({ error: 'No banner found' }, { status: 404 })
    }
    return NextResponse.json(banner)
  } catch (error) {
    console.error('Error fetching active banner:', error)
    return NextResponse.json({ error: 'Failed to fetch banner' }, { status: 500 })
  }
}
