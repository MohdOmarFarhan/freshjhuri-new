<script setup>
import { router, Link } from '@inertiajs/vue3';
import { ref, computed, watch } from 'vue';
import { useLocalization } from '@/helper/localization';
import HomeLayout from '@/layouts/Home/HomeLayout.vue';

// Localization setup
const { locale, t } = useLocalization();
const getLocalizedField = (field) => `${field}_${locale.value}`;

// Props
const props = defineProps({
  products: Array,
  currentCategory: Object,
  categories: Array,
  productStatuses: Array,
});

// Filter & Sort State
const selectedCategory = ref(props.currentCategory.slug);
const selectedStatus = ref(null);
const minPrice = ref(0);
const maxPrice = ref(0);
const maxPriceLimit = ref(0);
const sortBy = ref('default');

// Initialize price range
const initializePriceRange = () => {
  if (props.products.length > 0) {
    const allPrices = [];
    props.products.forEach(product => {
      (product.variants || []).forEach(variant => {
        allPrices.push(variant.discount_price ?? variant.price);
      });
    });
    const validPrices = allPrices.filter(p => p !== null && p != undefined);
    if (validPrices.length) {
      maxPriceLimit.value = Math.max(...validPrices);
      if (maxPrice.value == 0 || maxPrice.value > maxPriceLimit.value) {
        maxPrice.value = maxPriceLimit.value;
      }
    }
  }
};

const formattedPrice = (price) => {
  return locale.value == "bn"
    ? `৳ ${new Intl.NumberFormat("bn-BD").format(price)}`
    : `৳ ${new Intl.NumberFormat("en-US").format(price)}`;
};

const getImageUrl = (path) => {
  if (!path) return null;
  const p = String(path);
  if (p.startsWith("http")) return p;
  if (p.startsWith("/")) return p;
  if (p.startsWith("storage/")) return `/${p}`;
  return `/storage/${p}`;
};

// Calculate discount percentage
const getDiscountPercentage = (product) => {
  const variants = product.variants || [];
  if (!variants.length) return 0;
  
  const variant = variants[0];
  if (!variant.discount_price || !variant.price) return 0;
  
  const discountPercent = Math.round(((variant.price - variant.discount_price) / variant.price) * 100);
  return discountPercent > 0 ? discountPercent : 0;
};

const getMinPrice = (product) => {
  const prices = (product.variants || [])
    .map(v => v.discount_price || v.price)
    .filter(p => p != null && p != undefined);
  return prices.length ? Math.min(...prices) : 0;
};

const getMaxPrice = (product) => {
  const prices = (product.variants || [])
    .map(v => v.price)
    .filter(p => p != null && p != undefined);
  return prices.length ? Math.max(...prices) : 0;
};

const getMaxDiscountPrice = (product) => {
  const prices = (product.variants || [])
    .map(v => v.discount_price ?? v.price)
    .filter(p => p != null && p != undefined);
  return prices.length ? Math.max(...prices) : 0;
};

const getRegularPrice = (product) => {
  const maxPrice = getMaxPrice(product);
  return maxPrice > 0 ? formattedPrice(maxPrice) : 'N/A';
};

const getDiscountPrice = (product) => {
  const minPrice = getMinPrice(product);
  return minPrice > 0 ? formattedPrice(minPrice) : null;
};

const getPrimaryVariant = (product) => {
  return (product?.variants || [])[0] || null;
};

const getVariantSizeLabel = (product) => {
  const variant = getPrimaryVariant(product);
  const size = variant?.size;
  if (!size) return '';

  const amount = size[`amount_${locale.value}`] ?? size.amount_en ?? '';
  const unit = size[`unit_${locale.value}`] ?? size.unit_en ?? '';
  return `${amount} ${unit}`.trim();
};

