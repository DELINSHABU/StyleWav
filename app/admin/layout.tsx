import type React from "react"
import type { Metadata } from "next"
import { AdminHeader } from "@/components/admin/admin-header"

export const metadata: Metadata = {
  title: "Admin Panel - StyleWav",
  description: "StyleWav Admin Panel for managing products and orders",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      {children}
    </div>
  )
}
