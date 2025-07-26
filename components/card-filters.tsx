"use client"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Card as CardType } from "@/app/data/page"

interface CardFiltersProps {
  cards: CardType[]
  onFilter: (searchTerm: string, rarity: string, type: string) => void
  resultsCount: number
}

export function CardFilters({ cards, onFilter, resultsCount }: CardFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRarity, setSelectedRarity] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  // Extract unique rarities from the actual card data
  const rarities = [...new Set(cards.map((card) => card.rarity).filter(Boolean))].sort()

  // Extract unique types from the actual card data
  const types = [...new Set(cards.flatMap((card) => card.types || []).filter(Boolean))].sort()

  // Memoize the filter function call to prevent infinite loops
  const applyFilters = useCallback(() => {
    onFilter(searchTerm, selectedRarity === "all" ? "" : selectedRarity, selectedType === "all" ? "" : selectedType)
  }, [searchTerm, selectedRarity, selectedType, onFilter])

  useEffect(() => {
    applyFilters()

    // Update active filters
    const filters = []
    if (searchTerm) filters.push(`Search: ${searchTerm}`)
    if (selectedRarity !== "all") filters.push(`Rarity: ${selectedRarity}`)
    if (selectedType !== "all") filters.push(`Type: ${selectedType}`)
    setActiveFilters(filters)
  }, [applyFilters, searchTerm, selectedRarity, selectedType])

  const clearAllFilters = () => {
    setSearchTerm("")
    setSelectedRarity("all")
    setSelectedType("all")
  }

  const removeFilter = (filterToRemove: string) => {
    if (filterToRemove.startsWith("Search:")) {
      setSearchTerm("")
    } else if (filterToRemove.startsWith("Rarity:")) {
      setSelectedRarity("all")
    } else if (filterToRemove.startsWith("Type:")) {
      setSelectedType("all")
    }
  }

  return (
    <Card className="bg-gray-900 border-gray-700 p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white text-xl font-bold flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
        </h3>
        {activeFilters.length > 0 && (
          <Button onClick={clearAllFilters} variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-gray-300 text-sm font-medium mb-3 block">Search Cards</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 pl-10"
            />
          </div>
        </div>

        <div>
          <label className="text-gray-300 text-sm font-medium mb-3 block">Rarity ({rarities.length} available)</label>
          <Select value={selectedRarity} onValueChange={setSelectedRarity}>
            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
              <SelectValue placeholder="All Rarities" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="all">All Rarities</SelectItem>
              {rarities.map((rarity) => (
                <SelectItem key={rarity} value={rarity}>
                  {rarity}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-gray-300 text-sm font-medium mb-3 block">Type ({types.length} available)</label>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="all">All Types</SelectItem>
              {types.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div>
            <label className="text-gray-300 text-sm font-medium mb-3 block">Active Filters</label>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-gray-700 text-gray-300 hover:bg-gray-600 cursor-pointer flex items-center gap-1"
                  onClick={() => removeFilter(filter)}
                >
                  {filter}
                  <X className="w-3 h-3" />
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              <span className="font-semibold text-white">{resultsCount}</span> cards found
            </p>
            <div className="text-xs text-gray-500">{cards.length} total</div>
          </div>

          {/* Show available rarities and types count */}
          <div className="mt-2 text-xs text-gray-500">
            <div>Rarities: {rarities.join(", ")}</div>
            <div className="mt-1">
              Types: {types.slice(0, 5).join(", ")}
              {types.length > 5 ? ` +${types.length - 5} more` : ""}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