// Filtered and sorted products
const filteredAndSortedProducts = computed(() => {
  let filtered = props.products;


  // Filter by status/brand
  if (selectedStatus.value) {
    filtered = filtered.filter(p => p.product_status_id == selectedStatus.value);
  }

  // Filter by price range
  filtered = filtered.filter(product => {
    const minProd = getMinPrice(product);
    const maxProd = getMaxDiscountPrice(product);
    return minProd >= minPrice.value && maxProd <= maxPrice.value;
  });

  // Sort
  if (sortBy.value === 'price_low') {
    filtered.sort((a, b) => getMinPrice(a) - getMinPrice(b));
  } else if (sortBy.value == 'price_high') {
    filtered.sort((a, b) => getMinPrice(b) - getMinPrice(a));
  } else if (sortBy.value == 'newest') {
    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  return filtered;
});

// Add to cart handler
const addToCart = (product) => {
  if (!product.variants || !product.variants.length) {
    alert(t('no_variants_available'));
    return;
  }
  
  const variant = product.variants[0];
  router.post(route('cart.add'), {
    variant_id: variant.id,
    qty: 1
  }, {
    onSuccess: () => {
      // Optional: Show success message
    },
    onError: (e) => {
      console.error('Add to cart error:', e);
    }
  });
};

const onCategoryChange = (slug) => {
  if (!slug) return;
  if (slug === props.currentCategory.slug) return;

  router.get(route('productsoncategory', { slug }), {}, { preserveScroll: true });
};

// Clear filters
const clearFilters = () => {
  selectedCategory.value = props.currentCategory.slug;
  selectedStatus.value = null;
  minPrice.value = 0;
  sortBy.value = 'default';
};

watch(() => props.currentCategory.slug, (slug) => {
  selectedCategory.value = slug;
}, { immediate: true });

watch(() => props.products, () => {
  initializePriceRange();
}, { immediate: true });
</script>

<template>
  <HomeLayout :navbarFloating="true">
    <section class="py-8 mt-10 bg-light-initial dark:bg-dark-initial min-h-screen">
      <div class="mx-auto px-4 lg:px-8 max-w-7xl">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-accent-primary mb-2">
            {{ currentCategory[getLocalizedField('name')] }}
          </h1>
          <p class="text-muted-foreground">
            {{ filteredAndSortedProducts.length }} {{ t('products_found') }}
          </p>
        </div>

        <!-- Main Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <!-- Sidebar Filters -->
          <div class="lg:col-span-1">
            <div class="bg-card dark:bg-secondary rounded-lg border border-border p-4 sticky top-20">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-foreground">{{ t('filters') }}</h3>
                <button
                  @click="clearFilters"
                  class="text-xs text-primary hover:text-primary/80 transition-colors"
                  v-if="selectedCategory || selectedStatus || minPrice > 0"
                >
                  {{ t('clear_all') }}
                </button>
              </div>

              <!-- Filter by Category (Radio) -->
              <div class="mb-6 pb-4 border-b border-border">
                <h4 class="font-semibold text-foreground mb-3 text-sm">{{ t('filter_by_category') }}</h4>
                <div class="space-y-2">
                  <label v-for="category in categories" :key="category.id" class="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      :name="'category-filter'"
                      :value="category.slug"
                      v-model="selectedCategory"
                      @change="onCategoryChange(category.slug)"
                      class="w-4 h-4 accent-primary"
                    />
                    <span class="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      {{ category[getLocalizedField('name')] }}
                    </span>
                  </label>
                </div>
              </div>
 

              <!-- Filter by Price -->
              <div class="mb-6 pb-4 border-b border-border">
                <h4 class="font-semibold text-foreground mb-3 text-sm">{{ t('price') }}</h4>
                <div class="space-y-3">
                  <div class="flex gap-2">
                    <input
                      v-model.number="minPrice"
                      type="number"
                      :placeholder="t('min')"
                      class="w-full px-2 py-1 border border-border rounded text-sm bg-background text-foreground"
                    />
                    <span class="text-muted-foreground text-sm py-1">-</span>
                    <input
                      v-model.number="maxPrice"
                      type="number"
                      :placeholder="t('max')"
                      :max="maxPriceLimit"
                      class="w-full px-2 py-1 border border-border rounded text-sm bg-background text-foreground"
                    />
                  </div>
                  <button
                    @click="maxPrice = maxPriceLimit"
                    class="w-full px-3 py-2 bg-accent/20 text-primary hover:bg-primary/20 rounded text-xs font-medium transition-colors"
                  >
                    {{ t('go') }}
                  </button>
                </div>
              </div>

              <!-- Filter by Status/Brands -->
           
            </div>
          </div>

          <!-- Products Section -->
          <div class="lg:col-span-3">
            <!-- Sort Bar -->
            <div class="mb-6 flex justify-end">
              <div class="flex items-center gap-3">
                <label class="text-sm font-medium text-foreground">{{ t('sort_by') }}:</label>
                <select
                  v-model="sortBy"
                  class="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="default">{{ t('default_sorting') }}</option>
                  <option value="price_low">{{ t('price_low_to_high') }}</option>
                  <option value="price_high">{{ t('price_high_to_low') }}</option>
                  <option value="newest">{{ t('newest') }}</option>
                </select>
              </div>
            </div>

            <!-- Products Grid -->
            <div v-if="filteredAndSortedProducts.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="product in filteredAndSortedProducts"
                :key="product.id"
                class="group cursor-pointer"
              >
                <div class="rounded-lg overflow-hidden shadow-md bg-card dark:bg-secondary border border-border hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                  <!-- Image Container -->
                  <button
                    type="button"
                    class="relative overflow-hidden bg-muted h-48 sm:h-56 text-left w-full cursor-pointer"
                    @click.stop="addToCart(product)"
                    :aria-label="`${t('add_to_cart')}: ${product[getLocalizedField('title')]}`"
                  >
                    <!-- Badges -->
                    <div class="absolute top-3 left-3 right-3 flex justify-between items-start gap-2 z-10">
                      <span v-if="product.productStatus?.name_en" class="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase bg-orange-500 text-white">
                        {{ product.productStatus[getLocalizedField('name')] }}
                      </span>
                      <span v-if="getDiscountPercentage(product)" class="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase bg-green-500 text-white">
                        {{ t('save') }} {{ getDiscountPercentage(product) }}%
                      </span>
                    </div>

                    <!-- Product Image -->
                    <img
                      v-if="product.feature_image || product.hover_image"
                      :src="getImageUrl(product.feature_image || product.hover_image)"
                      :alt="product[getLocalizedField('title')]"
                      class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                      No Image
                    </div>
                  </button>

                  <!-- Content -->
                  <div class="flex-1 p-4 flex flex-col justify-between">
                    <!-- Title -->
                    <h3 class="font-semibold text-sm text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                      {{ product[getLocalizedField('title')] }}
                    </h3>

                    <!-- Package Size -->
                    <p v-if="getVariantSizeLabel(product)" class="text-xs text-muted-foreground font-medium mb-2">
                      {{ getVariantSizeLabel(product) }}
                    </p>

                    <!-- Pricing -->
                    <div class="flex items-center gap-2 mb-4">
                      <span v-if="getDiscountPrice(product)" class="text-lg font-bold text-primary">
                        {{ getDiscountPrice(product) }}
                      </span>
                      <span :class="[
                        'text-sm',
                        getDiscountPrice(product) ? 'line-through text-gray-500' : 'text-lg font-bold text-primary'
                      ]">
                        {{ getRegularPrice(product) }}
                      </span>
                    </div>

                    <!-- Add to Cart Button -->
                    <button
                      @click="addToCart(product)"
                      class="w-full px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors text-sm border border-primary"
                    >
                      🛒 {{ t('add_to_cart') }}
                    </button>
                  </div>

                  <!-- View Details Link -->
                  <div class="px-4 py-3 border-t border-border bg-muted/30 hover:bg-primary/5 transition-colors">
                    <Link
                      :href="route('product.details', { slug: product.slug })"
                      class="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      {{ t('view_details') }} →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-12">
              <div class="text-6xl mb-4">📦</div>
              <h3 class="text-lg font-semibold text-foreground mb-2">{{ t('no_products_found') }}</h3>
              <p class="text-muted-foreground mb-6">{{ t('try_adjusting_filters') }}</p>
              <button
                @click="clearFilters"
                class="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
              >
                {{ t('clear_all_filters') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </HomeLayout>
</template>
