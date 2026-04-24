<script setup>
import { Link, usePage } from '@inertiajs/vue3';
import { ArrowRight, ChevronLeft, ChevronRight, Phone, X } from 'lucide-vue-next';
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useLocalization } from '@/helper/localization';

const { locale, t } = useLocalization();
const page = usePage();

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

const currentLeftSlide = ref(0);
const leftAutoplayInterval = ref(null);

const autoplayDelay = 5000;
const upcomingAutoplayDelay = 9600;
const currentUpcomingSlide = ref(0);
const upcomingAutoplayInterval = ref(null);
const isMobile = ref(false);
const showUpcomingOverlay = ref(true);

/* Helpers */
const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/')) return path;
  if (path.startsWith('storage/')) return `/${path}`;
  return `/storage/${path}`;
};

const getLocalizedField = (bannar, field) => {
  return locale.value == 'bn'
    ? bannar[`${field}_bn`]
    : bannar[`${field}_en`];
};

const getLocalizedValue = (obj, field) => {
  if (!obj) return '';
  return (
    obj[`${field}_${locale.value}`] ??
    obj[`${field}_en`] ??
    obj[`${field}_bn`] ??
    obj[field] ??
    ''
  );
};

const commonSettings = computed(() => page.props.commonsetting ?? page.props.common_settings ?? {});
const preorderLabel = computed(() =>
  locale.value === 'bn' ? 'প্রি-অর্ডারের জন্য কল করুন' : 'Call for Pre-Order'
);

const activeLeftSlide = computed(() => {
  if (!props.bannars.length) return null;
  return props.bannars[currentLeftSlide.value] ?? null;
});

const loadedImageState = ref({});

const activeImageUrl = computed(() => {
  if (!activeLeftSlide.value?.image) return null;
  return getImageUrl(activeLeftSlide.value.image);
});

const markImageLoaded = (src) => {
  if (!src) return;
  loadedImageState.value = {
    ...loadedImageState.value,
    [src]: true,
  };
};

const isActiveImageLoaded = computed(() => {
  const src = activeImageUrl.value;
  return !!(src && loadedImageState.value[src]);
});

const badgeClass = computed(() => {
  return currentLeftSlide.value % 2 == 0
    ? 'border-accent/30 bg-accent/12 text-accent'
    : 'border-primary/30 bg-primary/12 text-primary';
});

const headingColorClass = computed(() => {
  const step = currentLeftSlide.value % 3;
  if (step == 0) return 'text-accent';
  if (step == 1) return 'text-primary';
  return 'text-background dark:text-foreground';
});

const badgeText = computed(() => {
  const slide = activeLeftSlide.value;
  if (!slide) return '';
  return String(getLocalizedField(slide, 'title') || '').trim();
});

const headingText = computed(() => {
  const slide = activeLeftSlide.value;
  if (!slide) return '';
  return String(getLocalizedField(slide, 'short_desc') || badgeText.value || '').trim();
});

const descriptionText = computed(() => {
  const slide = activeLeftSlide.value;
  if (!slide) return '';
  const value = String(getLocalizedField(slide, 'long_desc') || '').trim();
  if (!value || value == headingText.value) return '';
  return value;
});

const showBadge = computed(() => {
  return !!badgeText.value && badgeText.value != headingText.value;
});

