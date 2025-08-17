<template>
  <aside
    class="filter-panel"
    role="complementary"
    aria-label="Фильтры поиска квартир"
  >
    <div class="filter-panel__content">
      <form class="filter-panel__form" @submit.prevent>
        <fieldset class="filter-panel__section">
          <RoomSelector
            v-model="localFilters.rooms"
            :options="roomOptions"
            @update:model-value="debouncedUpdate"
          />
        </fieldset>

        <fieldset class="filter-panel__section">
          <legend class="filter-panel__section-title">
            Стоимость квартиры, ₽
          </legend>
          <RangeSlider
            v-model="localFilters.priceRange"
            :min="5500000"
            :max="18900000"
            :step="50000"
            :formatter="formatPrice"
            @update:model-value="debouncedUpdate"
          />
        </fieldset>

        <fieldset class="filter-panel__section">
          <legend class="filter-panel__section-title">Площадь, м²</legend>
          <RangeSlider
            v-model="localFilters.areaRange"
            :min="33"
            :max="123"
            :step="1"
            :formatter="formatArea"
            @update:model-value="debouncedUpdate"
          />
        </fieldset>
        <div>
          <BaseButton
            variant="text"
            @click="resetFilters"
            aria-label="Сбросить все фильтры"
          >
            Сбросить параметры <CloseIcon />
          </BaseButton>
        </div>
      </form>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { FilterState } from "~/types";
import BaseButton from "~/components/ui/BaseButton.vue";
import RoomSelector from "~/components/ui/RoomSelector.vue";
import RangeSlider from "~/components/ui/RangeSlider.vue";
import CloseIcon from "~/components/icons/CloseIcon.vue";

interface Props {
  filters: FilterState;
  loading?: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:filters": [filters: Partial<FilterState>];
}>();

// Room options
const roomOptions = [
  { value: null, label: "1к" },
  { value: 2, label: "2к" },
  { value: 3, label: "3к" },
  { value: 4, label: "4к" },
];

// Local reactive copy of filters
const localFilters = ref<FilterState>({ ...props.filters });

// Watch for external filter changes (e.g., from store initialization)
watch(
  () => props.filters,
  (newFilters) => {
    localFilters.value = { ...newFilters };
  },
  { deep: true }
);

// Debounced update function
const debouncedUpdate = useDebounceFn(() => {
  emit("update:filters", localFilters.value);
}, 500);

// Format functions
const formatPrice = (value: number): string => {
  return new Intl.NumberFormat("ru-RU").format(value);
};

const formatArea = (value: number): string => {
  return value.toString();
};

const resetFilters = () => {
  localFilters.value = {
    priceRange: [5500000, 18900000],
    areaRange: [33, 123],
    rooms: null,
  };
  emit("update:filters", localFilters.value);
};

// Debounce utility (simple implementation)
function useDebounceFn<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
) {
  // ReturnType<typeof setTimeout> covers both browser (number) and NodeJS.Timeout
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const debounced = (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => fn(...args), delay);
  };

  // cleanup if component unmounts
  onUnmounted(() => {
    if (timeoutId) clearTimeout(timeoutId);
  });

  return debounced;
}
</script>

<style lang="scss" scoped>
.filter-panel {
  background: $secondary;
  border-radius: $border-radius-xl;
  height: fit-content;
  position: sticky;
  top: $spacing-lg;

  @media (max-width: $desktop) {
    position: static;
    margin-bottom: $spacing-lg;
  }

  &__content {
    padding: $spacing-xl;

    @media (max-width: $desktop) {
      padding: $spacing-md;
    }
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: $spacing-lg;
    padding-bottom: $spacing-md;
    border-bottom: 1px solid $border;

    @media (max-width: $tablet) {
      flex-direction: column;
      gap: $spacing-sm;
      align-items: stretch;
    }
  }

  &__title {
    font-size: $font-size-xl;
    font-weight: 700;
    color: $text-primary;
    margin: 0;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;

    @media (max-width: $desktop) {
      gap: $spacing-lg;
    }
  }

  &__section {
    border: none;
    margin: 0;
    padding: 0;
  }

  &__section-title {
    font-size: $font-size-sm;
    font-weight: 400;
    color: $text-primary;
    margin-bottom: $spacing-sm;
    padding: 0;
  }
}

@media (max-width: $desktop) {
  .filter-panel {
    &__content {
      padding: $spacing-md;
    }

    &__header {
      flex-direction: column;
      gap: $spacing-sm;
    }
  }
}
</style>
