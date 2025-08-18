<template>
  <div class="mobile-sort-header">
    <div class="mobile-sort-header__items">
      <button
        class="mobile-sort-header__item"
        :class="{ active: sortField === 'area' }"
        @click="$emit('sort', 'area')"
      >
        S, м²
        <div class="sort-icons">
          <FilterArrowUpIcon
            :class="{ active: sortField === 'area' && sortDirection === 'asc' }"
          />
          <FillterArrowDownIcon
            :class="{
              active: sortField === 'area' && sortDirection === 'desc',
            }"
          />
        </div>
      </button>

      <button
        class="mobile-sort-header__item"
        :class="{ active: sortField === 'floor' }"
        @click="$emit('sort', 'floor')"
      >
        Этаж
        <div class="sort-icons">
          <FilterArrowUpIcon
            :class="{
              active: sortField === 'floor' && sortDirection === 'asc',
            }"
          />
          <FillterArrowDownIcon
            :class="{
              active: sortField === 'floor' && sortDirection === 'desc',
            }"
          />
        </div>
      </button>

      <button
        class="mobile-sort-header__item"
        :class="{ active: sortField === 'price' }"
        @click="$emit('sort', 'price')"
      >
        Цена, ₽
        <div class="sort-icons">
          <FilterArrowUpIcon
            :class="{
              active: sortField === 'price' && sortDirection === 'asc',
            }"
          />
          <FillterArrowDownIcon
            :class="{
              active: sortField === 'price' && sortDirection === 'desc',
            }"
          />
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import FilterArrowUpIcon from "~/components/icons/FilterArrowUpIcon.vue";
import FillterArrowDownIcon from "~/components/icons/FillterArrowDownIcon.vue";

interface Apartment {
  id: number;
  title: string;
  area: number;
  floor: number;
  price: number;
  rooms: number;
  image: string;
}

interface Props {
  sortField: keyof Apartment | null;
  sortDirection: "asc" | "desc";
}

defineProps<Props>();

defineEmits<{
  sort: [field: keyof Apartment];
}>();
</script>

<style lang="scss" scoped>
.mobile-sort-header {
  padding: 8px 0;
  margin-bottom: 4px;

  &__items {
    display: flex;
    gap: 24px;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    font-size: $font-size-sm;
    color: $text-primary;
    cursor: pointer;
    padding: 0;

    &.active {
      color: $primary;
    }

    &:hover {
      color: $primary;
    }
  }
}

.sort-icons {
  display: flex;
  flex-direction: column;
  gap: 1px;

  :deep(svg) {
    width: 7px;
    height: 4px;
    opacity: 0.4;
    transition: opacity 0.2s ease;

    &.active {
      opacity: 1;

      path {
        fill: $primary;
      }
    }
  }
}
</style>
