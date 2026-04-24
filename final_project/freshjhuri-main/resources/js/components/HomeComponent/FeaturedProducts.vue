<script setup>
import { Link, router } from "@inertiajs/vue3";
import { ShoppingCart, Package } from "lucide-vue-next";
import { useLocalization } from "@/helper/localization";

const { locale, t } = useLocalization();

const props = defineProps({
  featureProducts: Array,
  title: {
    type: String,
    default: null
  }
});

const getLocalizedValue = (obj, field) => {
  if (!obj) return "";
  return (
    obj[`${field}_${locale.value}`] ??
    obj[`${field}_en`] ??
    obj[`${field}_bn`] ??
    obj[field] ??
    ""
  );
};

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  if (path.startsWith("/")) return path;
  if (path.startsWith("storage/")) return `/${path}`;
  return `/storage/${path}`;
};

const formattedPrice = (price) => {
  return locale.value === "bn"
    ? `৳ ${new Intl.NumberFormat("bn-BD").format(price)}`
    : `৳ ${new Intl.NumberFormat("en-US").format(price)}`;
};

import { ref, computed } from 'vue';

const showAll = ref(false);
const filteredProducts = computed(() => {
  if (showAll.value) return props.featureProducts || [];
  return (props.featureProducts || []).slice(0, 8);
});

const getSku = (variant) => {
  return variant?.sku || variant?.product?.sku || "";
};

const getSizeText = (size) => {
  if (!size) return '';
  const amount = size[`amount_${locale.value}`] ?? size.amount_en ?? '';
  const unit = size[`unit_${locale.value}`] ?? size.unit_en ?? '';
  return `${amount} ${unit}`.trim();
};

const getSeasonBadgeClass = (season) => {
  if (!season) return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
  
  const seasonLower = season.toLowerCase();
  switch(seasonLower) {
    case 'upcoming':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
    case 'ongoing':
      return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
    case 'outofseason':
      return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
    default:
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
  }
};

const getSeasonLabel = (season) => {
  if (!season) return '';
  
  const seasonLower = season.toLowerCase();
  switch(seasonLower) {
    case 'upcoming':
      return t('upcoming') || 'Upcoming';
    case 'ongoing':
      return t('ongoing') || 'Ongoing';
    case 'outofseason':
      return t('out_of_season') || 'Out of Season';
    default:
      return season.charAt(0).toUpperCase() + season.slice(1);
  }
};

const shouldShowPrice = (variant) => {
  return variant.product?.season !== 'upcoming';
};

const getPriceDisplay = (variant) => {
  if (variant.discount_price) {
    return formattedPrice(variant.discount_price);
  }
  return formattedPrice(variant.price);
};

const getOriginalPrice = (variant) => {
  if (!shouldShowPrice(variant)) return null;
  if (variant.discount_price && variant.price) {
    return formattedPrice(variant.price);
  }
  return null;
};

const addToCart = (variant) => {
  if (variant.product?.season === 'upcoming') {
    alert(t('not_available_yet') || 'This product will be available soon!');
    return;
  }

  if (typeof fbq !== 'undefined') {
    fbq('track', 'AddToCart', {
      content_ids: [variant.id],
      content_type: 'product',
      value: (variant.discount_price || variant.price),
      currency: 'BDT'
    });
  }

  router.post(route('cart.add'), {
    variant_id: variant.id,
    qty: 1
  }, {
    onSuccess: () => {},
    onError: (e) => {
      console.error('Add to cart error:', e);
    }
  });
};

const sectionTitle = computed(() => {
  return props.title || t('featured_products');
});
</script>

