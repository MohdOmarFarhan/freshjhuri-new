<script setup>
import { Link } from '@inertiajs/vue3';
import { ArrowRight } from 'lucide-vue-next';
import { computed } from 'vue';
import { useLocalization } from '@/helper/localization';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

const { locale } = useLocalization();

const props = defineProps({
  bannars: {
    type: Array,
    default: () => [],
  },
  staticBannars: {
    type: Array,
    default: () => [],
  },
  upcomingProducts: {
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

const getLocalizedField = (bannar, field) => {
  return locale.value === 'bn' ? bannar[`${field}_bn`] : bannar[`${field}_en`];
};

const hexToRgba = (hex, opacity) => {
  if (!hex) return `rgba(245, 158, 11, ${opacity})`;
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + opacity + ')';
  }
  return `rgba(245, 158, 11, ${opacity})`;
};

const sortedBannars = computed(() => {
  return [...props.bannars].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
});
</script>

<template>
  <section class="relative w-full h-[60vh] md:h-[70vh] bg-stone-900 overflow-hidden group">
    <Swiper
      :modules="[Autoplay, EffectFade, Pagination]"
      effect="fade"
      :fadeEffect="{ crossFade: true }"
      :autoplay="{ delay: 5000, disableOnInteraction: false }"
      :pagination="{ clickable: true }"
      :loop="true"
      class="w-full h-full hero-swiper"
    >
      <SwiperSlide v-for="bannar in sortedBannars" :key="bannar.id">
        <div class="relative w-full h-full bg-stone-950">
          <img 
            :src="getImageUrl(bannar.image)"
            :alt="getLocalizedField(bannar, 'title') || 'Banner image'"
            class="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
          
          <div class="absolute inset-0 flex items-center">
            <div class="container mx-auto px-4 md:px-12">
              <div class="max-w-xl">
                <span 
                  v-if="getLocalizedField(bannar, 'tag')"
                  class="inline-block py-1 px-3 rounded-full border text-sm font-bold tracking-wider uppercase mb-4 backdrop-blur-md transition-all slide-tag"
                  :style="{
                    backgroundColor: hexToRgba(bannar.theme_color, 0.2),
                    color: bannar.theme_color || '#f59e0b',
                    borderColor: hexToRgba(bannar.theme_color, 0.3)
                  }"
                >
                  {{ getLocalizedField(bannar, 'tag') }}
                </span>

                <h1 class="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight font-sans slide-title">
                  {{ bannar.title_en }}, <br/>
                  <span 
                    class="font-bengali" 
                    :style="{ color: bannar.theme_color || '#f59e0b' }"
                  >
                    {{ bannar.title_bn }}
                  </span>
                </h1>

                <p 
                  v-if="getLocalizedField(bannar, 'short_desc')"
                  class="text-gray-200 text-lg mb-8 leading-relaxed slide-desc"
                >
                  {{ getLocalizedField(bannar, 'short_desc') }}
                </p>

                <Link 
                  :href="bannar.btn_link || route('productsoncategory', { slug: 'all' })" 
                  class="inline-flex items-center justify-center gap-2 text-white px-8 py-4 rounded-xl font-semibold shadow-lg transition-all hover:gap-4 hover:brightness-90 slide-btn"
                  :style="{
                    backgroundColor: bannar.theme_color || '#047857',
                    boxShadow: `0 10px 15px -3px ${hexToRgba(bannar.theme_color, 0.2)}, 0 4px 6px -4px ${hexToRgba(bannar.theme_color, 0.1)}`
                  }"
                >
                  {{ getLocalizedField(bannar, 'btn_text') || (locale === 'bn' ? 'অন্বেষণ করুন' : 'Explore Now') }}
                  <ArrowRight class="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  </section>
</template>

<style>
.hero-swiper .swiper-pagination-bullet {
  background-color: rgba(255, 255, 255, 0.5);
  opacity: 1;
  width: 10px;
  height: 10px;
  transition: all 0.3s ease;
}
.hero-swiper .swiper-pagination-bullet-active {
  background-color: var(--color-honey-gold, #f59e0b);
  width: 24px;
  border-radius: 5px;
}

.swiper-slide-active .slide-tag {
  animation: slideUpFade 0.6s ease forwards;
  animation-delay: 0.1s;
  opacity: 0;
  transform: translateY(20px);
}
.swiper-slide-active .slide-title {
  animation: slideUpFade 0.6s ease forwards;
  animation-delay: 0.2s;
  opacity: 0;
  transform: translateY(20px);
}
.swiper-slide-active .slide-desc {
  animation: slideUpFade 0.6s ease forwards;
  animation-delay: 0.3s;
  opacity: 0;
  transform: translateY(20px);
}
.swiper-slide-active .slide-btn {
  animation: slideUpFade 0.6s ease forwards;
  animation-delay: 0.4s;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes slideUpFade {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
