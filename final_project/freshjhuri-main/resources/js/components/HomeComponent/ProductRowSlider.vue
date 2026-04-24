<script setup>
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useLocalization } from '@/helper/localization';
import DittoFloatingParticles from '@/components/HomeComponent/DittoFloatingParticles.vue';
import DittoProductCard from '@/components/HomeComponent/DittoProductCard.vue';

const props = defineProps({
  section: {
    type: Object,
    required: true,
  },
});

const { locale } = useLocalization();

const title = computed(() => (locale.value === 'bn' ? props.section.title_bn : props.section.title_en));
const subtitle = computed(() => (locale.value === 'bn' ? props.section.subtitle_bn : props.section.subtitle_en));

const total = computed(() => (props.section.products?.length ? props.section.products.length : 0));
const activeIndex = ref(0);
const direction = ref('right');
const isHovered = ref(false);
const isAnimating = ref(false);
const intervalId = ref(null);

const accentColor = computed(() => props.section.theme_color || '#3d7a45');
const sectionKey = computed(() => String(props.section.id ?? props.section.type ?? 'section'));

const particleType = computed(() => {
  const en = (props.section.title_en || '').toLowerCase();
  if (en.includes('honey')) return 'honey';
  if (en.includes('mango') || en.includes('fruit')) return 'fruits';
  if (en.includes('spice') || en.includes('masala')) return 'spices';
  if (en.includes('date')) return 'dates';
  if (props.section.type === 'combo') return 'combo';
  if (props.section.type === 'new-arrival') return 'new-arrival';
  return 'fruits';
});

const sectionFallbackImage = computed(() => {
  if (particleType.value === 'honey') return '/ui/images/honey.png';
  if (particleType.value === 'spices') return '/ui/images/spices.png';
  if (particleType.value === 'dates') return '/ui/images/dates.png';
  return '/ui/images/mango.png';
});

const fallbackImageFor = (variant) => {
  const slug = String(variant?.product?.category?.slug || '').toLowerCase();
  if (slug.includes('honey')) return '/ui/images/honey.png';
  if (slug.includes('spice') || slug.includes('masala')) return '/ui/images/spices.png';
  if (slug.includes('date')) return '/ui/images/dates.png';
  if (slug.includes('mango') || slug.includes('fruit')) return '/ui/images/mango.png';
  return sectionFallbackImage.value;
};

const backgroundOverlayStyle = computed(() => {
  const hex = accentColor.value;
  const opacity = 0.14;
  if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) return { backgroundColor: 'rgba(0,0,0,0)' };
  const c = hex.substring(1);
  const normalized = c.length === 3 ? c.split('').map((ch) => ch + ch).join('') : c;
  if (normalized.length !== 6) return { backgroundColor: 'rgba(0,0,0,0)' };
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return { backgroundColor: `rgba(${r}, ${g}, ${b}, ${opacity})` };
});

const getVariant = (offset) => {
  const items = props.section.products || [];
  const t = items.length;
  if (!t) return null;
  return items[(activeIndex.value + offset + t) % t];
};

const goTo = (index, dir) => {
  if (!total.value) return;
  if (isAnimating.value) return;
  isAnimating.value = true;
  direction.value = dir;
  const t = total.value;
  activeIndex.value = (index + t) % t;
};

const next = () => goTo(activeIndex.value + 1, 'right');
const prev = () => goTo(activeIndex.value - 1, 'left');

const startAutoplay = () => {
  if (intervalId.value) window.clearInterval(intervalId.value);
  const delay = 6000 + sectionKey.value.length * 200;
  intervalId.value = window.setInterval(() => {
    if (!isHovered.value) next();
  }, delay);
};

const stopAutoplay = () => {
  if (!intervalId.value) return;
  window.clearInterval(intervalId.value);
  intervalId.value = null;
};

onMounted(() => {
  startAutoplay();
});

onBeforeUnmount(() => {
  stopAutoplay();
});

const handleMouseEnter = () => {
  isHovered.value = true;
  stopAutoplay();
};

