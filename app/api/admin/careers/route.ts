import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const CAREERS_FILE = path.join(process.cwd(), 'jsonDatabase', 'careers.json')

export interface JobListing {
  id: string
  title: string
  department: string
  location: string
  type: string
  description: string
  requirements: string[]
}

const defaultJobs: JobListing[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description: 'Join our engineering team to build cutting-edge e-commerce experiences with Next.js and React.',
    requirements: ['5+ years React experience', 'Next.js expertise', 'TypeScript proficiency', 'E-commerce experience']
  },
  {
    id: '2',
    title: 'Fashion Designer',
    department: 'Design',
    location: 'New York, NY',
    type: 'Full-time',
    description: 'Create innovative streetwear designs that resonate with our community and push the boundaries of fashion.',
    requirements: ['3+ years fashion design', 'Portfolio required', 'Streetwear passion', 'Adobe Creative Suite']
  },
  {
    id: '3',
    title: 'Marketing Manager',
    department: 'Marketing',
    location: 'Los Angeles, CA',
    type: 'Full-time',
    description: 'Lead our marketing initiatives across social media, influencer partnerships, and brand campaigns.',
    requirements: ['5+ years marketing', 'Social media expertise', 'Fashion industry experience', 'Data-driven mindset']
  },
  {
    id: '4',
    title: 'Content Creator',
    department: 'Marketing',
    location: 'Remote',
    type: 'Part-time',
    description: 'Produce engaging content for our social channels including photography, videography, and copywriting.',
    requirements: ['Photography/videography skills', 'Social media savvy', 'Creative portfolio', 'Fashion interest']
  }
]

export async function GET() {
  try {
    try {
      const data = await fs.readFile(CAREERS_FILE, 'utf-8')
      return NextResponse.json(JSON.parse(data))
    } catch (error) {
      // File doesn't exist, return default jobs
      return NextResponse.json(defaultJobs)
    }
  } catch (error) {
    console.error('Error reading careers data:', error)
    return NextResponse.json(defaultJobs)
  }
}

export async function POST(request: Request) {
  try {
    const jobs = await request.json()
    
    // Ensure jsonDatabase directory exists
    const dbDir = path.join(process.cwd(), 'jsonDatabase')
    try {
      await fs.access(dbDir)
    } catch {
      await fs.mkdir(dbDir, { recursive: true })
    }
    
    // Save jobs
    await fs.writeFile(CAREERS_FILE, JSON.stringify(jobs, null, 2))
    
    return NextResponse.json({ success: true, message: 'Careers data saved successfully' })
  } catch (error) {
    console.error('Error saving careers data:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to save careers data' },
      { status: 500 }
    )
  }
}
