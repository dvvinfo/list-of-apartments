<template>
  <div class="apartment-card">
    <div class="apartment-card__content">
      <div class="apartment-card__info">
        <h3 class="apartment-card__title">{{ apartment.title }}</h3>
        <div class="apartment-card__details">
          <span class="apartment-card__area">{{ apartment.area }} м²</span>
          <span class="apartment-card__floor"
            >{{ apartment.floor }} из 17 этаж</span
          >
          <div class="apartment-card__price">
            {{ formatPrice(apartment.price) }} ₽
          </div>
        </div>
      </div>
      <div class="apartment-card__image">
        <img
          :src="apartment.image"
          :alt="`Планировка ${apartment.title}`"
          class="apartment-card__layout"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
  apartment: Apartment;
}

defineProps<Props>();

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("ru-RU").format(price);
};
</script>

<style lang="scss" scoped>
.apartment-card {
  background: $background;
  border: 1px solid #e9ecef;
  border-radius: $border-radius-md;
  padding: 16px 24px;

  &__content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 4px;
  }

  &__info {
    flex: 1;
  }

  &__title {
    font-size: $font-size-base;
    font-weight: 500;
    color: $text-primary;
    margin: 0 0 12px 0;
  }

  &__details {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  &__area {
    font-size: $font-size-base;
    font-weight: 500;
    color: $text-primary;
  }

  &__floor {
    font-size: $font-size-base;
    color: $text-secondary;
  }

  &__price {
    font-size: $font-size-base;
    font-weight: 500;
    color: $primary;
  }

  &__image {
    flex-shrink: 0;
  }

  &__layout {
    width: 80px;
    height: 80px;
    object-fit: contain;
    border-radius: 4px;
  }
}
</style>
