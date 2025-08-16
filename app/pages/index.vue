<template>
  <div class="apartments-page">
    <div class="container">
      <header class="apartments-page__header">
        <h1 class="apartments-page__title">Квартиры</h1>
        <p class="apartments-page__subtitle">
          Найдено {{ apartmentsStore.total }}
          {{
            getPluralForm(apartmentsStore.total, [
              "квартира",
              "квартиры",
              "квартир",
            ])
          }}
        </p>
      </header>

      <div class="apartments-page__layout">
        <!-- Filter Panel -->
        <FilterPanel
          :filters="apartmentsStore.filters"
          :loading="apartmentsStore.loading"
          @update:filters="updateFilters"
        />

        <!-- Main Content -->
        <main class="apartments-page__main">
          <!-- Loading State -->
          <div
            v-if="
              apartmentsStore.loading && apartmentsStore.apartments.length === 0
            "
            class="apartments-page__loading"
            aria-live="polite"
          >
            <div class="apartments-page__spinner"></div>
            <p>Загружаем квартиры...</p>
          </div>

          <!-- Apartment List -->
          <div
            v-else-if="apartmentsStore.apartments.length > 0"
            class="apartments-page__content"
          >
            <div
              class="apartments-page__grid"
              role="list"
              aria-label="Список квартир"
            >
              <ApartmentCard
                v-for="apartment in apartmentsStore.apartments"
                :key="apartment.id"
                :apartment="apartment"
                role="listitem"
              />
            </div>

            <!-- Load More Button -->
            <div
              v-if="apartmentsStore.hasMore"
              class="apartments-page__load-more"
            >
              <BaseButton
                variant="outline"
                size="large"
                :loading="apartmentsStore.loading"
                :disabled="apartmentsStore.loading"
                @click="loadMore"
              >
                {{ apartmentsStore.loading ? "Загружаем..." : "Загрузить ещё" }}
              </BaseButton>
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-else
            class="apartments-page__empty"
            role="status"
            aria-live="polite"
          >
            <div class="apartments-page__empty-content">
              <svg
                class="apartments-page__empty-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M3 9.5L12 4l9 5.5v11a2 2 0 01-2 2H5a2 2 0 01-2-2v-11z"
                />
                <polyline points="9,22 9,12 15,12 15,22" />
              </svg>
              <h2 class="apartments-page__empty-title">Квартиры не найдены</h2>
              <p class="apartments-page__empty-text">
                Попробуйте изменить параметры фильтра или сбросить их
              </p>
              <BaseButton variant="primary" @click="resetAllFilters">
                Сбросить фильтры
              </BaseButton>
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- Scroll to Top Button -->
    <ScrollToTop />
  </div>
</template>

<script setup lang="ts">
import type { FilterState } from "~/types";
import { useApartmentsStore } from "~/stores/apartments";
import FilterPanel from "~/components/FilterPanel.vue";
import ApartmentCard from "~/components/ApartmentCard.vue";
import BaseButton from "~/components/ui/BaseButton.vue";
import ScrollToTop from "~/components/ScrollToTop.vue";

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

// Store
const apartmentsStore = useApartmentsStore();

// Initialize data on mount
onMounted(async () => {
  apartmentsStore.initializeFilters();
  await apartmentsStore.loadApartments(true);
});

// Methods
const updateFilters = async (newFilters: Partial<FilterState>) => {
  await apartmentsStore.updateFilters(newFilters);
};

const loadMore = async () => {
  await apartmentsStore.loadMore();
};

const resetAllFilters = async () => {
  await apartmentsStore.updateFilters({
    priceRange: [5500000, 18900000],
    areaRange: [33, 123],
    rooms: null,
  });
};

// Utility function for plural forms
const getPluralForm = (
  count: number,
  forms: [string, string, string]
): string => {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod100 >= 11 && mod100 <= 14) {
    return forms[2];
  }

  if (mod10 === 1) {
    return forms[0];
  }

  if (mod10 >= 2 && mod10 <= 4) {
    return forms[1];
  }

  return forms[2];
};
</script>

<style lang="scss" scoped>
.apartments-page {
  min-height: 100vh;
  padding: $spacing-xl 0;

  @media (max-width: $desktop) {
    padding: $spacing-lg 0;
  }

  &__header {
    margin-bottom: $spacing-xl;
    text-align: center;

    @media (max-width: $desktop) {
      margin-bottom: $spacing-lg;
      text-align: left;
    }
  }

  &__title {
    font-size: clamp(28px, 4vw, 36px);
    font-weight: 700;
    color: $text-primary;
    margin: 0 0 $spacing-sm 0;
  }

  &__subtitle {
    font-size: $font-size-base;
    color: $text-secondary;
    margin: 0;
  }

  &__layout {
    display: grid;
    grid-template-columns: 320px 1fr;
    gap: $spacing-xl;
    align-items: start;

    @media (max-width: $desktop-large) {
      grid-template-columns: 280px 1fr;
      gap: $spacing-lg;
    }

    @media (max-width: $desktop) {
      grid-template-columns: 1fr;
      gap: 0;
    }
  }

  &__main {
    min-height: 400px;
  }

  &__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: $spacing-xl;
    gap: $spacing-lg;
    text-align: center;
    min-height: 300px;

    p {
      color: $text-secondary;
      font-size: $font-size-base;
      margin: 0;
    }
  }

  &__spinner {
    width: 40px;
    height: 40px;
    border: 3px solid $border;
    border-top: 3px solid $primary;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: $spacing-xl;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: $spacing-lg;

    @media (min-width: $desktop-large) {
      grid-template-columns: repeat(auto-fit, minmax(480px, 1fr));
    }
  }

  &__load-more {
    display: flex;
    justify-content: center;
    padding-top: $spacing-lg;
  }

  &__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: $spacing-xl;
    min-height: 400px;
  }

  &__empty-content {
    text-align: center;
    max-width: 400px;
  }

  &__empty-icon {
    width: 64px;
    height: 64px;
    color: $text-secondary;
    margin-bottom: $spacing-lg;
  }

  &__empty-title {
    font-size: $font-size-xl;
    font-weight: 600;
    color: $text-primary;
    margin: 0 0 $spacing-md 0;
  }

  &__empty-text {
    color: $text-secondary;
    margin: 0 0 $spacing-lg 0;
    line-height: 1.5;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

// Responsive adjustments
@media (max-width: $desktop) {
  .apartments-page {
    &__layout {
      display: block;
    }

    &__grid {
      grid-template-columns: 1fr;
    }
  }
}

@media (max-width: $tablet) {
  .apartments-page {
    padding: $spacing-md 0;

    &__header {
      margin-bottom: $spacing-md;
    }

    &__content {
      gap: $spacing-lg;
    }

    &__grid {
      gap: $spacing-md;
    }
  }
}
</style>