const handleMouseLeave = () => {
  isHovered.value = false;
  startAutoplay();
};

const slideTransitionName = computed(() => (direction.value === 'right' ? 'slide-right' : 'slide-left'));
const dotClass = (i) => (i === activeIndex.value ? 'w-[22px]' : 'w-[7px] bg-[#d1d1d1] hover:bg-[#bdbdbd]');

const onSlideAfterLeave = () => {
  isAnimating.value = false;
};
</script>

<template>
  <section
    v-if="section.products && section.products.length"
    class="py-20 relative bg-white dark:bg-stone-950 overflow-hidden"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="absolute inset-0 opacity-40 dark:opacity-15" :style="backgroundOverlayStyle" />
    <DittoFloatingParticles :type="particleType" />

    <div class="container mx-auto px-4 relative z-10">
      <div class="mb-10">
        <div>
          <h2 class="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-2">{{ title }}</h2>
          <p v-if="subtitle" class="text-stone-500 dark:text-stone-400">{{ subtitle }}</p>
        </div>
      </div>

      <div class="relative w-full py-8 overflow-visible">
        <div class="flex items-end justify-center gap-3 md:gap-5 px-4 md:px-0">
          <div
            v-for="pos in [-1, 0, 1]"
            :key="pos"
            class="relative flex-shrink-0 transition-all duration-500"
            :class="pos === 0 ? 'w-[44%] md:w-[35%] lg:w-[28%] z-20' : 'w-[25%] md:w-[28%] lg:w-[24%] z-10'"
          >
            <div v-if="pos === 0" class="absolute -inset-4 rounded-3xl blur-2xl opacity-40 z-[-1]" :style="{ backgroundColor: accentColor }" />

            <Transition
              :name="slideTransitionName"
              mode="out-in"
              @after-leave="onSlideAfterLeave"
            >
              <div
                v-if="getVariant(pos)"
                :key="`${getVariant(pos).id}-${pos}-${activeIndex}`"
                class="transition-all duration-500"
                :class="pos === 0 ? 'scale-[1.05] opacity-100 shadow-xl rounded-2xl' : 'scale-[0.92] opacity-60'"
              >
                <DittoProductCard :variant="getVariant(pos)" :fallback-image="fallbackImageFor(getVariant(pos))" />
              </div>
              <div v-else :key="`empty-${pos}-${activeIndex}`" />
            </Transition>
          </div>
        </div>

        <button
          type="button"
          @click="prev"
          class="absolute left-4 md:left-12 top-[46%] -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md rounded-full flex items-center justify-center text-stone-800 dark:text-stone-100 shadow-lg border border-stone-200 dark:border-stone-800 z-30 transition-all duration-300"
          :class="isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'"
        >
          <ChevronLeft class="w-5 h-5" />
        </button>
        <button
          type="button"
          @click="next"
          class="absolute right-4 md:right-12 top-[46%] -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md rounded-full flex items-center justify-center text-stone-800 dark:text-stone-100 shadow-lg border border-stone-200 dark:border-stone-800 z-30 transition-all duration-300"
          :class="isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'"
        >
          <ChevronRight class="w-5 h-5" />
        </button>

        <div class="flex items-center justify-center gap-2.5 mt-10">
          <button
            v-for="(_, i) in section.products"
            :key="i"
            type="button"
            class="h-1.5 rounded-full transition-all duration-300"
            :class="dotClass(i)"
            :style="i === activeIndex ? { backgroundColor: accentColor } : undefined"
            @click="() => (i === activeIndex ? null : goTo(i, i > activeIndex ? 'right' : 'left'))"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1), opacity 420ms cubic-bezier(0.22, 1, 0.36, 1);
}

.slide-right-enter-from,
.slide-left-leave-to {
  transform: translate3d(100px, 0, 0) scale(0.92);
  opacity: 0;
}

.slide-right-leave-to,
.slide-left-enter-from {
  transform: translate3d(-100px, 0, 0) scale(0.92);
  opacity: 0;
}
</style>
