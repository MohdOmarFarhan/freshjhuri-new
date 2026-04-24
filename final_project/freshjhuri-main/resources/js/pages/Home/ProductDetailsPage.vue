<script setup>
import { router, usePage } from '@inertiajs/vue3';
import { Minus, Plus, ChevronLeft, ChevronRight, ShoppingBag, MessageCircle, Phone } from 'lucide-vue-next';
import { ref, computed, onMounted, watch } from 'vue';
import FeaturedProducts from '@/components/HomeComponent/FeaturedProducts.vue';
import { useLocalization } from '@/helper/localization';
import HomeLayout from '@/layouts/Home/HomeLayout.vue';

const page = usePage();
const common_settings = computed(() => page.props.common_settings);
const { locale, t, toBanglaNumber, toEnglishNumber } = useLocalization();
const getLocalizedField = (field) => `${field}_${locale.value}`;

const props = defineProps({
  product: Object,
  variants: Array,
  relatedVariants: Array,
  reviews: {
    type: Array,
    default: () => [],
  },
});

const formattedPrice = (value) => {
  const price = Number(value) || 0;
  return locale.value === 'bn'
    ? `৳${new Intl.NumberFormat('bn-BD').format(price)}`
    : `৳${new Intl.NumberFormat('en-US').format(price)}`;
};

const sortedVariants = computed(() => {
  return [...(props.variants || [])].sort((a, b) => {
    const amountA = parseFloat(a.size?.amount_en || a.size?.amount || 0) || 0;
    const amountB = parseFloat(b.size?.amount_en || b.size?.amount || 0) || 0;
    if (amountA === amountB) return (a.id || 0) - (b.id || 0);
    return amountA - amountB;
  });
});

const galleryImages = computed(() => {
  const images = [];
  if (props.product?.feature_image) {
    images.push(props.product.feature_image);
  }
  (props.product?.slider_images || []).forEach((img) => {
    if (img?.slider_image) {
      images.push(img.slider_image);
    }
  });
  return images;
});

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/')) return path;
  if (path.startsWith('storage/')) return `/${path}`;
  return `/storage/${path}`;
};

const activeImageIndex = ref(0);

watch(galleryImages, (images) => {
  if (!images.length) {
    activeImageIndex.value = 0;
    return;
  }
  if (activeImageIndex.value >= images.length) {
    activeImageIndex.value = 0;
  }
}, { immediate: true });

const nextImage = () => {
  if (!galleryImages.value.length) return;
  activeImageIndex.value = (activeImageIndex.value + 1) % galleryImages.value.length;
};

const prevImage = () => {
  if (!galleryImages.value.length) return;
  activeImageIndex.value = (activeImageIndex.value - 1 + galleryImages.value.length) % galleryImages.value.length;
};

const firstVariant = computed(() => sortedVariants.value[0] || null);
const selectedSize = ref(firstVariant.value?.size?.id || null);

watch(firstVariant, (value) => {
  if (!selectedSize.value && value?.size?.id) {
    selectedSize.value = value.size.id;
  }
}, { immediate: true });

const availableSizes = computed(() => sortedVariants.value.map((variant) => variant.size).filter(Boolean));
const selectedVariant = computed(() => sortedVariants.value.find((v) => v.size?.id === selectedSize.value) || null);
const stockAvailability = computed(() => selectedVariant.value?.stock || 0);
const isFreeShipping = computed(() => !!props.product?.is_free_shipping);

const quantity = ref(1);
const activeTab = ref('description');
const processing = ref(null);

const reviewCount = computed(() => (props.reviews || []).length);
const averageRating = computed(() => {
  if (!reviewCount.value) return 0;
  const total = (props.reviews || []).reduce((sum, review) => sum + Number(review.rating || 0), 0);
  return (total / reviewCount.value).toFixed(1);
});

const localizedReviewComment = (review) => {
  const primary = locale.value === 'bn' ? review?.comment_bn : review?.comment_en;
  const fallback = locale.value === 'bn' ? review?.comment_en : review?.comment_bn;
  return primary || fallback || '';
};

