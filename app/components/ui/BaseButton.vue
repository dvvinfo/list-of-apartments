<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    :type="type"
    v-bind="$attrs"
    @click="handleClick"
  >
    <span v-if="loading" class="button__spinner" aria-hidden="true"></span>
    <span :class="{ 'button__content--loading': loading }">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: "primary" | "secondary" | "outline" | "text";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  block?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "medium",
  type: "button",
  disabled: false,
  loading: false,
  block: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const buttonClasses = computed(() => [
  "button",
  `button--${props.variant}`,
  `button--${props.size}`,
  {
    "button--disabled": props.disabled,
    "button--loading": props.loading,
    "button--block": props.block,
  },
]);

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit("click", event);
  }
};
</script>

<style lang="scss" scoped>
.button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: $font-family;
  font-weight: 500;
  border: 1px solid transparent;
  border-radius: $border-radius;
  cursor: pointer;
  transition: $transition;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;

  &:focus-visible {
    outline: 2px solid $primary;
    outline-offset: 2px;
  }

  // Variants
  &--primary {
    background-color: $primary;
    color: white;

    &:hover:not(:disabled) {
      background-color: $primary-hover;
    }

    &:active:not(:disabled) {
      background-color: darken($primary, 10%);
    }
  }

  &--secondary {
    background-color: $secondary;
    color: $text-primary;

    &:hover:not(:disabled) {
      background-color: darken($secondary, 5%);
    }

    &:active:not(:disabled) {
      background-color: darken($secondary, 10%);
    }
  }

  &--outline {
    background-color: transparent;
    color: $primary;
    border-color: $border;

    &:hover:not(:disabled) {
      background-color: rgba($primary, 0.05);
      border-color: $primary;
    }

    &:active:not(:disabled) {
      background-color: rgba($primary, 0.1);
    }
  }

  &--text {
    background-color: transparent;
    color: $primary;

    &:hover:not(:disabled) {
      background-color: rgba($primary, 0.05);
    }

    &:active:not(:disabled) {
      background-color: rgba($primary, 0.1);
    }
  }

  // Sizes
  &--small {
    padding: $spacing-xs $spacing-md;
    font-size: $font-size-sm;
    min-height: 32px;
  }

  &--medium {
    padding: $spacing-sm $spacing-lg;
    font-size: $font-size-base;
    min-height: 40px;
  }

  &--large {
    padding: $spacing-md $spacing-xl;
    font-size: $font-size-lg;
    min-height: 48px;
  }

  // States
  &--disabled,
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &--block {
    width: 100%;
  }

  &--loading {
    cursor: wait;
  }

  &__spinner {
    position: absolute;
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  &__content--loading {
    opacity: 0;
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
</style>
