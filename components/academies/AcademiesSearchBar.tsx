"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import type { AcademyFilterOptions } from "@/types/academy"
import { Search, ChevronDown, Grid, List, MapPin } from "lucide-react"

interface AcademiesSearchBarProps {
  onFilterChange: (options: Partial<AcademyFilterOptions>) => void
  filterOptions: AcademyFilterOptions
  sortBy: string
  setSortBy: (value: string) => void
  viewMode: "grid" | "list" | "map"
  setViewMode: (mode: "grid" | "list" | "map") => void
  toggleFilterSidebar: () => void
}

export default function AcademiesSearchBar({
  onFilterChange,
  filterOptions,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  toggleFilterSidebar,
}: AcademiesSearchBarProps) {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const categoryDropdownRef = useRef<HTMLDivElement>(null)
  const sortDropdownRef = useRef<HTMLDivElement>(null)

  const categoryOptions = ["All Categories", "Badminton", "Tennis", "Football", "Basketball", "Swimming", "Cricket"]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false)
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setShowSortDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleCategorySelect = (category: string) => {
    onFilterChange({ category: category === "All Categories" ? "" : category })
    setShowCategoryDropdown(false)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFilterChange({ searchQuery })
  }

  const handleTabClick = (tab: string) => {
    onFilterChange({
      searchQuery: "",
      category: tab === "All" ? "" : tab,
    })
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-5 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search input */}
        <form onSubmit={handleSearchSubmit} className="flex flex-1">
          <div className="relative w-full flex items-center rounded-md overflow-hidden border border-gray-200">
            <div className="absolute left-3 text-gray-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by academy name, location..."
              className="w-full pl-10 pr-4 py-3 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-emerald-600 text-white px-5 py-3 font-medium hover:bg-emerald-700 transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Category Dropdown */}
        <div className="relative" ref={categoryDropdownRef}>
          <button
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="flex items-center justify-between w-full md:w-48 px-4 py-3 bg-white border border-gray-200 rounded-md text-gray-700"
          >
            <span>{filterOptions.category || "All Categories"}</span>
            <ChevronDown size={18} className="ml-2 text-gray-500" />
          </button>

          {showCategoryDropdown && (
            <div className="absolute z-20 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-100">
              {categoryOptions.map((category) => (
                <div
                  key={category}
                  className={`px-4 py-2 cursor-pointer text-gray-700 hover:bg-emerald-50 ${filterOptions.category === category ? "bg-emerald-50 font-medium" : ""}`}
                  onClick={() => handleCategorySelect(category)}
                >
                  {category}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sort By */}
        <div className="relative ml-auto" ref={sortDropdownRef}>
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center justify-between px-4 py-3 border border-gray-200 rounded-md text-gray-700"
          >
            <span>
              Sort By:{" "}
              {sortBy === "relevance"
                ? "Relevance"
                : sortBy === "price-low"
                  ? "Price: Low to High"
                  : sortBy === "price-high"
                    ? "Price: High to Low"
                    : "Rating"}
            </span>
            <ChevronDown size={18} className="ml-2 text-gray-500" />
          </button>

          {showSortDropdown && (
            <div className="absolute right-0 z-20 w-48 mt-1 bg-white rounded-md shadow-lg border border-gray-100">
              {[
                { id: "relevance", label: "Relevance" },
                { id: "price-low", label: "Price: Low to High" },
                { id: "price-high", label: "Price: High to Low" },
                { id: "rating", label: "Rating" },
              ].map((option) => (
                <div
                  key={option.id}
                  className={`px-4 py-2 cursor-pointer text-gray-700 hover:bg-emerald-50 ${sortBy === option.id ? "bg-emerald-50 font-medium" : ""}`}
                  onClick={() => {
                    setSortBy(option.id)
                    setShowSortDropdown(false)
                  }}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        {/* Tabs */}
        <div className="flex space-x-2">
          {["All", "Academies", "Coaches", "Turf"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`px-4 py-2 rounded-md transition-colors ${
                (tab === "All" && !filterOptions.category) || (tab === "Academies" && filterOptions.category === "")
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center">
          <span className="text-gray-500 mr-3">View as</span>
          <div className="flex border border-gray-200 rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${viewMode === "grid" ? "bg-emerald-500 text-white" : "bg-white text-gray-700"}`}
              aria-label="Grid view"
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${viewMode === "list" ? "bg-emerald-500 text-white" : "bg-white text-gray-700"}`}
              aria-label="List view"
            >
              <List size={20} />
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`p-2 ${viewMode === "map" ? "bg-emerald-500 text-white" : "bg-white text-gray-700"}`}
              aria-label="Map view"
            >
              <MapPin size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
