<template>
  <div class="range-slider">
    <label v-if="label" class="range-slider__label">
      {{ label }}
    </label>

    <div class="range-slider__container">
      <div class="range-slider__track-container">
        <div
          ref="trackRef"
          class="range-slider__track"
          @mousedown="handleTrackClick"
          @touchstart="handleTrackClick"
        >
          <div class="range-slider__fill" :style="fillStyle"></div>

          <div
            ref="minThumb"
            class="range-slider__thumb range-slider__thumb--min"
            :style="{ left: minPosition }"
            :aria-label="`Минимальное значение: ${formatValue(modelValue[0])}`"
            tabindex="0"
            role="slider"
            :aria-valuemin="min"
            :aria-valuemax="max"
            :aria-valuenow="modelValue[0]"
            @mousedown="startDrag('min', $event)"
            @touchstart="startDrag('min', $event)"
            @keydown="handleKeydown('min', $event)"
          ></div>

          <div
            ref="maxThumb"
            class="range-slider__thumb range-slider__thumb--max"
            :style="{ left: maxPosition }"
            :aria-label="`Максимальное значение: ${formatValue(modelValue[1])}`"
            tabindex="0"
            role="slider"
            :aria-valuemin="min"
            :aria-valuemax="max"
            :aria-valuenow="modelValue[1]"
            @mousedown="startDrag('max', $event)"
            @touchstart="startDrag('max', $event)"
            @keydown="handleKeydown('max', $event)"
          ></div>
        </div>
      </div>

      <div class="range-slider__values">
        <span class="range-slider__value"><span>От </span>{{
          formatValue(modelValue[0])
        }}</span>
        <span class="range-slider__value"><span>До </span>{{
          formatValue(modelValue[1])
        }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: [number, number];
  min: number;
  max: number;
  step?: number;
  label?: string;
  formatter?: (value: number) => string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  step: 1,
  disabled: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: [number, number]];
}>();

import { ref, computed, onUnmounted } from "vue";

const trackRef = ref<HTMLElement>();
const minThumb = ref<HTMLElement>();
const maxThumb = ref<HTMLElement>();
const isDragging = ref<"min" | "max" | null>(null);

const isTouchEvent = (e: any): e is TouchEvent => {
  return (
    e &&
    typeof e === "object" &&
    "touches" in e &&
    (e as TouchEvent).touches !== undefined
  );
};

const formatValue = (value: number): string => {
  return props.formatter ? props.formatter(value) : value.toString();
};

const getPercentage = (value: number): number => {
  // Ограничиваем значение в пределах min/max
  const clampedValue = Math.max(props.min, Math.min(props.max, value));
  const percentage =
    ((clampedValue - props.min) / (props.max - props.min)) * 100;
  // Ограничиваем процент в пределах 0-100
  return Math.max(0, Math.min(100, percentage));
};

const minPosition = computed(() => `${getPercentage(props.modelValue[0])}%`);
const maxPosition = computed(() => `${getPercentage(props.modelValue[1])}%`);

const fillStyle = computed(() => {
  const minPercentage = getPercentage(props.modelValue[0]);
  const maxPercentage = getPercentage(props.modelValue[1]);
  return {
    left: `${minPercentage}%`,
    width: `${Math.max(0, maxPercentage - minPercentage)}%`,
  };
});

const updateValue = (type: "min" | "max", newValue: number) => {
  if (props.disabled) return;

  const clampedValue = Math.max(props.min, Math.min(props.max, newValue));
  const steppedValue = Math.round(clampedValue / props.step) * props.step;

  const newRange: [number, number] = [...props.modelValue];

  if (type === "min") {
    newRange[0] = Math.min(steppedValue, newRange[1]);
  } else {
    newRange[1] = Math.max(steppedValue, newRange[0]);
  }

  emit("update:modelValue", newRange);
};

const getValueFromPosition = (
  clientX: number,
  element: HTMLElement
): number => {
  const rect = element.getBoundingClientRect();
  const percentage = Math.max(
    0,
    Math.min(1, (clientX - rect.left) / rect.width)
  );
  return props.min + percentage * (props.max - props.min);
};

