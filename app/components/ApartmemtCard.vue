<template>
  <article class="apartment-card">
    <div class="apartment-card__layout">
      <div class="apartment-card__image">
        <div class="apartment-card__floor-plan" aria-label="План квартиры">
          <!-- SVG floor plan placeholder -->
          <svg viewBox="0 0 120 80" class="apartment-card__svg">
            <rect
              x="5"
              y="5"
              width="110"
              height="70"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            />
            <rect
              x="10"
              y="10"
              width="25"
              height="20"
              fill="none"
              stroke="currentColor"
              stroke-width="1"
            />
            <rect
              x="40"
              y="10"
              width="35"
              height="25"
              fill="none"
              stroke="currentColor"
              stroke-width="1"
            />
            <rect
              x="80"
              y="10"
              width="30"
              height="20"
              fill="none"
              stroke="currentColor"
              stroke-width="1"
            />
            <rect
              x="10"
              y="40"
              width="45"
              height="30"
              fill="none"
              stroke="currentColor"
              stroke-width="1"
            />
            <rect
              x="60"
              y="45"
              width="50"
              height="25"
              fill="none"
              stroke="currentColor"
              stroke-width="1"
            />
            <circle cx="20" cy="60" r="2" fill="currentColor" />
            <circle cx="85" cy="57" r="2" fill="currentColor" />
          </svg>
        </div>
      </div>

      <div class="apartment-card__content">
        <header class="apartment-card__header">
          <h3 class="apartment-card__title">
            {{ apartment.title }}
          </h3>
        </header>

        <div class="apartment-card__details">
          <dl class="apartment-card__specs">
            <div class="apartment-card__spec">
              <dt class="apartment-card__spec-label">Площадь:</dt>
              <dd class="apartment-card__spec-value">
                {{ apartment.area }} м²
              </dd>
            </div>
            <div class="apartment-card__spec">
              <dt class="apartment-card__spec-label">Этаж:</dt>
              <dd class="apartment-card__spec-value">
                {{ apartment.floor }} из {{ apartment.totalFloors }}
              </dd>
            </div>
          </dl>
        </div>

        <div class="apartment-card__price">
          <span class="apartment-card__price-value">
            {{ formatPrice(apartment.price) }}
          </span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Apartment } from "~/types";

interface Props {
  apartment: Apartment;
}

defineProps<Props>();

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(price)
    .replace("₽", "₽");
};
</script>

<style lang="scss" scoped>
.apartment-card {
  background: $background;
  border: 1px solid $border;
  border-radius: $border-radius;
  transition: $transition;
  overflow: hidden;

  &:hover {
    box-shadow: 0 4px 12px $card-shadow;
    border-color: lighten($primary, 30%);
  }

  &__layout {
    display: flex;
    min-height: 120px;

    @media (max-width: $tablet) {
      flex-direction: column;
    }
  }

  &__image {
    flex-shrink: 0;
    width: 120px;
    background-color: $secondary;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: $spacing-md;

    @media (max-width: $tablet) {
      width: 100%;
      height: 120px;
    }
  }

  &__floor-plan {
    width: 100%;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__svg {
    width: 100%;
    height: 100%;
    max-width: 88px;
    max-height: 60px;
    color: $text-secondary;
  }

  &__content {
    flex: 1;
    padding: $spacing-md;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 0;

    @media (max-width: $tablet) {
      padding: $spacing-md $spacing-lg;
    }
  }

  &__header {
    margin-bottom: $spacing-sm;
  }

  &__title {
    font-size: $font-size-base;
    font-weight: 500;
    color: $text-primary;
    margin: 0;
    line-height: 1.3;
  }

  &__details {
    margin-bottom: $spacing-md;
    flex: 1;
  }

  &__specs {
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
  }

  &__spec {
    display: flex;
    align-items: baseline;
    gap: $spacing-xs;
    font-size: $font-size-sm;
  }

  &__spec-label {
    color: $text-secondary;
    margin: 0;
    font-weight: normal;
  }

  &__spec-value {
    color: $text-primary;
    font-weight: 500;
    margin: 0;
  }

  &__price {
    border-top: 1px solid $border;
    padding-top: $spacing-sm;
    margin-top: auto;
  }

  &__price-value {
    font-size: $font-size-lg;
    font-weight: 700;
    color: $text-primary;
  }
}

@media (max-width: $desktop) {
  .apartment-card {
    &__layout {
      flex-direction: column;
      min-height: auto;
    }

    &__image {
      width: 100%;
      height: 100px;
    }
  }
}
</style>
