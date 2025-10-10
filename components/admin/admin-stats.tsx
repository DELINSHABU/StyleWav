"use client"

import { Product } from "@/lib/products"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, IndianRupee, TrendingUp, Users } from "lucide-react"

interface AdminStatsProps {
  products: Product[]
}

export function AdminStats({ products }: AdminStatsProps) {
  const totalProducts = products.length
  const totalValue = products.reduce((sum, product) => sum + product.price, 0)
  const averagePrice = totalProducts > 0 ? Math.round(totalValue / totalProducts) : 0

  const stats = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: Package,
      description: "Active products in store"
    },
    {
      title: "Total Inventory Value",
      value: `₹${totalValue.toLocaleString()}`,
      icon: IndianRupee,
      description: "Combined value of all products"
    },
    {
      title: "Average Price",
      value: `₹${averagePrice}`,
      icon: TrendingUp,
      description: "Average product price"
    },
    {
      title: "Categories",
      value: "5",
      icon: Users,
      description: "Product categories"
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}