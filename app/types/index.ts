export interface Apartment {
  id: string
  title: string
  area: number
  floor: number
  totalFloors: number
  price: number
  rooms: number
  image?: string
}

export interface FilterState {
  priceRange: [number, number]
  areaRange: [number, number]
  rooms: number | null
}

export interface ApiResponse {
  apartments: Apartment[]
  total: number
  hasMore: boolean
}

export interface FilterParams {
  priceMin: number
  priceMax: number
  areaMin: number
  areaMax: number
  rooms?: number
  offset: number
  limit: number
}