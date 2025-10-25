"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  Package, 
  BarChart3, 
  Users, 
  Settings, 
  FileImage,
  ShoppingCart,
  Info,
  Briefcase
} from "lucide-react"

const sidebarItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: BarChart3,
  },
  {
    id: "products",
    label: "Products",
    icon: Package,
  },
  {
    id: "orders",
    label: "Orders",
    icon: ShoppingCart,
  },
  {
    id: "customers",
    label: "Customers",
    icon: Users,
  },
  {
    id: "media",
    label: "Media",
    icon: FileImage,
  },
  {
    id: "about",
    label: "About Us",
    icon: Info,
  },
  {
    id: "careers",
    label: "Careers",
    icon: Briefcase,
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
  },
]

interface AdminSidebarProps {
  activeItem: string
  onItemClick: (itemId: string) => void
}

export function AdminSidebar({ activeItem, onItemClick }: AdminSidebarProps) {

  return (
    <aside className="w-64 h-full border-r border-border bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/30">
      <div className="p-4 border-b border-border">
        <h1 className="text-lg font-semibold">StyleWav</h1>
      </div>
      <nav className="p-4 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={activeItem === item.id ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                activeItem === item.id && "bg-primary text-primary-foreground"
              )}
              onClick={() => onItemClick(item.id)}
            >
              <Icon className="h-4 w-4 mr-2" />
              {item.label}
            </Button>
          )
        })}
      </nav>
    </aside>
  )
}