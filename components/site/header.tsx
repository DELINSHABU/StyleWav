"use client"

import Link from "next/link"
import { useState } from "react"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/lib/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AuthModal } from "@/components/auth/auth-modal"
import { cn } from "@/lib/utils"
import { User, LogOut, ShoppingBag, Heart } from "lucide-react"

export function Header() {
  const { items, total, removeItem } = useCart()
  const { currentUser, logout } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login')
  const count = items.reduce((acc, it) => acc + it.qty, 0)

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const openAuthModal = (tab: 'login' | 'signup') => {
    setAuthModalTab(tab)
    setShowAuthModal(true)
  }

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold text-lg tracking-wide" aria-label="StyleWav Home">
            StyleWav
          </Link>
          <nav aria-label="Primary" className="hidden md:flex items-center gap-4 text-sm">
            <Link href="#" className="hover:opacity-80">
              Oversized
            </Link>
            <Link href="#" className="hover:opacity-80">
              Graphic Tees
            </Link>
            <Link href="#" className="hover:opacity-80">
              New Arrivals
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-sm hover:opacity-80 hidden md:inline-block bg-primary/10 px-2 py-1 rounded">
            Admin
          </Link>
          
          {currentUser ? (
            <>
              <Link href="/orders" className="text-sm hover:opacity-80 hidden md:inline-block">
                Track Order
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={currentUser.photoURL || ''} alt={currentUser.displayName || currentUser.email || ''} />
                      <AvatarFallback>
                        {currentUser.displayName 
                          ? currentUser.displayName.charAt(0).toUpperCase()
                          : currentUser.email?.charAt(0).toUpperCase()
                        }
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {currentUser.displayName || 'Customer'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {currentUser.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="flex items-center">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      <span>Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist" className="flex items-center">
                      <Heart className="mr-2 h-4 w-4" />
                      <span>Wishlist</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => openAuthModal('login')}
                className="text-sm hover:opacity-80"
              >
                Login
              </Button>
              <Button 
                size="sm"
                onClick={() => openAuthModal('signup')}
                className="text-sm"
              >
                Sign Up
              </Button>
            </>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className={cn("relative")}>
                Cart
                <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] px-1">
                  {count}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Your Cart</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-60 overflow-auto">
                {items.length === 0 ? (
                  <div className="text-sm text-muted-foreground p-4">Your cart is empty.</div>
                ) : (
                  items.map((it) => (
                    <div key={it.id} className="flex items-center gap-3 p-2">
                      <img
                        src={`/placeholder.svg?height=56&width=56&query=product-thumbnail`}
                        alt={`${it.name} thumbnail`}
                        className="h-14 w-14 rounded-md border border-border object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{it.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Qty {it.qty} · ₹{it.price}
                        </p>
                      </div>
                      <button
                        aria-label={`Remove ${it.name}`}
                        className="text-xs underline hover:opacity-80"
                        onClick={() => removeItem(it.id)}
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
              <DropdownMenuSeparator />
              <div className="p-3 flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-muted-foreground">Subtotal:</span> <span className="font-medium">₹{total}</span>
                </div>
                <Link href="/cart">
                  <Button size="sm">Checkout</Button>
                </Link>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        defaultTab={authModalTab}
      />
    </header>
  )
}
