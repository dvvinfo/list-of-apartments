<template>
  <div class="input-field">
    <label v-if="label" :for="inputId" class="input-field__label">
      {{ label }}
      <span
        v-if="required"
        class="input-field__required"
        aria-label="обязательное поле"
        >*</span
      >
    </label>

    <div class="input-field__wrapper">
      <input
        :id="inputId"
        v-model="inputValue"
        :class="inputClasses"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :min="min"
        :max="max"
        :step="step"
        :autocomplete="autocomplete"
        :aria-describedby="errorMessage ? `${inputId}-error` : undefined"
        :aria-invalid="hasError"
        v-bind="$attrs"
        @blur="handleBlur"
        @focus="handleFocus"
        @input="handleInput"
      />

      <slot name="suffix" />
    </div>

    <div
      v-if="errorMessage || hint"
      :id="`${inputId}-error`"
      class="input-field__message"
      :class="{
        'input-field__message--error': hasError,
        'input-field__message--hint': !hasError,
      }"
    >
      {{ errorMessage || hint }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string | number;
  type?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  error?: string;
  hint?: string;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  autocomplete?: string;
  size?: "small" | "medium" | "large";
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  size: "medium",
});

const emit = defineEmits<{
  "update:modelValue": [value: string | number];
  blur: [event: FocusEvent];
  focus: [event: FocusEvent];
  input: [event: Event];
}>();

const inputId = `input-${Math.random().toString(36).substring(2, 9)}`;

const inputValue = computed({
  get: () => props.modelValue ?? "",
  set: (value) => {
    const parsedValue = props.type === "number" ? Number(value) : value;
    emit("update:modelValue", parsedValue);
  },
});

const hasError = computed(() => Boolean(props.error));
const errorMessage = computed(() => props.error);

const inputClasses = computed(() => [
  "input-field__input",
  `input-field__input--${props.size}`,
  {
    "input-field__input--error": hasError.value,
    "input-field__input--disabled": props.disabled,
  },
]);

const handleBlur = (event: FocusEvent) => {
  emit("blur", event);
};

const handleFocus = (event: FocusEvent) => {
  emit("focus", event);
};

const handleInput = (event: Event) => {
  emit("input", event);
};
</script>

<style lang="scss" scoped>
.input-field {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;

  &__label {
    font-size: $font-size-sm;
    font-weight: 500;
    color: $text-primary;
  }

  &__required {
    color: #e53e3e;
  }

  &__wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  &__input {
    width: 100%;
    border: 1px solid $border;
    border-radius: $border-radius;
    font-family: $font-family;
    font-size: $font-size-base;
    color: $text-primary;
    background-color: $background;
    transition: $transition;

    &:focus {
      outline: none;
      border-color: $primary;
      box-shadow: 0 0 0 3px rgba($primary, 0.1);
    }

    &:hover:not(:disabled):not(:focus) {
      border-color: darken($border, 10%);
    }

    &::placeholder {
      color: $text-secondary;
    }

    // Sizes
    &--small {
      padding: $spacing-xs $spacing-sm;
      font-size: $font-size-sm;
      min-height: 32px;
    }

    &--medium {
      padding: $spacing-sm $spacing-md;
      font-size: $font-size-base;
      min-height: 40px;
    }

    &--large {
      padding: $spacing-md $spacing-lg;
      font-size: $font-size-lg;
      min-height: 48px;
    }

    // States
    &--error {
      border-color: #e53e3e;

      &:focus {
        border-color: #e53e3e;
        box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
      }
    }

    &--disabled {
      background-color: $secondary;
      color: $text-secondary;
      cursor: not-allowed;

      &::placeholder {
        color: lighten($text-secondary, 20%);
      }
    }
  }

  &__message {
    font-size: $font-size-sm;

    &--error {
      color: #e53e3e;
    }

    &--hint {
      color: $text-secondary;
    }
  }
}
</style>
