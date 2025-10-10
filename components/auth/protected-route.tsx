'use client'

import { useAuth } from '@/lib/auth-context'
import { useEffect, useState } from 'react'
import { AuthModal } from './auth-modal'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { currentUser } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    if (!currentUser) {
      setShowAuthModal(true)
    } else {
      setShowAuthModal(false)
    }
  }, [currentUser])

  if (!currentUser) {
    return (
      <>
        {fallback || (
          <div className="container mx-auto px-4 py-16 text-center">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-muted-foreground mb-8">
              You need to be logged in to access this page.
            </p>
          </div>
        )}
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          defaultTab="login"
        />
      </>
    )
  }

  return <>{children}</>
}