<template>
  <div class="room-selector">
    <div class="room-selector__label" v-if="label">{{ label }}</div>
    <div class="room-selector__buttons" role="radiogroup" :aria-label="label">
      <button
        v-for="option in options"
        :key="option.value || 'all'"
        :class="roomButtonClasses(option.value)"
        :aria-checked="modelValue === option.value"
        :aria-label="`${option.label} комнат`"
        role="radio"
        type="button"
        @click="selectRoom(option.value)"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface RoomOption {
  value: number | null;
  label: string;
}

interface Props {
  modelValue: number | null;
  options: RoomOption[];
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  options: () => [
    { value: null, label: "1к" },
    { value: 2, label: "2к" },
    { value: 3, label: "3к" },
    { value: 4, label: "4к" },
  ],
});

const emit = defineEmits<{
  "update:modelValue": [value: number | null];
}>();

const roomButtonClasses = (value: number | null) => [
  "room-selector__button",
  {
    "room-selector__button--active": props.modelValue === value,
  },
];

const selectRoom = (value: number | null) => {
  emit("update:modelValue", value);
};
</script>

<style lang="scss" scoped>
.room-selector {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;

  &__label {
    font-size: $font-size-sm;
    font-weight: 500;
    color: $text-primary;
  }

  &__buttons {
    display: flex;
    gap: $spacing-md;
    flex-wrap: wrap;
  }

  &__button {
    background-color: $background;
    color: $text-primary;
    border: 1px solid $border;
    border-radius: $border-radius;
    font-family: $font-family;
    font-size: $font-size-base;
    font-weight: 500;
    cursor: pointer;
    transition: $transition;
    width: 44px;
    height: 44px;
    text-align: center;

    &:hover {
      background-color: rgba($primary, 0.05);
      border-color: $primary;
    }

    &:focus-visible {
      outline: 2px solid $primary;
      outline-offset: 2px;
    }

    &--active {
      background-color: $primary;
      color: white;
      border-color: $primary;

      &:hover {
        background-color: $primary-hover;
      }
    }
  }
}
</style>
