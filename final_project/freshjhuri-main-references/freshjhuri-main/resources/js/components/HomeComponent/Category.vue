<script setup>
import { Link } from '@inertiajs/vue3';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

import { useLocalization } from '@/helper/localization';

const { locale, t } = useLocalization();

const props = defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
});



const currentIndex = ref(0);
const itemsPerView = ref(8);

const featuredCategories = computed(() => {
  return props.categories.filter((category) => category?.slug);
});

const maxIndex = computed(() => {
  return Math.max(0, featuredCategories.value.length - itemsPerView.value);
});

const visibleCategories = computed(() => {
  return featuredCategories.value.slice(currentIndex.value, currentIndex.value + itemsPerView.value);
});

const hasPrev = computed(() => currentIndex.value > 0);
const hasNext = computed(() => currentIndex.value < maxIndex.value);

const updateItemsPerView = () => {
  const width = window.innerWidth;

  if (width >= 1536) {
    itemsPerView.value = 8;
  } else if (width >= 1280) {
    itemsPerView.value = 7;
  } else if (width >= 1024) {
    itemsPerView.value = 6;
  } else if (width >= 768) {
    itemsPerView.value = 4;
  } else if (width >= 640) {
    itemsPerView.value = 3;
  } else {
    itemsPerView.value = 2;
  }

  if (currentIndex.value > maxIndex.value) {
    currentIndex.value = maxIndex.value;
  }
};

const goPrev = () => {
  currentIndex.value = Math.max(0, currentIndex.value - 1);
};

const goNext = () => {
  currentIndex.value = Math.min(maxIndex.value, currentIndex.value + 1);
};

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/')) return path;
  if (path.startsWith('storage/')) return `/${path}`;
  return `/storage/${path}`;
};

const categoryLabel = (category) => {
  const localizedKey = `name_${locale.value}`;
  return category?.[localizedKey] || category?.name_en || category?.name_bn || 'Category';
};

onMounted(() => {
  updateItemsPerView();
  window.addEventListener('resize', updateItemsPerView);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateItemsPerView);
});
</script>

<template>
  <section class="section-bg/20 py-12 md:py-16 transition-colors duration-300">
    <div class="mx-auto w-full max-w-7xl px-4 md:px-10">
      <h2 class="mb-10 text-center text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
        {{ t('category') }}
      </h2>

      <div v-if="featuredCategories.length" class="relative">
        <button
          type="button"
          class="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-primary/25 bg-white/80 dark:bg-zinc-800/80 p-2 text-zinc-700 dark:text-zinc-100 shadow-md backdrop-blur transition hover:bg-primary/25 disabled:cursor-not-allowed disabled:opacity-40"
          :disabled="!hasPrev"
          @click="goPrev"
          aria-label="Previous categories"
        >
          <ChevronLeft class="h-5 w-5" />
        </button>

        <div class="mx-12 overflow-hidden">
          <div class="flex items-start justify-center gap-6">
            <Link
              v-for="category in visibleCategories"
              :key="category.id"
              :href="route('productsoncategory', { slug: category.slug })"
              class="group block w-24 shrink-0 text-center sm:w-28 md:w-32"
            >
              <div class="card-bg mx-auto flex h-18 w-18 items-center justify-center rounded-2xl shadow-md ring-1 ring-white/5 transition sm:h-20 sm:w-20">
                <img
                  v-if="category.image"
                  :src="getImageUrl(category.image)"
                  :alt="categoryLabel(category)"
                  class="h-9 w-9 object-contain sm:h-10 sm:w-10"
                  loading="lazy"
                />
                <span v-else class="text-xs text-zinc-400">No image</span>
              </div>
              <p class="mt-3 line-clamp-1 text-xs font-medium text-forground dark:text-foreground sm:text-sm">
                {{ categoryLabel(category) }}
              </p>
            </Link>
          </div>
        </div>

        <button
          type="button"
          class="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-primary/25 bg-white/80 dark:bg-zinc-800/80 p-2 text-zinc-700 dark:text-zinc-100 shadow-md backdrop-blur transition hover:bg-primary/25 disabled:cursor-not-allowed disabled:opacity-40"
          :disabled="!hasNext"
          @click="goNext"
          aria-label="Next categories"
        >
          <ChevronRight class="h-5 w-5" />
        </button>
      </div>

      <div v-else class="rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-zinc-300">
        No featured categories found.
      </div>
    </div>
  </section>
</template>
