<template>
  <Teleport to="body">
    <Transition name="scroll-to-top">
      <button
        v-if="isVisible"
        class="scroll-to-top"
        type="button"
        aria-label="Вернуться наверх"
        @click="scrollToTop"
      >
        <ArrrowIcon />
      </button>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import ArrrowIcon from "~/components/icons/ArrrowIcon.vue";
const isVisible = ref(false);
const scrollThreshold = 100;

const checkScrollPosition = () => {
  const scrollY = window.scrollY;
  const canScroll = document.documentElement.scrollHeight > window.innerHeight;
  isVisible.value = scrollY > scrollThreshold && canScroll;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

// Throttle function for performance
const throttle = (func: Function, delay: number) => {
  let timeoutId: number | null = null;
  let lastExecTime = 0;

  return function (this: any, ...args: any[]) {
    const currentTime = Date.now();

    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
};

const throttledCheckScroll = throttle(checkScrollPosition, 100);

onMounted(() => {
  checkScrollPosition();
  window.addEventListener("scroll", throttledCheckScroll, { passive: true });
  window.addEventListener("resize", checkScrollPosition, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("scroll", throttledCheckScroll);
  window.removeEventListener("resize", checkScrollPosition);
});
</script>

<style lang="scss" scoped>
.scroll-to-top {
  position: fixed;
  bottom: $spacing-lg;
  right: $spacing-lg;
  width: 48px;
  height: 48px;
  background-color: $primary-hover;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba($primary, 0.3);
  transition: $transition;
  z-index: 1000;

  &:hover {
    background-color: $primary-hover;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba($primary, 0.4);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba($primary, 0.3);
  }

  &:focus-visible {
    outline: 2px solid white;
    outline-offset: 2px;
  }

  @media (max-width: $tablet) {
    bottom: $spacing-md;
    right: $spacing-md;
    width: 44px;
    height: 44px;
  }

  &__icon {
    width: 20px;
    height: 20px;
    stroke-width: 2.5;
  }
}

// Transition animations
.scroll-to-top-enter-active,
.scroll-to-top-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.scroll-to-top-enter-from {
  opacity: 0;
  transform: translateY(100%) scale(0.8);
}

.scroll-to-top-leave-to {
  opacity: 0;
  transform: translateY(100%) scale(0.8);
}
</style>
