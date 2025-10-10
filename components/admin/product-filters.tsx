"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { FilterOptions } from "./product-manager"
import { Search, X, Filter, RotateCcw } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface ProductFiltersProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  categories: string[]
  productCount: number
  totalCount: number
}

export function ProductFilters({
  filters,
  onFiltersChange,
  categories,
  productCount,
  totalCount
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      category: '',
      stockStatus: '',
      searchTerm: ''
    })
  }

  const hasActiveFilters = filters.category || filters.stockStatus || filters.searchTerm

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.category) count++
    if (filters.stockStatus) count++
    if (filters.searchTerm) count++
    return count
  }

  const stockStatusOptions = [
    { value: 'in-stock', label: 'In Stock', color: 'bg-green-500' },
    { value: 'low-stock', label: 'Low Stock', color: 'bg-yellow-500' },
    { value: 'out-of-stock', label: 'Out of Stock', color: 'bg-red-500' },
    { value: 'unlimited', label: 'Unlimited Stock', color: 'bg-blue-500' }
  ]

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="hover:bg-muted/50">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {getActiveFilterCount()}
                  </Badge>
                )}
              </Button>
            </CollapsibleTrigger>
            
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear all
              </Button>
            )}
          </div>
          
          <div className="text-sm text-muted-foreground">
            Showing {productCount} of {totalCount} products
          </div>
        </div>

        <CollapsibleContent>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search Filter */}
              <div className="space-y-2">
                <Label htmlFor="search">Search by Name or ID</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search products..."
                    value={filters.searchTerm}
                    onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                    className="pl-9"
                  />
                  {filters.searchTerm && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
                      onClick={() => handleFilterChange('searchTerm', '')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={filters.category}
                  onValueChange={(value) => handleFilterChange('category', value === 'all' ? '' : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Stock Status Filter */}
              <div className="space-y-2">
                <Label>Stock Status</Label>
                <Select
                  value={filters.stockStatus}
                  onValueChange={(value) => handleFilterChange('stockStatus', value === 'all' ? '' : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All stock statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All stock statuses</SelectItem>
                    {stockStatusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${option.color}`} />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
                  
                  {filters.searchTerm && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      Search: "{filters.searchTerm}"
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-muted"
                        onClick={() => handleFilterChange('searchTerm', '')}
                      >
                        <X className="h-2 w-2" />
                      </Button>
                    </Badge>
                  )}
                  
                  {filters.category && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      Category: {filters.category}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-muted"
                        onClick={() => handleFilterChange('category', '')}
                      >
                        <X className="h-2 w-2" />
                      </Button>
                    </Badge>
                  )}
                  
                  {filters.stockStatus && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      Stock: {stockStatusOptions.find(opt => opt.value === filters.stockStatus)?.label}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-muted"
                        onClick={() => handleFilterChange('stockStatus', '')}
                      >
                        <X className="h-2 w-2" />
                      </Button>
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}