const onQuantityInput = (event) => {
  let val = toEnglishNumber(event.target.value || '');
  if (val === '') {
    quantity.value = '';
    return;
  }
  val = val.replace(/[^0-9]/g, '');
  quantity.value = val === '' ? '' : parseInt(val, 10);
};

const onQuantityBlur = (event) => {
  let val = quantity.value;
  if (val === '' || Number.isNaN(Number(val)) || Number(val) < 1) {
    val = 1;
  }
  if (stockAvailability.value > 0 && Number(val) > stockAvailability.value) {
    val = stockAvailability.value;
  }
  quantity.value = Number(val);
  if (event?.target) {
    event.target.value = locale.value === 'bn' ? toBanglaNumber(quantity.value) : quantity.value;
  }
};

watch(stockAvailability, (stock) => {
  if (stock > 0 && Number(quantity.value) > stock) {
    quantity.value = stock;
  }
  if (stock <= 0) {
    quantity.value = 1;
  }
});

const addToCart = (buyNow = false) => {
  if (!selectedVariant.value || stockAvailability.value === 0) {
    return;
  }

  if (typeof fbq !== 'undefined') {
    fbq('track', 'AddToCart', {
      content_ids: [selectedVariant.value.id],
      content_type: 'product',
      value: (selectedVariant.value.discount_price || selectedVariant.value.price) * Number(quantity.value || 1),
      currency: 'BDT',
    });
  }

  processing.value = buyNow ? 'order' : 'cart';

  router.post(route('cart.add'), {
    variant_id: selectedVariant.value.id,
    qty: Number(quantity.value || 1),
    buy_now: buyNow,
  }, {
    preserveScroll: true,
    onFinish: () => {
      processing.value = null;
    },
  });
};

onMounted(() => {
  if (typeof fbq !== 'undefined') {
    const currentPrice = selectedVariant.value
      ? (selectedVariant.value.discount_price || selectedVariant.value.price)
      : (props.product.price || 0);

    fbq('track', 'ViewContent', {
      content_ids: [props.product.id],
      content_type: 'product',
      content_name: props.product.title_en,
      value: currentPrice,
      currency: 'BDT',
    });
  }
});
</script>

