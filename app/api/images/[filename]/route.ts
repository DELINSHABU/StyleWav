import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const UPLOAD_DIR = path.join(process.cwd(), 'jsonDatabase', 'imgOfProducts')

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params
    const filePath = path.join(UPLOAD_DIR, filename)

    // Check if file exists
    try {
      await fs.access(filePath)
    } catch {
      return new NextResponse('Image not found', { status: 404 })
    }

    // Read the file
    const imageBuffer = await fs.readFile(filePath)
    
    // Determine content type based on file extension
    const ext = path.extname(filename).toLowerCase()
    let contentType = 'image/jpeg' // default
    
    switch (ext) {
      case '.png':
        contentType = 'image/png'
        break
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg'
        break
      case '.gif':
        contentType = 'image/gif'
        break
      case '.webp':
        contentType = 'image/webp'
        break
    }

    // Return the image
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    })

  } catch (error) {
    console.error('Error serving image:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}