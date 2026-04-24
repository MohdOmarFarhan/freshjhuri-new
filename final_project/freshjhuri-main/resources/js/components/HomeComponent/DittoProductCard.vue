<script setup>
import { Link, router } from '@inertiajs/vue3';
import { computed, onBeforeUnmount, ref } from 'vue';
import { CheckCircle, ShoppingCart, Zap } from 'lucide-vue-next';
import { useLocalization } from '@/helper/localization';

const props = defineProps({
  variant: {
    type: Object,
    required: true,
  },
  fallbackImage: {
    type: String,
    default: null,
  },
});

const { locale } = useLocalization();

const isAdded = ref(false);
const timeoutId = ref(null);

onBeforeUnmount(() => {
  if (timeoutId.value) window.clearTimeout(timeoutId.value);
});

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/')) return path;
  if (path.startsWith('storage/')) return `/${path}`;
  return `/storage/${path}`;
};

const imageSrc = computed(() => {
  const p = props.variant?.product;
  const raw = p?.feature_image || p?.hover_image || props.fallbackImage;
  return raw ? getImageUrl(raw) : null;
});

const title = computed(() => {
  const p = props.variant?.product;
  if (!p) return '';
  return locale.value === 'bn' ? p.title_bn : p.title_en;
});

const subtitle = computed(() => {
  const p = props.variant?.product;
  if (!p) return '';
  return locale.value === 'bn' ? p.title_en : p.title_bn;
});

const unit = computed(() => {
  const size = props.variant?.size;
  if (!size) return '';
  const amount = size[`amount_${locale.value}`] ?? size.amount_en ?? '';
  const u = size[`unit_${locale.value}`] ?? size.unit_en ?? '';
  return `${amount} ${u}`.trim();
});

const price = computed(() => props.variant?.discount_price ?? props.variant?.price ?? 0);
const originalPrice = computed(() => {
  if (!props.variant?.discount_price) return null;
  return props.variant?.price ?? null;
});

const badgeText = computed(() => {
  const v = props.variant;
  if (!v?.discount_price || !v?.price) return null;
  const percent = Math.round(100 - (v.discount_price / v.price) * 100);
  if (!Number.isFinite(percent) || percent <= 0) return null;
  return `Save ${percent}%`;
});

const addToCart = (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (isAdded.value) return;

  router.post(
    route('cart.add'),
    { variant_id: props.variant.id, qty: 1 },
    {
      preserveScroll: true,
      onSuccess: () => {
        isAdded.value = true;
        if (timeoutId.value) window.clearTimeout(timeoutId.value);
        timeoutId.value = window.setTimeout(() => {
          isAdded.value = false;
          timeoutId.value = null;
        }, 2000);
      },
    }
  );
};

const buyNow = (e) => {
  e.preventDefault();
  e.stopPropagation();

  router.post(
    route('cart.add'),
    { variant_id: props.variant.id, qty: 1 },
    {
      preserveScroll: true,
      onSuccess: () => {
        router.visit(route('checkout.index'));
      },
    }
  );
};
</script>

<template>
  <div
    class="bg-white dark:bg-stone-900 rounded-2xl p-4 shadow-sm hover:shadow-primary-green/20 dark:hover:shadow-none transition-all duration-300 group border border-stone-100 dark:border-stone-800 flex flex-col h-full"
  >
    <Link
      :href="variant.product ? route('product.details', { slug: variant.product.slug }) : '#'"
      class="flex-1 flex flex-col"
    >
      <div class="relative w-full aspect-square bg-amber-50/50 dark:bg-stone-800 rounded-xl overflow-hidden mb-4">
        <div
          v-if="badgeText"
          class="absolute top-2 left-2 z-10 bg-primary-green/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg animate-pulse-slow"
        >
          <Zap class="w-3 h-3 text-honey-gold-light" />
          {{ badgeText }}
        </div>

        <div class="w-full h-full relative transition-transform duration-300 group-hover:scale-[1.08]">
          <img
            v-if="imageSrc"
            :src="imageSrc"
            :alt="title || 'Product'"
            class="w-full h-full object-cover"
            loading="lazy"
          />
          <div
            v-else
            class="w-full h-full flex items-center justify-center text-xs text-stone-400 dark:text-stone-500"
          >
            No image
          </div>
        </div>
      </div>

      <div class="flex-1 flex flex-col">
        <p v-if="subtitle" class="text-sm text-stone-500 mb-1">{{ subtitle }}</p>
        <h3
          class="text-lg font-semibold text-stone-800 dark:text-stone-100 leading-tight mb-2 line-clamp-2 group-hover:text-primary-green transition-colors"
        >
          {{ title }}
        </h3>

        <div class="mt-auto pt-4 flex items-center justify-between">
          <div class="flex flex-col">
            <span class="text-xl font-bold text-primary-green flex items-baseline">
              ৳{{ price }}
              <span v-if="unit" class="text-sm font-semibold text-stone-400 dark:text-stone-500 ml-1">/{{ unit }}</span>
            </span>
            <del
              v-if="originalPrice"
              class="text-sm text-stone-400 dark:text-stone-600"
            >
              ৳{{ originalPrice }}
              <span v-if="unit" class="text-xs">/{{ unit }}</span>
            </del>
          </div>
        </div>
      </div>
    </Link>

    <div class="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-stone-100 dark:border-stone-800">
      <button
        type="button"
        @click="addToCart"
        :disabled="isAdded"
        :class="[
          'flex items-center justify-center py-2.5 rounded-xl font-medium transition-all',
          isAdded
            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-none'
            : 'border-2 border-primary-green text-primary-green hover:bg-primary-green/5',
        ]"
      >
        <Transition name="scale-fade" mode="out-in">
          <span v-if="isAdded" key="added" class="flex items-center gap-1">
            <CheckCircle class="w-4 h-4" />
            Added
          </span>
          <span v-else key="cart" class="flex items-center gap-2">
            <ShoppingCart class="w-4 h-4" />
            Cart
          </span>
        </Transition>
      </button>

      <button
        type="button"
        @click="buyNow"
        class="bg-primary-green hover:bg-primary-green-hover text-white py-2.5 rounded-xl font-medium shadow-md shadow-primary-green/20 transition-all flex items-center justify-center"
      >
        Buy Now
      </button>
    </div>
  </div>
</template>

<style scoped>
@keyframes pulseSlow {
  0%,
  100% {
    opacity: 0.92;
    transform: translate3d(0, 0, 0) scale(1);
  }
  50% {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1.03);
  }
}

.animate-pulse-slow {
  animation: pulseSlow 2.4s ease-in-out infinite;
}

.scale-fade-enter-active,
.scale-fade-leave-active {
  transition: transform 160ms ease, opacity 160ms ease;
}

.scale-fade-enter-from,
.scale-fade-leave-to {
  opacity: 0;
  transform: scale(0.92);
}
</style>

