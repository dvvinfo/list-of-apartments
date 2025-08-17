<template>
  <div class="apartments-table">
    <table class="table">
      <thead>
        <tr>
          <th class="table-header">Планировка</th>
          <th class="table-header">Квартира</th>
          <th class="table-header sortable" @click="sortBy('area')">
            <div class="sort-header">
              <span>S, м²</span>
              <div class="sort-icons">
                <div
                  class="sort-icon up"
                  :class="{
                    active: sortField === 'area' && sortDirection === 'asc',
                  }"
                  @click.stop="sortBy('area')"
                >
                  <FilterArrowUpIcon />
                </div>
                <div
                  class="sort-icon down"
                  :class="{
                    active: sortField === 'area' && sortDirection === 'desc',
                  }"
                  @click.stop="sortBy('area')"
                >
                  <FillterArrowDownIcon />
                </div>
              </div>
            </div>
          </th>
          <th class="table-header sortable" @click="sortBy('floor')">
            <div class="sort-header">
              <span>Этаж</span>
              <div class="sort-icons">
                <div
                  class="sort-icon up"
                  :class="{
                    active: sortField === 'floor' && sortDirection === 'asc',
                  }"
                  @click.stop="sortBy('floor')"
                >
                  <FilterArrowUpIcon />
                </div>
                <div
                  class="sort-icon down"
                  :class="{
                    active: sortField === 'floor' && sortDirection === 'desc',
                  }"
                  @click.stop="sortBy('floor')"
                >
                  <FillterArrowDownIcon />
                </div>
              </div>
            </div>
          </th>
          <th class="table-header sortable" @click="sortBy('price')">
            <div class="sort-header">
              <span>Цена, ₽</span>
              <div class="sort-icons">
                <div
                  class="sort-icon up"
                  :class="{
                    active: sortField === 'price' && sortDirection === 'asc',
                  }"
                  @click.stop="sortBy('price')"
                >
                  <FilterArrowUpIcon />
                </div>
                <div
                  class="sort-icon down"
                  :class="{
                    active: sortField === 'price' && sortDirection === 'desc',
                  }"
                  @click.stop="sortBy('price')"
                >
                  <FillterArrowDownIcon />
                </div>
              </div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="apartment in apartments"
          :key="apartment.id"
          class="table-row"
        >
          <td class="table-cell">
            <div class="apartment-layout">
              <img
                :src="apartment.image"
                :alt="`Планировка ${apartment.title}`"
                class="layout-image"
              />
            </div>
          </td>
          <td class="table-cell">
            <div class="apartment-title">{{ apartment.title }}</div>
          </td>
          <td class="table-cell">{{ apartment.area }}</td>
          <td class="table-cell">
            <span class="">{{ apartment.floor }} <span class="floor-info">из 17</span></span>
          </td>
          <td class="table-cell">
            <div class="price">{{ formatPrice(apartment.price) }}</div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Load More Button -->
    <div v-if="hasMore" class="load-more-section">
      <button class="load-more-btn" @click="$emit('loadMore')">
        Загрузить ещё
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
  apartments: Apartment[];
  hasMore: boolean;
  sortField: keyof Apartment | null;
  sortDirection: "asc" | "desc";
}

const props = defineProps<Props>();

const emit = defineEmits<{
  loadMore: [];
  sort: [field: keyof Apartment];
}>();

// Methods
const sortBy = (field: keyof Apartment) => {
  emit("sort", field);
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("ru-RU").format(price);
};
</script>

<style lang="scss" scoped>
.apartments-table {
  background: $background;
  overflow: hidden;
}

.table {
  width: 100%;
  border-collapse: collapse;
  line-height: 24px;
}

.table-header {
  padding-bottom: 17px;
  border-bottom: 1px solid $secondary;
  font-weight: 400;
  color: $text-primary;
  text-align: left;
  font-size: 14px;
  box-shadow: $card-shadow;

  &.sortable {
    cursor: pointer;
    user-select: none;

  }
}

.sort-header {
  display: flex;
  align-items: center;
  gap: 8px;
  &:hover{
    color: $primary;
  }
}

.sort-icons {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.sort-icon {
  cursor: pointer;
  opacity: 0.4;
  transition: opacity 0.2s ease;
  height: 4px;
  
  &:hover {
    opacity: 0.7;
  }

  &.active {
    opacity: 1;

    :deep(svg g) {
      opacity: 1;
    }

    :deep(svg path) {
      fill: #28a745;
    }
  }

  :deep(svg) {
    width: 7px;
    height: 4px;
  }
}

.table-row {
  border-bottom: 1px solid #f1f3f4;

  &:hover {
    background: #f8f9fa;
  }

  &:last-child {
    border-bottom: none;
  }
}

.table-cell {
  padding: 16px 0 24px 0;
  vertical-align: middle;
}

.apartment-layout {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.layout-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 4px;
}

.apartment-title {
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: $text-primary;
}



.floor-info {
  color: $text-secondary;
  font-size: 16px;
}

.price {
  font-weight: 400;
  color: $primary;
  font-size: 16px;
}

.load-more-section {
  padding: 24px;
  text-align: center;
  border-top: 1px solid #e9ecef;
}

.load-more-btn {
  padding: 12px 24px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: #0056b3;
  }
}

// Responsive
@media (max-width: 768px) {
  .table {
    font-size: 14px;
  }

  .table-header,
  .table-cell {
    padding: 12px 8px;
  }

  .apartment-layout {
    width: 60px;
    height: 45px;
  }
}
</style>
