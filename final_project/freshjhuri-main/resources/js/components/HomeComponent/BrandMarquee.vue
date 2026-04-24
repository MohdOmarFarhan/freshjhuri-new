<script setup>
import * as LucideIcons from 'lucide-vue-next';
import { computed } from 'vue';
import { useLocalization } from '@/helper/localization';

const props = defineProps({
  marquees: {
    type: Array,
    default: () => []
  }
});

const { locale } = useLocalization();

const getLocalizedText = (marquee) => {
  return locale.value === 'bn' ? marquee.text_bn : marquee.text_en;
};

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/')) return path;
  return `/storage/${path}`;
};

const classOrStyle = (value, cssProp) => {
  if (!value) return { className: '', style: {} };
  if (value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl')) {
    return { className: '', style: { [cssProp]: value } };
  }
  return { className: value, style: {} };
};

const marqueeItems = computed(() => [...props.marquees, ...props.marquees, ...props.marquees]);
</script>

<template>
  <div v-if="marquees.length" class="w-full bg-white dark:bg-stone-950 border-y border-stone-200 dark:border-stone-800 py-6 overflow-hidden flex relative group/marquee">
    <div class="absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-r from-white dark:from-stone-950 to-transparent z-10 pointer-events-none" />
    <div class="absolute right-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-l from-white dark:from-stone-950 to-transparent z-10 pointer-events-none" />
    
    <div class="marquee-track flex items-center gap-8 w-max shrink-0 py-2">
      <div v-for="(badge, i) in marqueeItems" :key="i" class="flex items-center gap-3 px-5 py-2.5 rounded-full border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default">
        <div
          class="p-2 rounded-full transition-colors duration-300 bg-stone-100"
          :class="classOrStyle(badge.bg_color, 'backgroundColor').className"
          :style="classOrStyle(badge.bg_color, 'backgroundColor').style"
        >
           <img
             v-if="badge.image"
             :src="getImageUrl(badge.image)"
             alt="Badge"
             class="w-5 h-5 object-contain"
           />
           <component
             v-else
             :is="LucideIcons[badge.icon] || LucideIcons.Shield"
             class="w-5 h-5"
             :class="classOrStyle(badge.color, 'color').className || 'text-stone-500'"
             :style="classOrStyle(badge.color, 'color').style"
           />
        </div>
        <span class="font-bold text-stone-700 dark:text-stone-300 text-sm md:text-base whitespace-nowrap">
          {{ getLocalizedText(badge) }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.marquee-track {
  animation: marquee-scroll 40s linear infinite;
}

@keyframes marquee-scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    /* We use 3 sets, so we move by 1/3 of the total width */
    transform: translateX(calc(-100% / 3));
  }
}

.group\/marquee:hover .marquee-track {
  animation-play-state: paused;
}
</style>
