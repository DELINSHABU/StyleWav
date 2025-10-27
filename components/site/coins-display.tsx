"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { Coins } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function CoinsDisplay() {
  const { currentUser } = useAuth()
  const [coinBalance, setCoinBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentUser?.uid) {
      fetchCoinBalance()
    } else {
      setLoading(false)
      setCoinBalance(null)
    }
  }, [currentUser])

  const fetchCoinBalance = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/coins?customerId=${currentUser?.uid}`)
      const data = await response.json()
      
      if (data.success && data.data) {
        setCoinBalance(data.data.balance)
      }
    } catch (error) {
      console.error('Error fetching coin balance:', error)
    } finally {
      setLoading(false)
    }
  }

  // Expose refresh function for external use
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).refreshCoins = fetchCoinBalance
    }
  }, [currentUser])

  if (!currentUser || loading) {
    return null
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href="/coins">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Coins className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">{coinBalance ?? 0}</span>
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Your coin balance</p>
          <p className="text-xs text-muted-foreground">Click to recharge or view history</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