const handleTrackClick = (event: MouseEvent | TouchEvent) => {
  if (props.disabled || !trackRef.value) return;

  event.preventDefault();

  let clientX: number | undefined;
  if (isTouchEvent(event)) {
    const t = event.touches && event.touches[0];
    clientX = t ? t.clientX : undefined;
  } else {
    clientX = (event as MouseEvent).clientX;
  }
  if (clientX === undefined) return;
  const clickValue = getValueFromPosition(clientX, trackRef.value);

  // Determine which thumb is closer
  const minDistance = Math.abs(clickValue - props.modelValue[0]);
  const maxDistance = Math.abs(clickValue - props.modelValue[1]);

  if (minDistance < maxDistance) {
    updateValue("min", clickValue);
  } else {
    updateValue("max", clickValue);
  }
};

const startDrag = (type: "min" | "max", event: MouseEvent | TouchEvent) => {
  if (props.disabled || !trackRef.value) return;

  event.preventDefault();
  event.stopPropagation();
  isDragging.value = type;

  const track = trackRef.value;

  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging.value || !track) return;

    let clientX: number | undefined;
    if (isTouchEvent(e)) {
      const t = e.touches && e.touches[0];
      clientX = t ? t.clientX : undefined;
    } else {
      clientX = (e as MouseEvent).clientX;
    }
    if (clientX === undefined) return;
    const newValue = getValueFromPosition(clientX, track);
    updateValue(isDragging.value, newValue);
  };

  const handleEnd = () => {
    isDragging.value = null;
    document.removeEventListener("mousemove", handleMove);
    document.removeEventListener("mouseup", handleEnd);
    document.removeEventListener("touchmove", handleMove);
    document.removeEventListener("touchend", handleEnd);
  };

  document.addEventListener("mousemove", handleMove, { passive: false });
  document.addEventListener("mouseup", handleEnd);
  document.addEventListener("touchmove", handleMove, { passive: false });
  document.addEventListener("touchend", handleEnd);
};

const handleKeydown = (type: "min" | "max", event: KeyboardEvent) => {
  if (props.disabled) return;

  const currentValue = props.modelValue[type === "min" ? 0 : 1];
  let newValue = currentValue;

  switch (event.key) {
    case "ArrowLeft":
    case "ArrowDown":
      newValue = currentValue - props.step;
      break;
    case "ArrowRight":
    case "ArrowUp":
      newValue = currentValue + props.step;
      break;
    case "Home":
      newValue = type === "min" ? props.min : props.modelValue[0];
      break;
    case "End":
      newValue = type === "max" ? props.max : props.modelValue[1];
      break;
    case "PageDown":
      newValue = currentValue - props.step * 10;
      break;
    case "PageUp":
      newValue = currentValue + props.step * 10;
      break;
    default:
      return;
  }

  event.preventDefault();
  updateValue(type, newValue);
};

// Cleanup on unmount
onUnmounted(() => {
  if (isDragging.value) {
    isDragging.value = null;
  }
});
</script>

<style lang="scss" scoped>
.range-slider {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  overflow: visible;

  &__label {
    font-size: $font-size-sm;
    font-weight: 500;
    color: $text-primary;
  }

  &__container {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    overflow: visible;
  }

  &__track-container {
    position: relative;
    padding: $spacing-md 0;
    margin: 0 12px;
    overflow: visible;
  }

  &__track {
    position: relative;
    height: 4px;
    background-color: $border;
    border-radius: 2px;
    cursor: pointer;
    user-select: none;
  }

  &__fill {
    position: absolute;
    height: 100%;
    background-color: $primary;
    border-radius: 2px;
    pointer-events: none;
    transition: all 0.1s ease;
  }

  &__thumb {
    position: absolute;
    top: 50%;
    width: 14px;
    height: 14px;
    background-color: $primary;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    cursor: grab;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    user-select: none;

    &:hover {
      transform: translate(-50%, -50%) scale(1.1);
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
    }

    &:active {
      cursor: grabbing;
      transform: translate(-50%, -50%) scale(1.15);
    }

    &:focus-visible {
      outline: 2px solid $primary;
      outline-offset: 2px;
    }

    &--min {
      z-index: 2;
    }

    &--max {
      z-index: 1;
    }
  }

  &__values {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__value {
    font-size: $font-size-base;
    font-weight: 500;
    color: $text-primary;
    background-color: $secondary;
    border-radius: $border-radius-small;
    min-width: 60px;
    text-align: center;
    span{
      padding-right: 5px;
    }
  }

  // Disabled state
  &:has([disabled]) {
    opacity: 0.6;
    pointer-events: none;
  }
}

// Touch device optimizations
@media (hover: none) and (pointer: coarse) {
  .range-slider__thumb {
    width: 24px;
    height: 24px;

    &:hover {
      transform: translate(-50%, -50%);
    }
  }
}
</style>
