<script setup>
import { Link } from '@inertiajs/vue3';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { useLocalization } from '@/helper/localization';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const { locale } = useLocalization();

const props = defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
});

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/')) return path;
  if (path.startsWith('storage/')) return `/${path}`;
  return `/storage/${path}`;
};

const categoryLabel = (category) => {
  return locale.value === 'bn' ? category.name_bn : category.name_en;
};
</script>

<template>
  <section class="w-full py-16 bg-stone-50 dark:bg-stone-950 border-y border-stone-200/50 dark:border-stone-800">
    <div class="container mx-auto px-4 md:px-12 relative">
      <h2 class="text-2xl md:text-3xl font-bold text-center text-stone-800 dark:text-stone-100 mb-10">
        {{ locale === 'bn' ? 'নির্বাচিত ক্যাটাগরি' : 'Featured Categories' }}
      </h2>

      <div class="relative px-4 md:px-12">
        <!-- Custom Navigation -->
        <button class="category-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-honey-gold/80 hover:bg-honey-gold text-white shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          <ChevronLeft class="w-5 h-5" />
        </button>
        
        <button class="category-next absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-honey-gold/80 hover:bg-honey-gold text-white shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          <ChevronRight class="w-5 h-5" />
        </button>

        <Swiper
          :modules="[Navigation]"
          :navigation="{
            prevEl: '.category-prev',
            nextEl: '.category-next',
          }"
          :space-between="20"
          :slides-per-view="2"
          :breakpoints="{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
            1280: { slidesPerView: 6 },
          }"
          class="px-2 py-4"
        >
          <SwiperSlide v-for="cat in categories" :key="cat.id">
            <Link :href="route('productsoncategory', { slug: cat.slug })" class="flex flex-col items-center gap-4 group cursor-pointer">
              <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white dark:bg-stone-900 flex items-center justify-center shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-stone-800 group-hover:-translate-y-2 group-hover:shadow-[0_8px_25px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 overflow-hidden p-4">
                <img
                  v-if="cat.image"
                  :src="getImageUrl(cat.image)"
                  :alt="categoryLabel(cat)"
                  class="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                />
                <span v-else class="text-4xl">📦</span>
              </div>
              <span class="text-sm font-semibold text-stone-700 dark:text-stone-300 group-hover:text-primary-green transition-colors whitespace-nowrap">
                {{ categoryLabel(cat) }}
              </span>
            </Link>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  </section>
</template>
