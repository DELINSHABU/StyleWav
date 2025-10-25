'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface JobListing {
  id: string
  title: string
  department: string
  location: string
  type: string
  description: string
  requirements: string[]
}

export function AdminCareers() {
  const [jobs, setJobs] = useState<JobListing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const { toast } = useToast()

  const emptyJob: JobListing = {
    id: '',
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    description: '',
    requirements: ['']
  }

  const [formData, setFormData] = useState<JobListing>(emptyJob)

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
      const response = await fetch('/api/admin/careers')
      if (response.ok) {
        const data = await response.json()
        setJobs(data)
      }
    } catch (error) {
      console.error('Error loading jobs:', error)
      toast({
        title: 'Error',
        description: 'Failed to load job listings',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const saveJobs = async (updatedJobs: JobListing[]) => {
    try {
      const response = await fetch('/api/admin/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedJobs)
      })

      if (response.ok) {
        setJobs(updatedJobs)
        toast({
          title: 'Success',
          description: 'Careers data saved successfully'
        })
        return true
      }
      return false
    } catch (error) {
      console.error('Error saving jobs:', error)
      toast({
        title: 'Error',
        description: 'Failed to save careers data',
        variant: 'destructive'
      })
      return false
    }
  }

  const handleAddNew = () => {
    setIsAdding(true)
    setEditingId(null)
    setFormData({ ...emptyJob, id: Date.now().toString() })
  }

  const handleEdit = (job: JobListing) => {
    setEditingId(job.id)
    setIsAdding(false)
    setFormData({ ...job })
  }

  const handleSave = async () => {
    if (!formData.title || !formData.department || !formData.location) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    let updatedJobs: JobListing[]
    if (isAdding) {
      updatedJobs = [...jobs, formData]
    } else {
      updatedJobs = jobs.map(job => job.id === formData.id ? formData : job)
    }

    const success = await saveJobs(updatedJobs)
    if (success) {
      setIsAdding(false)
      setEditingId(null)
      setFormData(emptyJob)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job listing?')) return

    const updatedJobs = jobs.filter(job => job.id !== id)
    await saveJobs(updatedJobs)
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setFormData(emptyJob)
  }

  const updateRequirement = (index: number, value: string) => {
    const newReqs = [...formData.requirements]
    newReqs[index] = value
    setFormData({ ...formData, requirements: newReqs })
  }

  const addRequirement = () => {
    setFormData({ ...formData, requirements: [...formData.requirements, ''] })
  }

  const removeRequirement = (index: number) => {
    const newReqs = formData.requirements.filter((_, i) => i !== index)
    setFormData({ ...formData, requirements: newReqs })
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
        <div>
          <p className="text-sm text-muted-foreground">
            {jobs.length} open {jobs.length === 1 ? 'position' : 'positions'}
          </p>
        </div>
        {!isAdding && !editingId && (
          <Button onClick={handleAddNew}>
            <Plus className="h-4 w-4 mr-2" />
            Add Job Posting
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>{isAdding ? 'Add New Job Posting' : 'Edit Job Posting'}</CardTitle>
            <CardDescription>Fill in the job details below</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Senior Frontend Developer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g. Engineering"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Remote or New York, NY"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the role..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Requirements</Label>
                <Button type="button" variant="outline" size="sm" onClick={addRequirement}>
                  <Plus className="h-3 w-3 mr-1" />
                  Add Requirement
                </Button>
              </div>
              {formData.requirements.map((req, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={req}
                    onChange={(e) => updateRequirement(index, e.target.value)}
                    placeholder="e.g. 5+ years experience"
                  />
                  {formData.requirements.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRequirement(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Job Listings */}
      <div className="grid gap-4">
        {jobs.map((job) => (
          <Card key={job.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{job.title}</CardTitle>
                  <CardDescription className="mt-1">{job.description}</CardDescription>
                </div>
                <Badge variant="secondary">{job.department}</Badge>
              </div>
              <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                <span>📍 {job.location}</span>
                <span>⏰ {job.type}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div>
                <h4 className="font-semibold mb-2 text-sm">Requirements:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {job.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleEdit(job)}>
                <Pencil className="h-3 w-3 mr-1" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDelete(job.id)}>
                <Trash2 className="h-3 w-3 mr-1" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {jobs.length === 0 && !isAdding && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No job postings yet. Click "Add Job Posting" to create one.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
