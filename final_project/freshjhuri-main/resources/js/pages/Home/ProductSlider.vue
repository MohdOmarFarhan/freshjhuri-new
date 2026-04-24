<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  images: Array,
  zoomLevel: {
    type: Number,
    default: 2.5,
  },
});

const defaultImage = "https://placehold.co/300x300";
const displayImage = ref(getInitialImage(props.images));
const isZoomed = ref(false);
const zoomPosition = ref({ x: 0, y: 0 });
const isMobile = ref(false);
const isFullscreen = ref(false);
const isThumbMenuOpen = ref(false);

onMounted(() => {
  checkIfMobile();
  window.addEventListener("resize", checkIfMobile);
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkIfMobile);
  window.removeEventListener("keydown", handleKeydown);
});

function checkIfMobile() {
  isMobile.value = window.innerWidth < 768;
}

function getInitialImage(images) {
  return images?.length ? images[0].product_image : defaultImage;
}

function showImage(image) {
  displayImage.value = image;
  isZoomed.value = false;
}

function handleMouseMove(e) {
  if (isMobile.value || isFullscreen.value) return;
  const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
  const x = ((e.clientX - left) / width) * 100;
  const y = ((e.clientY - top) / height) * 100;
  zoomPosition.value = { x, y };
}

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value;
}

function toggleThumbMenu(e) {
  e?.stopPropagation?.();
  isThumbMenuOpen.value = !isThumbMenuOpen.value;
}

function handleKeydown(e) {
  if (e.key === "Escape" && isFullscreen.value) {
    isFullscreen.value = false;
    isThumbMenuOpen.value = false;
  }
}

watch(
  () => props.images,
  (newImages) => {
    displayImage.value = getInitialImage(newImages);
  },
  { immediate: true }
);
</script>

<template>
  <div class="relative">
    <!-- <div class="absolute right-3 top-3 z-30 flex items-center gap-2">
      <button
        type="button"
        class="px-3 py-1.5 rounded-full bg-background/80 text-foreground text-xs font-medium backdrop-blur-md border border-border shadow-sm hover:bg-background/90"
        @click.stop="toggleThumbMenu"
      >
        Images
      </button>
    </div> -->

    <div
      class="relative aspect-square overflow-hidden bg-muted"
      :class="{ 'cursor-zoom-in': !isMobile && !isFullscreen }"
      @mouseenter="!isMobile && !isFullscreen && (isZoomed = true)"
      @mouseleave="!isMobile && !isFullscreen && (isZoomed = false)"
      @mousemove="handleMouseMove"
      @click="toggleFullscreen"
    >
      <img
        :src="`/${displayImage}`"
        :alt="displayImage"
        class="w-full h-full object-contain transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)]"
        :style="{
          transform: isZoomed ? `scale(${zoomLevel})` : 'scale(1)',
          transformOrigin: !isMobile ? `${zoomPosition.x}% ${zoomPosition.y}%` : 'center center'
        }"
      />
      <div class="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
    </div>

    <div class="flex gap-2 px-4 py-3 bg-card overflow-x-auto">
      <button
        v-for="(image, index) in images?.length ? images : Array(5).fill({ product_image: defaultImage })"
        :key="index"
        type="button"
        class="rounded-xl overflow-hidden w-14 h-14 border-2 transition-all duration-200 shrink-0"
        :class="displayImage === image.product_image ? 'border-primary ring-2 ring-primary/20 scale-105' : 'border-border opacity-60 hover:opacity-100'"
        @click="showImage(image.product_image)"
      >
        <img
          :src="`/${image.product_image}`"
          :alt="image.product_image"
          class="w-full h-full object-cover"
          loading="lazy"
        />
      </button>
    </div>

    <!-- Dropdown thumbnails (same list, compact) -->
    <div
      v-show="isThumbMenuOpen"
      class="absolute right-3 top-12 z-40 w-72 bg-background/95 backdrop-blur-xl border border-border rounded-2xl shadow-xl p-3"
      @click.stop
    >
      <div class="grid grid-cols-4 gap-2">
        <button
          v-for="(image, index) in images?.length ? images : Array(8).fill({ product_image: defaultImage })"
          :key="index"
          type="button"
          class="relative overflow-hidden rounded-md w-14 h-14 flex items-center justify-center bg-muted hover:bg-muted/80 transition"
          @click="showImage(image.product_image); isThumbMenuOpen = false"
        >
          <img
            :src="`/${image.product_image}`"
            :alt="image.product_image"
            class="max-w-full max-h-full object-contain"
            :class="{
              'ring-2 ring-primary dark:ring-primary': displayImage === image.product_image
            }"
          />
        </button>
      </div>
    </div>

    <!-- Fullscreen overlay -->
    <div
      v-if="isFullscreen"
      class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center px-4"
      @click="toggleFullscreen"
    >
      <div
        class="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center"
        @click.stop
      >
        <button
          type="button"
          class="absolute top-3 right-3 inline-flex items-center justify-center w-8 h-8 rounded-full bg-black/60 text-white hover:bg-black/80 text-xl leading-none"
          @click.stop="toggleFullscreen"
          aria-label="Close"
        >
          ×
        </button>
        <img
          :src="`/${displayImage}`"
          :alt="displayImage"
          class="w-full h-full object-contain"
        />
      </div>
    </div>
  </div>
</template>
