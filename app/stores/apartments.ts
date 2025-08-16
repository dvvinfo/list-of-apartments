import { defineStore } from 'pinia'
import type { Apartment, FilterState, FilterParams, ApiResponse } from '~/types'

export const useApartmentsStore = defineStore('apartments', () => {
  const apartments = ref<Apartment[]>([])
  const loading = ref(false)
  const hasMore = ref(true)
  const total = ref(0)
  
  const filters = ref<FilterState>({
    priceRange: [5500000, 18900000],
    areaRange: [33, 123],
    rooms: null
  })

  const currentOffset = ref(0)
  const itemsPerPage = 20

  // Simulate API call
  const fetchApartments = async (params: FilterParams): Promise<ApiResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // This would be replaced with actual API call
    // For now, we'll use mock data
    const mockApartments: Apartment[] = Array.from({ length: 100 }, (_, i) => ({
      id: `apt-${i + 1}`,
      title: `3-комнатная №${String(i + 104).padStart(3, '0')}`,
      area: Math.round(63 + Math.random() * 20),
      floor: Math.floor(Math.random() * 17) + 1,
      totalFloors: 17,
      price: Math.round((6600000 + Math.random() * 100000) / 1000) * 1000,
      rooms: 3
    }))

    // Filter mock data based on params
    const filtered = mockApartments.filter(apt => 
      apt.price >= params.priceMin &&
      apt.price <= params.priceMax &&
      apt.area >= params.areaMin &&
      apt.area <= params.areaMax &&
      (!params.rooms || apt.rooms === params.rooms)
    )

    const start = params.offset
    const end = start + params.limit
    const paginatedData = filtered.slice(start, end)

    return {
      apartments: paginatedData,
      total: filtered.length,
      hasMore: end < filtered.length
    }
  }

  const loadApartments = async (reset = false) => {
    if (loading.value) return

    if (reset) {
      currentOffset.value = 0
      apartments.value = []
    }

    loading.value = true

    try {
      const params: FilterParams = {
        priceMin: filters.value.priceRange[0],
        priceMax: filters.value.priceRange[1],
        areaMin: filters.value.areaRange[0],
        areaMax: filters.value.areaRange[1],
        rooms: filters.value.rooms || undefined,
        offset: currentOffset.value,
        limit: itemsPerPage
      }

      const response = await fetchApartments(params)
      
      if (reset) {
        apartments.value = response.apartments
      } else {
        apartments.value.push(...response.apartments)
      }
      
      total.value = response.total
      hasMore.value = response.hasMore
      currentOffset.value += response.apartments.length
      
    } catch (error) {
      console.error('Error loading apartments:', error)
    } finally {
      loading.value = false
    }
  }

  const updateFilters = async (newFilters: Partial<FilterState>) => {
    filters.value = { ...filters.value, ...newFilters }
    await loadApartments(true)
    
    // Save to localStorage for persistence
    if (process.client) {
      localStorage.setItem('apartmentFilters', JSON.stringify(filters.value))
    }
  }

  const loadMore = async () => {
    if (!hasMore.value || loading.value) return
    await loadApartments(false)
  }

  const initializeFilters = () => {
    if (process.client) {
      const saved = localStorage.getItem('apartmentFilters')
      if (saved) {
        try {
          filters.value = JSON.parse(saved)
        } catch (e) {
          console.error('Error parsing saved filters:', e)
        }
      }
    }
  }

  return {
    apartments: readonly(apartments),
    loading: readonly(loading),
    hasMore: readonly(hasMore),
    total: readonly(total),
    filters: readonly(filters),
    loadApartments,
    updateFilters,
    loadMore,
    initializeFilters
  }
})