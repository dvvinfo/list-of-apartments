<template>
  <div class="apartments-page">
    <div class="container">
      <header class="apartments-page__header">
        <h1 class="apartments-page__title">Квартиры</h1>
      </header>

      <div class="apartments-page__layout">
        <!-- Main Content -->
        <main class="apartments-page__main">
          <ApartmentsTable
            :apartments="filteredApartments"
            :has-more="hasMoreToShow"
            :sort-field="sortField"
            :sort-direction="sortDirection"
            @load-more="loadMore"
            @sort="handleSort"
          />
        </main>

        <!-- Filter Panel -->
        <FilterPanel
          :filters="filterState"
          :loading="false"
          @update:filters="updateFilters"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FilterState } from "~/types";
import FilterPanel from "~/components/FilterPanel.vue";
import ApartmentsTable from "~/components/ApartmentsTable.vue";

interface Apartment {
  id: number;
  title: string;
  area: number;
  floor: number;
  price: number;
  rooms: number;
  image: string;
}

// SEO and meta
useHead({
  title: "Квартиры в новостройках - Поиск и покупка недвижимости",
  meta: [
    {
      name: "description",
      content:
        "Найдите идеальную квартиру в новостройке. Удобный поиск по цене, площади и количеству комнат. Актуальные предложения от застройщиков.",
    },
    {
      property: "og:title",
      content: "Квартиры в новостройках - Поиск недвижимости",
    },
    {
      property: "og:description",
      content:
        "Удобный поиск квартир в новостройках с фильтрами по цене, площади и количеству комнат.",
    },
  ],
});

// Reactive data
const apartments = ref<Apartment[]>([]);
const displayedCount = ref(5);
const sortField = ref<keyof Apartment | null>(null);
const sortDirection = ref<"asc" | "desc">("asc");

const filterState = ref<FilterState>({
  priceRange: [3500000, 10000000],
  areaRange: [30, 90],
  rooms: null,
});

// Load apartments data
onMounted(async () => {
  try {
    const data = await $fetch<Apartment[]>("/apartments.json");
    apartments.value = data || [];
  } catch (error) {
    console.error("Error loading apartments:", error);
  }
});

// Computed properties
const filteredApartments = computed(() => {
  let result = [...apartments.value];

  // Apply filters
  if (filterState.value.rooms !== null) {
    result = result.filter((apt) => apt.rooms === filterState.value.rooms);
  }

  // Price range filter
  result = result.filter(
    (apt) =>
      apt.price >= filterState.value.priceRange[0] &&
      apt.price <= filterState.value.priceRange[1]
  );

  // Area range filter
  result = result.filter(
    (apt) =>
      apt.area >= filterState.value.areaRange[0] &&
      apt.area <= filterState.value.areaRange[1]
  );

  // Apply sorting
  if (sortField.value) {
    result.sort((a, b) => {
      const aVal = a[sortField.value!];
      const bVal = b[sortField.value!];

      if (aVal < bVal) return sortDirection.value === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection.value === "asc" ? 1 : -1;
      return 0;
    });
  }

  // Limit displayed results
  return result.slice(0, displayedCount.value);
});

const hasMoreToShow = computed(() => {
  const totalFiltered = apartments.value.filter((apt) => {
    if (
      filterState.value.rooms !== null &&
      apt.rooms !== filterState.value.rooms
    )
      return false;
    if (
      apt.price < filterState.value.priceRange[0] ||
      apt.price > filterState.value.priceRange[1]
    )
      return false;
    if (
      apt.area < filterState.value.areaRange[0] ||
      apt.area > filterState.value.areaRange[1]
    )
      return false;
    return true;
  }).length;

  return displayedCount.value < totalFiltered;
});

// Methods
const updateFilters = (newFilters: Partial<FilterState>) => {
  filterState.value = { ...filterState.value, ...newFilters };
  displayedCount.value = 5; // Reset to show first 5 results
};

const handleSort = (field: keyof Apartment) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortDirection.value = "asc";
  }
};

const loadMore = () => {
  displayedCount.value += 5;
};
</script>

<style lang="scss" scoped>
.apartments-page {
  min-height: 100vh;
  padding: 40px 0;

  &__header {
    margin-bottom: 48px;

    @media (max-width: 768px) {
      margin-bottom: 24px;
      text-align: left;
    }
  }

  &__title {
    font-size: 54px;
    font-weight: 700;
    margin: 0;
  }

  &__layout {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 32px;
    align-items: start;

    @media (max-width: 1200px) {
      grid-template-columns: 280px 1fr;
      gap: 24px;
    }

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 0;
    }
  }

  &__main {
    min-height: 400px;
  }
}

// Responsive
@media (max-width: 768px) {
  .apartments-page {
    padding: 20px 0;

    &__layout {
      display: block;
    }
  }
}
</style>