<template>
  <section class="py-10 lg:py-12 section-bg">
    <div class="container mx-auto px-4 lg:px-8">
      
      <div class="flex items-end justify-between mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div>
          <span class="text-primary flex gap-2 font-semibold text-sm tracking-wider uppercase">
            <Package class="h-4 w-4" />
            {{ t('market') }}
          </span>
          <h2 class="text-xl lg:text-2xl font-bold text-foreground mt-3 text-left">
            {{ sectionTitle }}
          </h2>
        </div>
        <button
          v-if="props.featureProducts?.length > 8 && !showAll"
          @click="showAll = true"
          class="text-primary text-sm font-semibold flex items-center gap-1 hover:underline hover:text-primary/80 transition"
        >
          {{ t('all_products') }}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div v-if="filteredProducts.length" class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(variant, index) in filteredProducts"
          :key="variant.id"
          class="group relative bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 p-4 flex flex-col shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] min-h-105 card-bg product-card-hover"
          :style="{ animationDelay: `${index * 50}ms` }"
        >
          <Link :href="route('product.details', { slug: variant.product.slug })" class="block h-full">
            <div class="relative w-full h-48 bg-gray-50 dark:bg-zinc-800 rounded-lg overflow-hidden border border-zinc-100 dark:border-zinc-700 flex items-center justify-center">
              <img
                v-if="variant.product?.feature_image || variant.product?.hover_image"
                :src="getImageUrl(variant.product.feature_image || variant.product.hover_image)"
                :alt="getLocalizedValue(variant.product, 'title')"
                class="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div v-else class="flex items-center justify-center w-full h-full text-zinc-300 dark:text-zinc-600 text-4xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-12 h-12 mx-auto">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a4 4 0 004 4h10a4 4 0 004-4V7a4 4 0 00-4-4H7a4 4 0 00-4 4z" />
                </svg>
              </div>
              
              <div class="absolute top-2 left-0 w-full flex flex-row justify-between items-start px-3 z-10 pointer-events-none">
                <div class="flex gap-2">
                  <span v-if="variant.discount_price && variant.price && shouldShowPrice(variant)" class="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 text-xs font-semibold px-2 py-1 rounded shadow">
                    Save {{ Math.round(100 - (variant.discount_price / variant.price) * 100) }}%
                  </span>
                  <span v-if="variant.product && variant.product.is_free_shipping && shouldShowPrice(variant)" class="bg-blue-100 dark:bg-blue-900 text-accent dark:text-accent-light text-xs font-semibold px-2 py-1 rounded shadow">
                    {{ t('free_shipping') }}
                  </span>
                </div>
                
                <span 
                  v-if="variant.product?.season"
                  :class="getSeasonBadgeClass(variant.product.season)"
                  class="text-xs font-semibold px-2 py-1 rounded shadow"
                >
                  {{ getSeasonLabel(variant.product.season) }}
                </span>
              </div>
            </div>

            <div class="flex-1 flex flex-col gap-1 mt-2">
              <span v-if="getSku(variant)" class="text-[11px] font-semibold uppercase text-primary/80">
                {{ getSku(variant) }}
              </span>
              <h3 class="font-bold text-zinc-800 dark:text-zinc-100 text-base mb-1 group-hover:text-primary transition-colors duration-300 min-h-6">
                {{ getLocalizedValue(variant.product, "title") }}
              </h3>
              <div v-if="variant.size" class="text-xs text-zinc-500 dark:text-zinc-400 font-medium mb-2">
                {{ getSizeText(variant.size) }}
              </div>
              <div class="mt-auto pt-3 border-t border-zinc-100 dark:border-zinc-700 flex flex-row items-center justify-between gap-4">
                <div class="flex flex-col items-start min-w-17.5">
                  <span v-if="getOriginalPrice(variant)" class="text-xs text-zinc-400 dark:text-zinc-500 line-through">
                    {{ getOriginalPrice(variant) }}
                  </span>
                  <span 
                    class="text-lg font-bold text-zinc-800 dark:text-zinc-100"
                  >
                    {{ getPriceDisplay(variant) }}
                  </span>
                </div>
                
                <button
                  class="flex items-center gap-2 border border-primary dark:border-accent text-primary dark:text-accent font-semibold px-4 py-2 rounded transition hover:bg-primary hover:text-white dark:hover:bg-accent dark:hover:text-white bg-white dark:bg-zinc-900"
                  @click.stop="addToCart(variant)"
                >
                  <ShoppingCart class="h-5 w-5" />
                  {{ t('add_to_cart') }}
                </button>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div v-if="showAll && (props.featureProducts?.length > 8)" class="flex justify-center mt-8">
        <button @click="showAll = false" class="px-6 py-2 rounded bg-primary text-primary-foreground font-semibold shadow hover:bg-primary/90 transition">
          {{ t('see_less') }}
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Product Card Hover Effect */
.product-card-hover {
    transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1);
    will-change: transform, box-shadow;
}

.product-card-hover:hover,
.product-card-hover:focus-visible,
.group:hover .product-card-hover {
    transform: translateY(-18px) scale(1.35);
    z-index: 10;
    box-shadow: 0 12px 32px 0 rgba(36, 36, 36, 0.18), 0 2px 8px 0 rgba(0, 0, 0, 0.04);
}
</style>