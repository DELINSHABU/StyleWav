'use client'

import { ProtectedRoute } from '@/components/auth/protected-route'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useState } from 'react'
import { updateProfile } from 'firebase/auth'
import { useToast } from '@/hooks/use-toast'
import { Header } from '@/components/site/header'
import { Footer } from '@/components/site/footer'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const profileSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address')
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const { currentUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: currentUser?.displayName || '',
      email: currentUser?.email || ''
    }
  })

  const handleUpdateProfile = async (data: ProfileFormData) => {
    if (!currentUser) return
    
    setIsLoading(true)
    try {
      await updateProfile(currentUser, {
        displayName: data.displayName
      })
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated."
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message || "Failed to update profile."
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto space-y-8">
            <div>
              <h1 className="text-3xl font-bold">Profile</h1>
              <p className="text-muted-foreground mt-2">
                Manage your account settings and preferences.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and profile information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={currentUser?.photoURL || ''} />
                    <AvatarFallback className="text-lg">
                      {currentUser?.displayName?.charAt(0)?.toUpperCase() || 
                       currentUser?.email?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-medium">
                      {currentUser?.displayName || 'Customer'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {currentUser?.email}
                    </p>
                  </div>
                </div>

                <Separator />

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleUpdateProfile)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your email" disabled {...field} />
                          </FormControl>
                          <p className="text-xs text-muted-foreground">
                            Email address cannot be changed directly. Contact support if needed.
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Updating..." : "Update Profile"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Your account details and status.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Account Created</p>
                    <p className="text-sm">
                      {currentUser?.metadata?.creationTime 
                        ? new Date(currentUser.metadata.creationTime).toLocaleDateString()
                        : 'Unknown'
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Sign In</p>
                    <p className="text-sm">
                      {currentUser?.metadata?.lastSignInTime 
                        ? new Date(currentUser.metadata.lastSignInTime).toLocaleDateString()
                        : 'Unknown'
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email Verified</p>
                    <p className="text-sm">
                      {currentUser?.emailVerified ? 'Yes' : 'No'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Provider</p>
                    <p className="text-sm capitalize">
                      {currentUser?.providerData[0]?.providerId.replace('.com', '') || 'Email'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  )
}