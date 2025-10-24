"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { TrendingUp, Calendar } from "lucide-react"
import { Product } from "@/lib/products"
import { ProductRadarChart } from "@/components/charts/product-radar-chart"
import { ProductPieChart } from "@/components/charts/product-pie-chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface AdminDashboardProps {
  products: Product[]
}

interface OrdersOverTimeData {
  month: string
  orders: number
  revenue: number
}


export function AdminDashboard({ products }: AdminDashboardProps) {
  const [ordersData, setOrdersData] = useState<OrdersOverTimeData[]>([])
  const [allOrders, setAllOrders] = useState<any[]>([])
  const [timeRange, setTimeRange] = useState("6m")
  const [customStartDate, setCustomStartDate] = useState("")
  const [customEndDate, setCustomEndDate] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch orders
      const ordersResponse = await fetch('/api/orders')
      const ordersResult = await ordersResponse.json()
      
      if (ordersResult.success) {
        const orders = ordersResult.data
        setAllOrders(orders)
        processOrdersData(orders, timeRange)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const processOrdersData = (orders: any[], range: string) => {
    const now = new Date()
    let startDate: Date
    let endDate = now
    let groupByDay = false
    
    // Determine date range based on selection
    if (range === "1d") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      groupByDay = true
    } else if (range === "7d") {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      groupByDay = true
    } else if (range === "custom" && customStartDate && customEndDate) {
      startDate = new Date(customStartDate)
      endDate = new Date(customEndDate)
      const daysDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      groupByDay = daysDiff <= 31
    } else {
      // Month-based ranges
      let monthsCount = 6
      if (range === "3m") monthsCount = 3
      else if (range === "1m") monthsCount = 1
      else if (range === "12m") monthsCount = 12
      
      startDate = new Date(now.getFullYear(), now.getMonth() - monthsCount + 1, 1)
    }
    
    const monthsData: { [key: string]: { orders: number; revenue: number } } = {}
    
    // Initialize time periods
    if (groupByDay) {
      const currentDate = new Date(startDate)
      while (currentDate <= endDate) {
        const dateKey = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        monthsData[dateKey] = { orders: 0, revenue: 0 }
        currentDate.setDate(currentDate.getDate() + 1)
      }
    } else {
      // Group by months
      const monthsDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                         (endDate.getMonth() - startDate.getMonth()) + 1
      for (let i = 0; i < monthsDiff; i++) {
        const date = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1)
        const monthKey = date.toLocaleString('en-US', { month: 'short' })
        monthsData[monthKey] = { orders: 0, revenue: 0 }
      }
    }
    
    // Process each order
    orders.forEach((order: any) => {
      const orderDate = new Date(order.orderDate)
      
      // Filter orders within date range
      if (orderDate < startDate || orderDate > endDate) return
      
      const dateKey = groupByDay 
        ? orderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : orderDate.toLocaleString('en-US', { month: 'short' })
      
      if (monthsData[dateKey] !== undefined) {
        monthsData[dateKey].orders += 1
        monthsData[dateKey].revenue += order.total || 0
      }
    })
    
    // Convert to array format for chart
    const monthlyData: OrdersOverTimeData[] = Object.keys(monthsData).map(month => ({
      month,
      orders: monthsData[month].orders,
      revenue: monthsData[month].revenue
    }))
    
    setOrdersData(monthlyData)
  }
  
  // Handle time range change
  useEffect(() => {
    if (allOrders.length > 0) {
      processOrdersData(allOrders, timeRange)
    }
  }, [timeRange, customStartDate, customEndDate])
  
  const handleCustomDateApply = () => {
    if (customStartDate && customEndDate) {
      setTimeRange("custom")
    }
  }


  if (loading) {
    return (
      <div className="grid gap-6">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] bg-gray-100 rounded"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const chartConfig = {
    orders: {
      label: "Orders",
      color: "hsl(var(--chart-1))",
    },
    revenue: {
      label: "Revenue",
      color: "hsl(var(--chart-2))",
    }
  }

  return (
    <div className="grid gap-6">
      {/* Orders Over Time - Area Chart */}
      <Card>
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Orders Over Time
            </CardTitle>
            <CardDescription>
              Monthly orders and revenue trends
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                className="w-[160px] rounded-lg"
                aria-label="Select time range"
              >
                <SelectValue placeholder="Last 6 months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="1d" className="rounded-lg">
                  Today
                </SelectItem>
                <SelectItem value="7d" className="rounded-lg">
                  Last 7 days
                </SelectItem>
                <SelectItem value="1m" className="rounded-lg">
                  Last month
                </SelectItem>
                <SelectItem value="3m" className="rounded-lg">
                  Last 3 months
                </SelectItem>
                <SelectItem value="6m" className="rounded-lg">
                  Last 6 months
                </SelectItem>
                <SelectItem value="12m" className="rounded-lg">
                  Last 12 months
                </SelectItem>
                <SelectItem value="custom" className="rounded-lg">
                  Custom Range
                </SelectItem>
              </SelectContent>
            </Select>
            
            {timeRange === "custom" && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="rounded-lg">
                    <Calendar className="h-4 w-4 mr-2" />
                    Select Dates
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4">
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Start Date</label>
                      <Input
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        className="rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">End Date</label>
                      <Input
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        className="rounded-lg"
                      />
                    </div>
                    <Button onClick={handleCustomDateApply} className="rounded-lg">
                      Apply
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={ordersData}>
                <defs>
                  <linearGradient id="fillOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-chart-1)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-chart-1)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="month" 
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis 
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="var(--color-chart-1)"
                  fill="url(#fillOrders)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Responsive Grid for Charts - 2 columns on mobile, 3 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Product Category Performance - Radar Chart */}
        <ProductRadarChart />

        {/* Product Category Distribution - Pie Chart */}
        <ProductPieChart />
      </div>
    </div>
  )
}