<template>
  <HomeLayout :navbarFloating="true">
    <section class="w-full bg-background pt-6 pb-10">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p class="mb-3 text-xs text-muted-foreground">
          Home <span class="mx-1">&gt;</span> Products
        </p>

        <div class="product-details-shell p-4 md:p-6">
          <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div class="lg:col-span-6">
              <div class="flex gap-3">
                <div class="w-16 space-y-2 sm:w-20">
                  <button
                    v-for="(img, index) in galleryImages"
                    :key="img + index"
                    type="button"
                    class="product-details-thumb flex h-16 w-full items-center justify-center rounded-md p-1 transition sm:h-20"
                    :class="activeImageIndex === index ? 'product-details-thumb--active' : ''"
                    @click="activeImageIndex = index"
                  >
                    <img :src="getImageUrl(img)" alt="thumbnail" class="h-full w-full object-contain" />
                  </button>
                </div>

                <div class="product-details-main-image relative flex-1 rounded-lg p-3">
                  <img
                    v-if="galleryImages.length"
                    :src="getImageUrl(galleryImages[activeImageIndex])"
                    :alt="product[getLocalizedField('title')]"
                    class="mx-auto h-72 w-full object-contain"
                  />
                  <div v-else class="mx-auto h-72 w-full rounded bg-muted" />

                  <button
                    type="button"
                    class="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-card/90 p-1 text-muted-foreground shadow backdrop-blur"
                    @click="prevImage"
                  >
                    <ChevronLeft class="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    class="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-card/90 p-1 text-muted-foreground shadow backdrop-blur"
                    @click="nextImage"
                  >
                    <ChevronRight class="h-4 w-4" />
                  </button>

                  <span
                    v-if="isFreeShipping"
                    class="product-details-badge absolute left-3 top-3 bg-primary/15 text-primary"
                  >
                    {{ locale === 'bn' ? 'ফ্রি শিপিং' : 'Free Shipping' }}
                  </span>
                </div>
              </div>
            </div>

            <div class="lg:col-span-6">
              <h1 class="text-2xl font-semibold text-foreground md:text-4xl">
                {{ product[getLocalizedField('title')] }}
              </h1>

              <div class="mt-3 flex items-end gap-3">
                <span v-if="selectedVariant" class="text-3xl font-bold text-primary">
                  {{ formattedPrice(selectedVariant.discount_price || selectedVariant.price) }}
                </span>
                <span
                  v-if="selectedVariant?.discount_price"
                  class="text-base text-muted-foreground line-through"
                >
                  {{ formattedPrice(selectedVariant.price) }}
                </span>
              </div>

              <div class="mt-4 border-t border-border pt-4">
                <div class="mb-4 flex items-center gap-3">
                  <span class="text-sm text-foreground">{{ t('quantity') || 'Quantity' }}:</span>
                  <div class="product-details-surface flex items-center rounded">
                    <button
                      type="button"
                      class="px-2 py-2 text-muted-foreground hover:bg-muted"
                      :disabled="quantity <= 1"
                      @click="quantity > 1 ? quantity-- : quantity = 1"
                    >
                      <Minus class="h-4 w-4" />
                    </button>
                    <input
                      type="text"
                      :value="quantity === '' ? '' : (locale === 'bn' ? toBanglaNumber(quantity) : quantity)"
                      @input="onQuantityInput"
                      @blur="onQuantityBlur"
                      class="w-12 border-none bg-transparent text-center text-sm font-medium focus:ring-0"
                    />
                    <button
                      type="button"
                      class="px-2 py-2 text-muted-foreground hover:bg-muted"
                      :disabled="quantity >= stockAvailability"
                      @click="quantity < stockAvailability ? quantity++ : quantity = stockAvailability"
                    >
                      <Plus class="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div class="mb-4 flex flex-wrap gap-2">
                  <button
                    v-for="size in availableSizes"
                    :key="size.id"
                    type="button"
                    @click="selectedSize = size.id"
                    class="rounded border px-3 py-1.5 text-xs font-semibold transition"
                    :class="selectedSize === size.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary'"
                  >
                    {{ size[getLocalizedField('amount')] }} {{ size[getLocalizedField('unit')] }}
                  </button>
                </div>

                <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    class="inline-flex items-center justify-center rounded bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
                    :class="!selectedVariant || stockAvailability === 0 ? 'cursor-not-allowed opacity-50' : ''"
                    :disabled="!!processing || !selectedVariant || stockAvailability === 0"
                    @click="addToCart(false)"
                  >
                    <ShoppingBag class="mr-2 h-4 w-4" />
                    {{ t('addtocart') || 'ADD TO CART' }}
                  </button>

                  <button
                    type="button"
                    class="inline-flex items-center justify-center rounded bg-foreground px-4 py-3 text-sm font-bold text-background transition hover:opacity-90"
                    :class="!selectedVariant || stockAvailability === 0 ? 'cursor-not-allowed opacity-50' : ''"
                    :disabled="!!processing || !selectedVariant || stockAvailability === 0"
                    @click="addToCart(true)"
                  >
                    {{ t('ordernow') || 'BUY NOW' }}
                  </button>

                  <a
                    v-if="common_settings?.whatsapp"
                    :href="`https://wa.me/${common_settings.whatsapp}`"
                    target="_blank"
                    rel="noopener"
                    class="inline-flex items-center justify-center rounded bg-accent px-4 py-3 text-sm font-bold text-accent-foreground transition hover:opacity-90"
                  >
                    <MessageCircle class="mr-2 h-4 w-4" />
                    Order On WhatsApp
                  </a>

                  <a
                    v-if="common_settings?.phone"
                    :href="`tel:${common_settings.phone}`"
                    class="inline-flex items-center justify-center rounded bg-secondary px-4 py-3 text-sm font-bold text-secondary-foreground transition hover:opacity-90"
                  >
                    <Phone class="mr-2 h-4 w-4" />
                    Call For Order
                  </a>
                </div>

                <div class="mt-4 rounded border border-border px-3 py-2 text-sm product-details-surface">
                  <span class="text-muted-foreground">Brand:</span>
                  <span class="ml-2 font-semibold">{{ product?.category?.name_en || 'N/A' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 product-details-panel p-2">
          <button
            type="button"
            class="mr-2 rounded px-4 py-2 text-sm font-medium product-details-tab"
            :class="activeTab === 'description' ? 'product-details-tab--active' : ''"
            @click="activeTab = 'description'"
          >
            Description
          </button>
          <button
            type="button"
            class="rounded px-4 py-2 text-sm font-medium product-details-tab"
            :class="activeTab === 'conservation' ? 'product-details-tab--active' : ''"
            @click="activeTab = 'conservation'"
          >
            {{ locale === 'bn' ? 'সংরক্ষণ' : 'Conservation' }}
          </button>
          <button
            type="button"
            class="rounded px-4 py-2 text-sm font-medium product-details-tab"
            :class="activeTab === 'reviews' ? 'product-details-tab--active' : ''"
            @click="activeTab = 'reviews'"
          >
            {{ locale === 'bn' ? 'কাস্টমার রিভিউ' : 'Customer Reviews' }} ({{ reviewCount }})
          </button>
        </div>

        <div class="mt-4 product-details-panel p-6">
          <template v-if="activeTab === 'description'">
            <h2 class="text-3xl font-bold text-foreground">Product Details</h2>
            <div class="mt-2 h-1 w-16 rounded bg-primary" />

            <p class="mt-6 whitespace-pre-line text-sm leading-7 text-foreground/90">
              {{ product[getLocalizedField('description')] || product[getLocalizedField('short_desc')] || 'No details available.' }}
            </p>

            <div v-if="product?.product_features?.length" class="mt-8">
              <h3 class="text-lg font-semibold text-foreground">Key Features:</h3>
              <ul class="product-details-feature-list mt-3 space-y-2 text-sm text-foreground/90">
                <li v-for="(feature, index) in product.product_features" :key="index" class="flex items-start gap-2 p-3">
                  <span class="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{{ feature[getLocalizedField('feature')] }}</span>
                </li>
              </ul>
            </div>
          </template>

          <template v-else-if="activeTab === 'conservation'">
            <h2 class="text-3xl font-bold text-foreground">{{ locale === 'bn' ? 'সংরক্ষণ' : 'Conservation' }}</h2>
            <div class="mt-2 h-1 w-16 rounded bg-primary" />

            <p class="mt-6 whitespace-pre-line text-sm leading-7 text-foreground/90">
              {{ product[getLocalizedField('conservation')] || (locale === 'bn' ? 'কোনো সংরক্ষণ তথ্য নেই।' : 'No conservation details available.') }}
            </p>
          </template>

          <template v-else>
            <h2 class="text-xl font-semibold text-foreground">
              {{ locale === 'bn' ? 'কাস্টমার রিভিউ' : 'Customer Reviews' }}
            </h2>
            <p v-if="reviewCount" class="mt-2 text-sm text-muted-foreground">
              {{ locale === 'bn' ? 'গড় রেটিং' : 'Average Rating' }}: {{ averageRating }}/5
            </p>
            <div v-if="reviewCount" class="mt-4 space-y-4">
              <div
                v-for="review in reviews"
                :key="review.id"
                class="rounded-lg border border-border bg-card p-4"
              >
                <div class="flex items-center justify-between gap-3">
                  <p class="font-semibold text-foreground">{{ review.user?.name || 'User' }}</p>
                  <p class="text-sm text-primary">{{ '★'.repeat(Number(review.rating || 0)) }}</p>
                </div>
                <p class="mt-2 text-sm text-muted-foreground whitespace-pre-line">
                  {{ localizedReviewComment(review) }}
                </p>
              </div>
            </div>
            <p v-else class="mt-3 text-sm text-muted-foreground">
              {{ locale === 'bn' ? 'এখনও কোনো রিভিউ নেই।' : 'No reviews yet.' }}
            </p>
          </template>
        </div>
      </div>
    </section>

    <div class="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <FeaturedProducts
        :featureProducts="relatedVariants"
        :title="t('relatedproducts')"
      />
    </div>
  </HomeLayout>
</template>

<style scoped>
button:disabled {
  cursor: not-allowed;
}
</style>
