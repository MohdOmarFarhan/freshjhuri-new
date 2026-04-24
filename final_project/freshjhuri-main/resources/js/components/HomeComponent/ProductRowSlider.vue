<script setup>
import { useLocalization } from '@/helper/localization';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-vue-next';
import { Link } from '@inertiajs/vue3';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const { locale } = useLocalization();

const props = defineProps({
  section: {
    type: Object,
    required: true
  }
});

const getTitle = () => {
  return locale.value === 'bn' ? props.section.title_bn : props.section.title_en;
};

const getSubtitle = () => {
  return locale.value === 'bn' ? props.section.subtitle_bn : props.section.subtitle_en;
};

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/')) return path;
  if (path.startsWith('storage/')) return `/${path}`;
  return `/storage/${path}`;
};

const sectionId = `section-${props.section.id}`;
</script>

<template>
  <section v-if="section.products && section.products.length" class="w-full py-12 md:py-16 bg-white dark:bg-stone-950 transition-colors duration-300">
    <div class="container mx-auto px-4 md:px-12">
      <!-- Section Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-100">
            {{ getTitle() }}
          </h2>
          <p v-if="getSubtitle()" class="mt-1 text-sm text-stone-500 dark:text-stone-400">
            {{ getSubtitle() }}
          </p>
        </div>
        <div class="flex items-center gap-3">
          <button :class="`${sectionId}-prev`" class="w-9 h-9 flex items-center justify-center rounded-full border border-stone-200 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-500 text-stone-600 dark:text-stone-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            <ChevronLeft class="w-4 h-4" />
          </button>
          <button :class="`${sectionId}-next`" class="w-9 h-9 flex items-center justify-center rounded-full border border-stone-200 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-500 text-stone-600 dark:text-stone-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Accent line -->
      <div class="w-16 h-1 rounded-full mb-8" :style="{ backgroundColor: section.theme_color || '#f59e0b' }"></div>

      <!-- Product Slider -->
      <Swiper
        :modules="[Navigation]"
        :navigation="{
          prevEl: `.${sectionId}-prev`,
          nextEl: `.${sectionId}-next`,
        }"
        :space-between="16"
        :slides-per-view="2"
        :breakpoints="{
          640: { slidesPerView: 2, spaceBetween: 16 },
          768: { slidesPerView: 3, spaceBetween: 20 },
          1024: { slidesPerView: 4, spaceBetween: 20 },
          1280: { slidesPerView: 5, spaceBetween: 24 },
        }"
        class="py-2"
      >
        <SwiperSlide v-for="product in section.products" :key="product.id">
          <!-- Temporary Product Card - Will be replaced with ProductCard.vue -->
          <Link :href="product.product ? route('product.details', product.product.slug) : '#'" class="group block">
            <div class="bg-stone-50 dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <!-- Image -->
              <div class="aspect-square p-4 flex items-center justify-center bg-white dark:bg-stone-900 overflow-hidden">
                <img
                  v-if="product.product?.feature_image"
                  :src="getImageUrl(product.product.feature_image)"
                  :alt="product.product?.title_en || 'Product'"
                  class="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <span v-else class="text-4xl">📦</span>
              </div>
              <!-- Info -->
              <div class="p-4 space-y-2">
                <p class="text-xs font-semibold uppercase tracking-wider" :style="{ color: section.theme_color || '#f59e0b' }">
                  {{ product.product?.category?.name_en || product.size?.name || '' }}
                </p>
                <h3 class="text-sm font-bold text-stone-800 dark:text-stone-100 line-clamp-1">
                  {{ locale === 'bn' ? product.product?.title_bn : product.product?.title_en }}
                </h3>
                <div class="flex items-center gap-2">
                  <span v-if="product.discount_price" class="text-xs text-stone-400 line-through">৳ {{ product.price }}</span>
                  <span class="text-base font-bold" :style="{ color: section.theme_color || '#f59e0b' }">
                    ৳ {{ product.discount_price || product.price }}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </SwiperSlide>
      </Swiper>
    </div>
  </section>
</template>