const slugify = (value) => {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const availableCategorySlugs = computed(() => {
  const list =
    page.props.categories ??
    page.props.productMenuCategories ??
    page.props.product_menu_categories ??
    [];
  if (!Array.isArray(list)) return [];
  return list.map((item) => item?.slug).filter(Boolean);
});

const resolvedCategorySlug = computed(() => {
  const slide = activeLeftSlide.value;
  const direct = String(slide?.category_slug || '').trim();
  if (direct) return direct;

  const candidates = availableCategorySlugs.value;
  if (!candidates.length) return null;

  const haystack = slugify(
    `${slide?.title_en || ''} ${slide?.short_desc_en || ''} ${slide?.long_desc_en || ''}`
  );

  const matched = candidates
    .filter((slug) => haystack.includes(String(slug).toLowerCase()))
    .sort((a, b) => String(b).length - String(a).length)[0];

  return matched || null;
});

const ctaHref = computed(() => {
  const slug = resolvedCategorySlug.value;
  if (!slug) return null;
  return route('productsoncategory', { slug });
});

const upcomingHeading = computed(() => (locale.value === 'bn' ? 'আসছে শীঘ্রই' : 'Upcoming Products'));
const upcomingSubheading = computed(() => (locale.value === 'bn' ? 'নতুন পণ্য' : 'New Arrival'));

const upcomingProducts = computed(() => (props.upcomingProducts || []).slice(0, 6));
const activeUpcomingProduct = computed(() => {
  if (!upcomingProducts.value.length) return null;
  return upcomingProducts.value[currentUpcomingSlide.value] ?? null;
});

const nextUpcomingSlide = () => {
  if (!upcomingProducts.value.length) return;
  currentUpcomingSlide.value = (currentUpcomingSlide.value + 1) % upcomingProducts.value.length;
};

const prevUpcomingSlide = () => {
  if (!upcomingProducts.value.length) return;
  currentUpcomingSlide.value =
    (currentUpcomingSlide.value - 1 + upcomingProducts.value.length) % upcomingProducts.value.length;
};

const startUpcomingAutoplay = () => {
  stopUpcomingAutoplay();
  if (upcomingProducts.value.length > 1) {
    upcomingAutoplayInterval.value = setInterval(nextUpcomingSlide, upcomingAutoplayDelay);
  }
};

const stopUpcomingAutoplay = () => {
  if (upcomingAutoplayInterval.value) {
    clearInterval(upcomingAutoplayInterval.value);
    upcomingAutoplayInterval.value = null;
  }
};

const preorderHref = computed(() => {
  if (!commonSettings.value?.phone) return null;
  return `tel:${commonSettings.value.phone}`;
});

const upcomingOverlayVisible = computed(() => {
  return !isMobile.value || showUpcomingOverlay.value;
});

const updateIsMobile = () => {
  isMobile.value = window.matchMedia('(max-width: 767px)').matches;
};

const closeUpcomingOverlay = () => {
  showUpcomingOverlay.value = false;
  stopUpcomingAutoplay();
};

/* Left controls */
const nextLeftSlide = () => {
  if (!props.bannars.length) return;
  currentLeftSlide.value = (currentLeftSlide.value + 1) % props.bannars.length;
};

const prevLeftSlide = () => {
  if (!props.bannars.length) return;
  currentLeftSlide.value =
    (currentLeftSlide.value - 1 + props.bannars.length) % props.bannars.length;
};

const goToLeftSlide = (index) => {
  currentLeftSlide.value = index;
};

/* Autoplay */
const startLeftAutoplay = () => {
  stopLeftAutoplay();
  if (props.bannars.length > 1) {
    leftAutoplayInterval.value = setInterval(nextLeftSlide, autoplayDelay);
  }
};

const stopLeftAutoplay = () => {
  if (leftAutoplayInterval.value) {
    clearInterval(leftAutoplayInterval.value);
    leftAutoplayInterval.value = null;
  }
};

onMounted(() => {
  startLeftAutoplay();
  startUpcomingAutoplay();
  updateIsMobile();
  window.addEventListener('resize', updateIsMobile);
});

watch(activeImageUrl, (src) => {
  if (!src || loadedImageState.value[src]) return;

  const img = new Image();
  img.src = src;

  if (img.complete) {
    markImageLoaded(src);
    return;
  }

  img.onload = () => markImageLoaded(src);
}, { immediate: true });

onUnmounted(() => {
  stopLeftAutoplay();
  stopUpcomingAutoplay();
  window.removeEventListener('resize', updateIsMobile);
});

watch(upcomingProducts, () => {
  if (currentUpcomingSlide.value >= upcomingProducts.value.length) {
    currentUpcomingSlide.value = 0;
  }
  startUpcomingAutoplay();
}, { immediate: true });
</script>

<template>
  <section class="w-screen max-w-none p-0 m-0 banner-scrollbar">
    <div class="w-screen m-0 p-0" @mouseenter="stopLeftAutoplay" @mouseleave="startLeftAutoplay">
      <div class="relative w-screen m-0 p-0">
        <div class="relative h-140 md:h-144 w-screen overflow-hidden rounded-none shadow-none m-0 p-0">
          <template v-if="activeLeftSlide">
            <img
              :src="getImageUrl(activeLeftSlide.image)"
              :alt="getLocalizedField(activeLeftSlide, 'title') || 'Banner image'"
              class="h-full w-full object-cover object-right"
              @load="markImageLoaded(getImageUrl(activeLeftSlide.image))"
            />
            <div class="absolute inset-0 pointer-events-none">
              <div
                class="h-full w-full bg-[linear-gradient(to_right,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.42)_42%,rgba(0,0,0,0)_82%)] dark:bg-[linear-gradient(to_right,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.50)_45%,rgba(0,0,0,0)_85%)]"
              ></div>
            </div>

            <Transition name="banner-content" mode="out-in">
              <div v-if="isActiveImageLoaded" key="content" class="absolute inset-0 z-10 flex items-center">
                <div class="mx-auto w-full max-w-7xl px-4 md:px-10">
                  <div class="max-w-2xl">
                    <div
                      v-if="showBadge"
                      class="inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold tracking-wider backdrop-blur-sm"
                      :class="badgeClass"
                    >
                      {{ badgeText }}
                    </div>

                    <h1
                      v-if="headingText"
                      class="mt-5 text-3xl font-extrabold leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] sm:text-4xl md:text-5xl lg:text-6xl"
                      :class="headingColorClass"
                    >
                      {{ headingText }}
                    </h1>

                    <p v-if="descriptionText" class="mt-4 max-w-xl text-sm text-primary-foreground/80 sm:text-base">
                      {{ descriptionText }}
                    </p>

                    <div class="mt-7">
                      <Link
                        v-if="ctaHref"
                        :href="ctaHref"
                        class="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus:outline-none"
                      >
                        {{ t('explore_fruits') }}
                        <ArrowRight class="h-4 w-4" />
                      </Link>
                      <button
                        v-else
                        type="button"
                        disabled
                        class="inline-flex cursor-not-allowed items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm opacity-60"
                      >
                        {{ t('explore_fruits') }}
                        <ArrowRight class="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else key="skeleton" class="absolute inset-0 z-10 flex items-center">
                <div class="mx-auto w-full max-w-7xl px-4 md:px-10">
                  <div class="max-w-2xl">
                    <div class="wave-skeleton h-7 w-36 rounded-full"></div>
                    <div class="mt-5 wave-skeleton h-12 w-full max-w-[34rem] rounded-md"></div>
                    <div class="mt-3 wave-skeleton h-12 w-11/12 max-w-[30rem] rounded-md"></div>
                    <div class="mt-4 wave-skeleton h-4 w-10/12 max-w-[28rem] rounded"></div>
                    <div class="mt-2 wave-skeleton h-4 w-8/12 max-w-[22rem] rounded"></div>
                    <div class="mt-7 wave-skeleton h-11 w-40 rounded-md"></div>
                  </div>
                </div>
              </div>
            </Transition>
          </template>
          <div v-else class="flex h-full items-center justify-center bg-muted text-muted-foreground">
            No banner image available
          </div>

          <button
            v-if="bannars.length > 1"
            @click="prevLeftSlide"
            class="absolute left-4 top-1/2 z-20 -translate-y-1/2 flex items-center justify-center rounded-full bg-black/45 p-2 text-white transition hover:bg-black/60 focus:outline-none"
            style="height: 48px; width: 48px;"
            aria-label="Previous banner"
          >
            <ChevronLeft class="h-6 w-6" />
          </button>

          <button
            v-if="bannars.length > 1"
            @click="nextLeftSlide"
            class="absolute right-4 top-1/2 z-20 -translate-y-1/2 flex items-center justify-center rounded-full bg-black/45 p-2 text-white transition hover:bg-black/60 focus:outline-none"
            style="height: 48px; width: 48px;"
            aria-label="Next banner"
          >
            <ChevronRight class="h-6 w-6" />
          </button>

          <div v-if="bannars.length > 1" class="absolute bottom-4 left-4 z-20 flex items-center gap-2">
            <button
              v-for="(_, index) in bannars"
              :key="index"
              @click="goToLeftSlide(index)"
              class="h-2.5 rounded-full transition-all"
              :class="currentLeftSlide == index ? 'w-6 bg-primary' : 'w-2.5 bg-primary-foreground/70'"
              :aria-label="`Go to banner ${index + 1}`"
            />
          </div>

          <div
            v-if="activeUpcomingProduct && upcomingOverlayVisible"
            class="absolute z-30  w-[260px] h-[260px] sm:w-[300px] sm:h-[300px] right-3 bottom-3 md:right-20 md:top-4 md:bottom-auto"
            @mouseenter="stopUpcomingAutoplay"
            @mouseleave="startUpcomingAutoplay"
          >
            <div class="h-full w-full rounded-2xl border border-border bg-card/95 backdrop-blur-sm shadow-xl overflow-hidden">
              <div class="flex items-center justify-between border-b border-border px-3 py-2">
                <div>
                  <p class="text-[10px] uppercase tracking-wide text-primary font-semibold">{{ upcomingSubheading }}</p>
                  <h3 class="text-sm font-bold text-foreground">{{ upcomingHeading }}</h3>
                </div>
                <div class="flex items-center gap-1">
                  <button
                    v-if="isMobile"
                    type="button"
                    @click="closeUpcomingOverlay"
                    class="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-sm ring-1 ring-border hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Close"
                  >
                    <X class="h-4 w-4 text-primary" />
                  </button>
                  <button
                    type="button"
                    @click="prevUpcomingSlide"
                    class="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border text-foreground hover:bg-muted"
                    aria-label="Previous upcoming product"
                  >
                    <ChevronLeft class="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    @click="nextUpcomingSlide"
                    class="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border text-foreground hover:bg-muted"
                    aria-label="Next upcoming product"
                  >
                    <ChevronRight class="h-4 w-4" />
                  </button>
                </div>
              </div>

              <Transition name="upcoming-card" mode="out-in">
                <div :key="activeUpcomingProduct.id" class="h-[252px] flex flex-col">
                  <div class="block h-[134px] bg-muted">
                    <img
                      v-if="activeUpcomingProduct.product?.feature_image"
                      :src="`/${activeUpcomingProduct.product.feature_image}`"
                      :alt="getLocalizedValue(activeUpcomingProduct.product, 'title')"
                      class="h-full w-full object-cover"
                    />
                    <div v-else class="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                      No Image
                    </div>
                  </div>
                  <div class="flex-1 px-3 py-2">
                    <p class="text-[10px] uppercase font-semibold text-primary/80">
                      {{ activeUpcomingProduct.sku || activeUpcomingProduct.product?.sku || '' }}
                    </p>
                    <h4 class="mt-1 line-clamp-1 text-base font-bold text-foreground">
                      {{ getLocalizedValue(activeUpcomingProduct.product, 'title') }}
                    </h4>
                   
                    <div class="mt-3">
                      <a
                        v-if="preorderHref"
                        :href="preorderHref"
                        class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90"
                      >
                        <Phone class="h-4 w-4" />
                        {{ preorderLabel }}
                      </a>
                      <button
                        v-else
                        type="button"
                        disabled
                        class="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground opacity-60"
                      >
                        <Phone class="h-4 w-4" />
                        {{ preorderLabel }}
                      </button>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Thin left-side scrollbar for the banner section */
.banner-scrollbar {
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--primary)) hsl(var(--muted));
}

/* For Webkit browsers */
.banner-scrollbar::-webkit-scrollbar {
  width: 6px;
  background: hsl(var(--muted));
}
.banner-scrollbar::-webkit-scrollbar-thumb {
  background: hsl(var(--primary));
  border-radius: 3px;
}
.banner-scrollbar::-webkit-scrollbar-track {
  background: hsl(var(--muted));
}

.wave-skeleton {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.18) 25%,
    rgba(255, 255, 255, 0.34) 37%,
    rgba(255, 255, 255, 0.18) 63%
  );
  background-size: 400% 100%;
  animation: wave-loading 1.35s ease-in-out infinite;
}

@keyframes wave-loading {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}

.banner-content-enter-active,
.banner-content-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.banner-content-enter-from,
.banner-content-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.upcoming-card-enter-active,
.upcoming-card-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.upcoming-card-enter-from,
.upcoming-card-leave-to {
  opacity: 0;
  transform: translateX(14px);
}
</style>
