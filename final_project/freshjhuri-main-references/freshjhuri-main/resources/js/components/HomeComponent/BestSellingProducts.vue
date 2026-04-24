
<script setup>
import { Link, router } from "@inertiajs/vue3";
import { Package, ShoppingCart } from "lucide-vue-next";
import { useLocalization } from "@/helper/localization";
import { ref, computed, onMounted } from 'vue';

const { locale, t } = useLocalization();

const props = defineProps({
  bestSellingProducts: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: ''
  }
});

// Debug: Log the received props
onMounted(() => {
  console.log('BestSellingProducts Component Mounted');
  console.log('Props received:', props.bestSellingProducts);
  console.log('Is array:', Array.isArray(props.bestSellingProducts));
  console.log('Length:', props.bestSellingProducts?.length);
  
  if (props.bestSellingProducts?.length > 0) {
    console.log('First item:', props.bestSellingProducts[0]);
    console.log('First item product:', props.bestSellingProducts[0]?.product);
  }
});

// Ensure we have an array and filter out invalid items
const bestSellingProductsArray = computed(() => {
  if (!Array.isArray(props.bestSellingProducts)) {
    console.warn('bestSellingProducts is not an array:', props.bestSellingProducts);
    return [];
  }
  return props.bestSellingProducts;
});

// Filter valid products (must have product and product.slug)
const validProducts = computed(() => {
  const products = bestSellingProductsArray.value.filter(variant => {
    if (!variant) return false;
    if (!variant.product) return false;
    if (!variant.product.slug) return false;
    return true;
  });
  
  console.log('Valid products count:', products.length);
  return products;
});

const showAll = ref(false);

const displayProducts = computed(() => {
  if (showAll.value) return validProducts.value;
  return validProducts.value.slice(0, 8);
});

const getLocalizedValue = (obj, field) => {
  if (!obj || typeof obj !== 'object') return "";
  return (
    obj[`${field}_${locale.value}`] ??
    obj[`${field}_en`] ??
    obj[`${field}_bn`] ??
    obj[field] ??
    ""
  );
};

const formattedPrice = (price) => {
  if (!price) return "৳ 0";
  return locale.value === "bn"
    ? `৳ ${new Intl.NumberFormat("bn-BD").format(price)}`
    : `৳ ${new Intl.NumberFormat("en-US").format(price)}`;
};

const getSku = (variant) => {
  return variant?.sku || variant?.product?.sku || "";
};

const addToCart = (variant) => {
  if (typeof fbq != 'undefined') {
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
  });
};
</script>

<template>
  <section v-if="validProducts.length" id="" class="py-10  lg:py-12 section-bg">
    <div class="container mx-auto px-4 lg:px-8">
      <div class="flex items-end justify-between mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div>
            <span class="text-primary flex gap-2 font-semibold text-sm tracking-wider uppercase">
            <Package class="h-4 w-4" />
            {{ t('best_selling') }}
          </span>
          <h2 class="text-xl lg:text-2xl font-bold text-foreground mt-3 text-left">
            {{ title || t('best_selling_products') }}
          </h2>
        </div>
        <button
          v-if="bestSellingProductsArray.length > 8 && !showAll"
          @click="showAll = true"
          class="text-primary text-sm font-semibold flex items-center gap-1 hover:underline hover:text-primary/80 transition"
        >
          {{ t('all_products') }}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(variant, index) in displayProducts"
          :key="variant.id"
          class="group relative bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 p-4 flex flex-col shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] min-h-105 product-card-hover"
          :style="{ animationDelay: `${index * 50}ms` }"
        >
          <Link :href="route('product.details', { slug: variant.product.slug })" class="block h-full">
            <div class="relative w-full h-48 bg-gray-50 dark:bg-zinc-800 rounded-lg overflow-hidden border border-zinc-100 dark:border-zinc-700 flex items-center justify-center">
              <img
                v-if="variant.product?.feature_image"
                :src="`/${variant.product.feature_image}`"
                :alt="getLocalizedValue(variant.product, 'title')"
                class="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div v-else class="flex items-center justify-center w-full h-full text-zinc-300 dark:text-zinc-600 text-4xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-12 h-12 mx-auto">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a4 4 0 004 4h10a4 4 0 004-4V7a4 4 0 00-4-4H7a4 4 0 00-4 4z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11a4 4 0 018 0" />
                </svg>
              </div>
              <div class="absolute top-2 left-0 w-full flex flex-row justify-between items-start px-3 z-10 pointer-events-none">
                <span v-if="variant.discount_price && variant.price" class="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 text-xs font-semibold px-2 py-1 rounded shadow pointer-events-auto">Save {{ Math.round(100 - (variant.discount_price / variant.price) * 100) }}%</span>
                <span v-if="variant.product && variant.product.is_free_shipping" class="bg-blue-100 dark:bg-blue-900 text-accent dark:text-accent-light text-xs font-semibold px-2 py-1 rounded shadow pointer-events-auto">{{ t('free_shipping') }}</span>
              </div>
            </div>
            <div class="flex-1 flex flex-col gap-1 mt-2">
              <span v-if="getSku(variant)" class="text-[11px] font-semibold uppercase text-primary/80 ">
                {{ getSku(variant) }}
              </span>
              <h3 class="font-bold text-zinc-800 dark:text-zinc-100 text-base mb-1 group-hover:text-primary transition-colors duration-300 min-h-6">
                {{ getLocalizedValue(variant.product, "title") }}
              </h3>
              <div v-if="variant.size" class="text-xs text-zinc-500 dark:text-zinc-400 font-medium mb-2">
                {{ (variant.size[`amount_${locale}`] || variant.size.amount_en || '') + ' ' + (variant.size[`unit_${locale}`] || variant.size.unit_en || '') }}
              </div>
              <div class="mt-auto pt-3 border-t border-zinc-100 dark:border-zinc-700 flex flex-row items-center justify-between gap-4">
                <div class="flex flex-col items-start min-w-17.5">
                  <span v-if="variant.discount_price" class="text-xs text-zinc-400 dark:text-zinc-500 line-through">
                    {{ formattedPrice(variant.price) }}
                  </span>
                  <span class="text-lg font-bold text-zinc-800 dark:text-zinc-100">
                    {{ formattedPrice(variant.discount_price || variant.price) }}
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
    </div>
  </section>
</template>

