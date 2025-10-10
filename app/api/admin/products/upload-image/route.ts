import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const UPLOAD_DIR = path.join(process.cwd(), 'jsonDatabase', 'imgOfProducts')

// Ensure upload directory exists
async function ensureUploadDirExists() {
  try {
    await fs.access(UPLOAD_DIR)
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true })
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureUploadDirExists()

    const formData = await request.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP and GIF are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    // Get the original filename
    const originalName = file.name
    const timestamp = Date.now()
    
    // Create a unique filename while preserving the original name
    const fileExtension = path.extname(originalName)
    const nameWithoutExt = path.basename(originalName, fileExtension)
    
    // Clean the filename: remove special characters and spaces
    const cleanName = nameWithoutExt.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase()
    const finalFileName = `${cleanName}-${timestamp}${fileExtension}`
    
    const filePath = path.join(UPLOAD_DIR, finalFileName)

    // Convert File to Buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    await fs.writeFile(filePath, buffer)

    // Return the filename that will be used in the JSON
    const imageUrl = `/api/images/${finalFileName}`

    return NextResponse.json({
      success: true,
      filename: finalFileName,
      imageUrl: imageUrl,
      originalName: originalName
    })

  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}