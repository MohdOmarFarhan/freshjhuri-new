<script setup>
import { router, usePage } from '@inertiajs/vue3';
import {
  Minus,
  Plus,
  ShoppingCart,
  ShieldCheck,
  Share2,
  Star,
  CheckCircle2,
  Play,
  ZoomIn,
  MapPin,
  Activity,
  ShoppingBag,
  Check,
  Truck,
} from 'lucide-vue-next';
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue';
import FeaturedProducts from '@/components/HomeComponent/FeaturedProducts.vue';
import { useLocalization } from '@/helper/localization';
import HomeLayout from '@/layouts/Home/HomeLayout.vue';
import DittoFloatingParticles from '@/components/HomeComponent/DittoFloatingParticles.vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';

const page = usePage();
const common_settings = computed(() => page.props.common_settings);
const { locale, t, toBanglaNumber, toEnglishNumber } = useLocalization();
const getLocalizedField = (field) => `${field}_${locale.value}`;

const props = defineProps({
  product: Object,
  variants: Array,
  relatedVariants: Array,
  ratingSummary: {
    type: Object,
    default: () => ({ avg: 0, count: 0 }),
  },
  fbtVariants: {
    type: Array,
    default: () => [],
  },
  fbtDiscountPercent: {
    type: Number,
    default: 5,
  },
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

const galleryContainerRef = ref(null);
const isZooming = ref(false);
const zoomPos = ref({ x: 0, y: 0 });

const onGalleryMouseMove = (e) => {
  const el = galleryContainerRef.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const x = ((e.pageX - rect.left - window.scrollX) / rect.width) * 100;
  const y = ((e.pageY - rect.top - window.scrollY) / rect.height) * 100;
  zoomPos.value = { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
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
const showScarcity = computed(() => stockAvailability.value > 0 && stockAvailability.value < 20);

const productBadge = computed(() => {
  const badge = locale.value === 'bn' ? props.product?.badge_bn : props.product?.badge_en;
  return badge || null;
});

const ratingAvg = computed(() => {
  const v = Number(props.ratingSummary?.avg ?? 0);
  if (v > 0) return v;
  return Number(averageRating.value || 0);
});

const ratingCount = computed(() => {
  const c = Number(props.ratingSummary?.count ?? 0);
  return c || (props.reviews || []).length;
});

const discountPercent = computed(() => {
  const v = selectedVariant.value;
  if (!v?.discount_price || !v?.price) return null;
  const original = Number(v.price) || 0;
  const discounted = Number(v.discount_price) || 0;
  if (original <= 0 || discounted <= 0 || discounted >= original) return null;
  return Math.round(((original - discounted) / original) * 100);
});

const skuLabel = computed(() => selectedVariant.value?.sku || null);

const quantity = ref(1);
const activeTab = ref('description');
const processing = ref(null);

const isAdded = ref(false);
const isFlying = ref(false);
let addedTimer = null;
let flyingTimer = null;

const reviewCount = computed(() => (props.reviews || []).length);
const averageRating = computed(() => {
  if (!reviewCount.value) return 0;
  const total = (props.reviews || []).reduce((sum, review) => sum + Number(review.rating || 0), 0);
  return (total / reviewCount.value).toFixed(1);
});

const bundleVariants = computed(() => {
  const v = selectedVariant.value ? [selectedVariant.value] : [];
  const others = (props.fbtVariants || []).filter(Boolean);
  const all = [...v, ...others];
  const seen = new Set();
  return all.filter((item) => {
    if (!item?.id) return false;
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
});

const bundleSubtotal = computed(() => {
  return bundleVariants.value.reduce((sum, v) => {
    const price = Number(v?.discount_price || v?.price || 0);
    return sum + price;
  }, 0);
});

const bundleTotal = computed(() => {
  const pct = Number(props.fbtDiscountPercent || 0);
  if (pct <= 0) return bundleSubtotal.value;
  return Math.round(bundleSubtotal.value * (1 - pct / 100));
});

const addBundleToCart = () => {
  const ids = bundleVariants.value.map((v) => v.id).filter(Boolean);
  if (!ids.length) return;
  router.post(route('cart.addBundle'), {
    variant_ids: ids,
    qty: 1,
  }, {
    preserveScroll: true,
  });
};

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

  if (!buyNow) {
    isAdded.value = true;
    isFlying.value = true;
    if (addedTimer) clearTimeout(addedTimer);
    if (flyingTimer) clearTimeout(flyingTimer);
    addedTimer = setTimeout(() => {
      isAdded.value = false;
    }, 2000);
    flyingTimer = setTimeout(() => {
      isFlying.value = false;
    }, 800);
  }

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

const particleType = computed(() => {
  const slug = String(props.product?.category?.slug || '').toLowerCase();
  if (slug.includes('honey')) return 'honey';
  if (slug.includes('spice') || slug.includes('masala')) return 'spices';
  if (slug.includes('date')) return 'dates';
  return 'mango';
});

const isMobileBarVisible = ref(false);
const onScroll = () => {
  isMobileBarVisible.value = window.scrollY > 800;
};

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
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

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
  if (addedTimer) clearTimeout(addedTimer);
  if (flyingTimer) clearTimeout(flyingTimer);
});
</script>

<template>
  <HomeLayout :navbarFloating="true">
    <div class="relative min-h-screen bg-stone-50/30 dark:bg-stone-950/20 pb-20 md:pb-32">
      <div class="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-amber-50/50 dark:from-stone-900/50 to-transparent z-[-1]" />
      <DittoFloatingParticles :type="particleType" />

      <div class="container mx-auto px-4 pt-4 md:pt-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          <div class="lg:col-span-7">
            <div class="lg:sticky lg:top-40">
              <div class="flex flex-col gap-4">
                <div
                  ref="galleryContainerRef"
                  class="relative aspect-square rounded-3xl overflow-hidden bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 cursor-crosshair group"
                  @mouseenter="isZooming = true"
                  @mouseleave="isZooming = false"
                  @mousemove="onGalleryMouseMove"
                >
                  <img
                    v-if="galleryImages.length"
                    :src="getImageUrl(galleryImages[activeImageIndex] || galleryImages[0])"
                    alt="Product Image"
                    class="h-full w-full object-cover transition-transform duration-300"
                    :class="isZooming ? 'scale-110 opacity-40' : 'scale-100'"
                  />
                  <div v-else class="absolute inset-0 bg-stone-200 dark:bg-stone-900" />

                  <div
                    v-if="isZooming && galleryImages.length"
                    class="absolute inset-0 z-10 pointer-events-none overflow-hidden"
                    :style="{
                      backgroundImage: `url(${getImageUrl(galleryImages[activeImageIndex] || galleryImages[0])})`,
                      backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                      backgroundSize: '250%',
                      backgroundRepeat: 'no-repeat',
                    }"
                  />

                  <div class="absolute bottom-4 right-4 z-20">
                    <a
                      v-if="product?.video_url"
                      :href="product.video_url"
                      target="_blank"
                      rel="noopener"
                      class="flex items-center gap-2 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-stone-200 dark:border-stone-800 text-sm font-semibold text-stone-700 dark:text-stone-200 hover:scale-105 transition-transform"
                    >
                      <Play class="w-4 h-4 fill-primary-green text-primary-green" />
                      Watch Video
                    </a>
                  </div>

                  <div v-if="!isZooming" class="absolute top-4 right-4 p-2 bg-black/10 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn class="w-5 h-5" />
                  </div>
                </div>

                <div class="px-2">
                  <Swiper
                    :spaceBetween="12"
                    :slidesPerView="4"
                    :freeMode="true"
                    :watchSlidesProgress="true"
                    :modules="[FreeMode]"
                    class="product-thumbs-swiper"
                  >
                    <SwiperSlide
                      v-for="(img, idx) in galleryImages"
                      :key="img + idx"
                      class="cursor-pointer"
                      @click="activeImageIndex = idx"
                    >
                      <div
                        class="relative aspect-square rounded-xl overflow-hidden border-2 transition-all bg-stone-50 dark:bg-stone-900"
                        :class="activeImageIndex === idx ? 'border-primary-green' : 'border-transparent hover:border-primary-green'"
                      >
                        <img :src="getImageUrl(img)" :alt="`Thumb ${idx}`" class="h-full w-full object-cover" />
                      </div>
                    </SwiperSlide>
                  </Swiper>
                </div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-5">
            <div class="flex flex-col gap-6">
              <nav class="flex items-center gap-2 text-sm text-stone-500 font-medium">
                <a href="/" class="hover:text-primary-green">Home</a>
                <span>/</span>
                <a
                  v-if="product?.category?.slug"
                  :href="`/category/products/${product.category.slug}`"
                  class="hover:text-primary-green capitalize"
                >
                  {{ product.category.slug }}
                </a>
                <span v-else class="capitalize">products</span>
                <span>/</span>
                <span class="text-stone-800 dark:text-stone-300 truncate max-w-[150px]">{{ product[getLocalizedField('title')] }}</span>
              </nav>

              <div class="space-y-2">
                <div class="flex items-center gap-3">
                  <span
                    v-if="productBadge"
                    class="bg-honey-gold/10 text-amber-700 dark:text-honey-gold border border-honey-gold/30 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider"
                  >
                    {{ productBadge }}
                  </span>
                  <span v-if="product?.is_organic" class="flex items-center gap-1 text-primary-green text-xs font-bold uppercase tracking-wider">
                    <ShieldCheck class="w-3.5 h-3.5" />
                    100% Organic
                  </span>
                </div>
                <h1 class="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-50 leading-tight">
                  {{ product[getLocalizedField('title')] }}
                </h1>
                <p v-if="product?.title_bn" class="text-xl text-stone-500 dark:text-stone-400">
                  {{ product.title_bn }}
                </p>
              </div>

              <div class="flex items-center gap-4">
                <div class="flex items-center gap-0.5">
                  <Star
                    v-for="i in 5"
                    :key="i"
                    class="w-4 h-4"
                    :class="i <= Math.floor(Number(ratingAvg) || 0) ? 'fill-honey-gold text-honey-gold' : 'text-stone-300'"
                  />
                </div>
                <button
                  type="button"
                  class="text-sm font-semibold text-stone-500 hover:text-primary-green underline decoration-dotted"
                  @click="document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })"
                >
                  ({{ ratingCount }} Reviews)
                </button>
                <span class="w-1 h-1 rounded-full bg-stone-300" />
                <span v-if="skuLabel" class="text-sm text-stone-500 font-medium">SKU: {{ skuLabel }}</span>
              </div>

              <div class="h-px bg-stone-100 dark:bg-stone-800/50" />

              <div class="space-y-1">
                <div class="flex items-baseline gap-3">
                  <span v-if="selectedVariant" class="text-3xl font-bold text-primary-green">
                    {{ formattedPrice(selectedVariant.discount_price || selectedVariant.price) }}
                  </span>
                  <template v-if="selectedVariant?.discount_price">
                    <span class="text-lg text-stone-400 line-through">{{ formattedPrice(selectedVariant.price) }}</span>
                    <span v-if="discountPercent" class="bg-red-500 text-white px-2 py-0.5 rounded-md text-xs font-bold">-{{ discountPercent }}% OFF</span>
                  </template>
                </div>
                <p class="text-sm text-stone-500 dark:text-stone-400">Price for selected size (incl. all taxes)</p>
              </div>

              <div class="space-y-3">
                <h3 class="text-sm font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wide">Select Weight</h3>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="v in sortedVariants"
                    :key="v.id"
                    type="button"
                    @click="selectedSize = v.size?.id"
                    class="px-6 py-2.5 rounded-xl border-2 font-bold transition-all"
                    :class="v.id === selectedVariant?.id ? 'border-primary-green bg-primary-green/5 text-primary-green' : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300'"
                  >
                    {{ v.size?.[getLocalizedField('amount')] }}{{ v.size?.[getLocalizedField('unit')] }}
                  </button>
                </div>
              </div>

              <div v-if="showScarcity" class="flex items-center gap-2 py-2 px-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-100 dark:border-red-900/30">
                <span class="relative flex h-2.5 w-2.5">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                <p class="text-sm font-bold text-red-600 dark:text-red-400">
                  High Demand: Only {{ stockAvailability }} left in stock!
                </p>
              </div>

              <div class="space-y-4">
                <div class="flex gap-4">
                  <div class="flex items-center bg-stone-100 dark:bg-stone-900 rounded-xl px-2">
                    <button
                      type="button"
                      class="p-2 text-stone-600 dark:text-stone-400 hover:text-primary-green transition-colors"
                      :disabled="quantity <= 1"
                      @click="quantity = Math.max(1, Number(quantity || 1) - 1)"
                    >
                      <Minus class="w-5 h-5" />
                    </button>
                    <span class="w-10 text-center font-bold text-stone-800 dark:text-stone-100">
                      {{ locale === 'bn' ? toBanglaNumber(quantity) : quantity }}
                    </span>
                    <button
                      type="button"
                      class="p-2 text-stone-600 dark:text-stone-400 hover:text-primary-green transition-colors"
                      :disabled="stockAvailability > 0 ? quantity >= stockAvailability : false"
                      @click="quantity = stockAvailability > 0 ? Math.min(stockAvailability, Number(quantity || 1) + 1) : Number(quantity || 1) + 1"
                    >
                      <Plus class="w-5 h-5" />
                    </button>
                  </div>

                  <div class="relative flex-grow">
                    <button
                      type="button"
                      class="w-full h-14 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
                      :class="isAdded ? 'bg-green-600 text-white shadow-green-200 dark:shadow-none' : 'bg-stone-900 dark:bg-primary-green text-white shadow-stone-200 dark:shadow-none hover:bg-black dark:hover:bg-primary-green-hover'"
                      :disabled="!!processing || !selectedVariant || stockAvailability === 0"
                      @click="addToCart(false)"
                    >
                      <template v-if="isAdded">
                        <CheckCircle2 class="w-5 h-5" />
                        Added!
                      </template>
                      <template v-else>
                        <ShoppingCart class="w-5 h-5" />
                        Add to Cart
                      </template>
                    </button>

                    <div v-if="isFlying" class="absolute left-1/2 top-1/2 -ml-8 -mt-8 w-16 h-16 rounded-full overflow-hidden border-2 border-primary-green shadow-xl z-[100] pointer-events-none product-fly">
                      <img :src="getImageUrl(product?.feature_image || '/ui/images/mango.png')" alt="" class="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  class="w-full h-14 rounded-xl bg-honey-gold hover:bg-amber-600 text-white font-bold text-lg shadow-lg shadow-honey-gold/20 transition-all"
                  :disabled="!!processing || !selectedVariant || stockAvailability === 0"
                  @click="addToCart(true)"
                >
                  Buy Now
                </button>

                <div class="grid grid-cols-3 gap-4 pt-4">
                  <div class="flex flex-col items-center text-center gap-1">
                    <div class="w-10 h-10 rounded-full bg-stone-50 dark:bg-stone-900 flex items-center justify-center border border-stone-100 dark:border-stone-800">
                      <ShieldCheck class="w-5 h-5 text-primary-green" />
                    </div>
                    <span class="text-[10px] font-bold text-stone-800 dark:text-stone-200 uppercase tracking-tighter">Pure & Safe</span>
                    <span class="text-[9px] text-stone-500 font-medium">Lab Tested</span>
                  </div>
                  <div class="flex flex-col items-center text-center gap-1">
                    <div class="w-10 h-10 rounded-full bg-stone-50 dark:bg-stone-900 flex items-center justify-center border border-stone-100 dark:border-stone-800">
                      <Plus class="w-5 h-5 text-primary-green" />
                    </div>
                    <span class="text-[10px] font-bold text-stone-800 dark:text-stone-200 uppercase tracking-tighter">No Adulteration</span>
                    <span class="text-[9px] text-stone-500 font-medium">Money Back</span>
                  </div>
                  <div class="flex flex-col items-center text-center gap-1">
                    <div class="w-10 h-10 rounded-full bg-stone-50 dark:bg-stone-900 flex items-center justify-center border border-stone-100 dark:border-stone-800">
                      <Share2 class="w-5 h-5 text-primary-green" />
                    </div>
                    <span class="text-[10px] font-bold text-stone-800 dark:text-stone-200 uppercase tracking-tighter">Eco-Friendly</span>
                    <span class="text-[9px] text-stone-500 font-medium">Plastic Free</span>
                  </div>
                </div>

                <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <a
                    v-if="common_settings?.whatsapp"
                    :href="`https://wa.me/${common_settings.whatsapp}`"
                    target="_blank"
                    rel="noopener"
                    class="inline-flex items-center justify-center rounded-xl bg-white dark:bg-stone-900 px-4 py-3 text-sm font-bold text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-800 transition hover:scale-[1.01]"
                  >
                    Order On WhatsApp
                  </a>

                  <a
                    v-if="common_settings?.phone"
                    :href="`tel:${common_settings.phone}`"
                    class="inline-flex items-center justify-center rounded-xl bg-white dark:bg-stone-900 px-4 py-3 text-sm font-bold text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-800 transition hover:scale-[1.01]"
                  >
                    Call For Order
                  </a>
                </div>
              </div>

              <div class="mt-12 hidden lg:block" v-if="bundleVariants.length">
                <div class="py-12 border-t border-stone-100 dark:border-stone-800">
                  <div class="flex flex-col gap-6">
                    <div>
                      <h3 class="text-xl font-bold text-stone-900 dark:text-stone-100">Frequently Bought Together</h3>
                      <p class="text-sm text-stone-500">Add these complementary items for a healthy breakfast combo.</p>
                    </div>

                    <div class="flex flex-col md:flex-row items-center gap-6 p-6 bg-amber-50/30 dark:bg-stone-900/40 rounded-3xl border border-amber-100/50 dark:border-stone-800">
                      <div class="flex items-center gap-4">
                        <div class="relative w-24 h-24 rounded-2xl overflow-hidden border border-white dark:border-stone-800 shadow-sm">
                          <img :src="getImageUrl(bundleVariants[0]?.product?.feature_image || '/ui/images/mango.png')" alt="" class="w-full h-full object-cover" />
                        </div>

                        <Plus class="w-5 h-5 text-stone-400" />

                        <div class="relative w-24 h-24 rounded-2xl overflow-hidden border border-white dark:border-stone-800 shadow-sm">
                          <img :src="getImageUrl(bundleVariants[1]?.product?.feature_image || '/ui/images/honey.png')" alt="" class="w-full h-full object-cover" />
                          <div class="absolute top-1 right-1 bg-primary-green text-white p-0.5 rounded-full">
                            <Check class="w-3 h-3" />
                          </div>
                        </div>
                      </div>

                      <div class="flex flex-col gap-1 flex-grow">
                        <h4 class="font-bold text-stone-800 dark:text-stone-200">Bundle: {{ product?.title_en?.split(' ')?.[0] || 'Item' }} + {{ bundleVariants[1]?.product?.title_en?.split(' ')?.[0] || 'Item' }}</h4>
                        <div class="flex items-baseline gap-2">
                          <span class="text-lg font-bold text-primary-green">{{ formattedPrice(bundleTotal) }}</span>
                          <span class="text-sm text-stone-400 line-through">{{ formattedPrice(bundleSubtotal) }}</span>
                          <span class="text-xs font-bold text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-md">Save {{ fbtDiscountPercent }}%</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        class="w-full md:w-auto px-8 py-3 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform active:scale-95 shadow-lg shadow-black/5"
                        @click="addBundleToCart"
                      >
                        <ShoppingBag class="w-5 h-5" />
                        Add Bundle to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-16 lg:mt-24 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div class="lg:col-span-8 space-y-12">
            <section id="details">
              <div class="bg-white dark:bg-stone-900/50 rounded-3xl border border-stone-100 dark:border-stone-800 p-6 md:p-8 shadow-sm">
                <div class="flex flex-wrap gap-4 mb-8 border-b border-stone-100 dark:border-stone-800 pb-4">
                  <button
                    type="button"
                    class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all relative"
                    :class="activeTab === 'description' ? 'text-primary-green' : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'"
                    @click="activeTab = 'description'"
                  >
                    <ShieldCheck class="w-4 h-4" />
                    Detailed Info
                    <span v-if="activeTab === 'description'" class="absolute bottom-[-17px] left-0 right-0 h-1 bg-primary-green rounded-full" />
                  </button>
                  <button
                    type="button"
                    class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all relative"
                    :class="activeTab === 'origin' ? 'text-primary-green' : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'"
                    @click="activeTab = 'origin'"
                  >
                    <MapPin class="w-4 h-4" />
                    Origin Story
                    <span v-if="activeTab === 'origin'" class="absolute bottom-[-17px] left-0 right-0 h-1 bg-primary-green rounded-full" />
                  </button>
                  <button
                    type="button"
                    class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all relative"
                    :class="activeTab === 'nutrition' ? 'text-primary-green' : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'"
                    @click="activeTab = 'nutrition'"
                  >
                    <Activity class="w-4 h-4" />
                    Nutrition
                    <span v-if="activeTab === 'nutrition'" class="absolute bottom-[-17px] left-0 right-0 h-1 bg-primary-green rounded-full" />
                  </button>
                </div>

                <div class="min-h-[200px]">
                  <div v-if="activeTab === 'description'" class="prose prose-stone dark:prose-invert max-w-none">
                    <p class="text-stone-600 dark:text-stone-400 leading-relaxed text-lg">
                      {{ product[getLocalizedField('description')] || product[getLocalizedField('short_desc')] }}
                    </p>
                    <div v-if="(product?.attributes || []).length" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                      <div
                        v-for="attr in product.attributes"
                        :key="attr.id || attr.key"
                        class="flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800"
                      >
                        <span class="text-sm font-medium text-stone-500 capitalize">{{ attr[getLocalizedField('label')] || attr.label_en || attr.key }}</span>
                        <span class="text-sm font-bold text-stone-800 dark:text-stone-200">{{ attr[getLocalizedField('value')] || attr.value_en }}</span>
                      </div>
                    </div>

                    <div v-if="(product?.product_features || []).length" class="mt-10">
                      <h4 class="text-lg font-bold text-stone-800 dark:text-stone-200 mb-4">Key Features</h4>
                      <ul class="space-y-2">
                        <li
                          v-for="feature in product.product_features"
                          :key="feature.id"
                          class="flex items-start gap-2 p-4 bg-stone-50 dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800"
                        >
                          <span class="mt-2 h-1.5 w-1.5 rounded-full bg-primary-green" />
                          <span class="text-stone-700 dark:text-stone-300 text-sm font-semibold">
                            {{ feature[getLocalizedField('feature')] || feature.feature_en }}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div v-else-if="activeTab === 'origin'" class="space-y-6">
                    <div class="relative h-48 md:h-64 rounded-2xl overflow-hidden bg-stone-200">
                      <img :src="getImageUrl(product?.feature_image || '/ui/images/mango.png')" alt="Farm" class="w-full h-full object-cover opacity-80" />
                      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                        <div class="text-white">
                          <p class="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Authenticity Guaranteed</p>
                          <h4 class="text-xl font-bold">From the heart of Nature</h4>
                        </div>
                      </div>
                    </div>
                    <p class="text-stone-600 dark:text-stone-400 leading-relaxed text-lg">
                      {{ product[getLocalizedField('origin_story')] || (locale === 'bn' ? 'কোনো অরিজিন তথ্য নেই।' : 'No origin story available.') }}
                    </p>
                    <div class="flex items-center gap-2 p-4 bg-primary-green/5 rounded-2xl border border-primary-green/20">
                      <MapPin class="w-5 h-5 text-primary-green" />
                      <span class="text-sm font-medium text-primary-green">Location Verified by MyBazar Logistics Team</span>
                    </div>
                  </div>

                  <div v-else class="">
                    <h4 class="text-lg font-bold text-stone-800 dark:text-stone-200 mb-6">Nutrition Facts (Per 100g)</h4>
                    <div class="space-y-3">
                      <div
                        v-for="fact in (product.nutritionFacts || [])"
                        :key="fact.id || fact.name_en"
                        class="flex justify-between items-center py-3 border-b border-stone-100 dark:border-stone-800 group"
                      >
                        <span class="text-stone-500 font-medium group-hover:text-stone-700 transition-colors">{{ fact[getLocalizedField('name')] || fact.name_en }}</span>
                        <span class="text-stone-800 dark:text-stone-200 font-bold">{{ fact.value }}{{ fact.unit ? ` ${fact.unit}` : '' }}</span>
                      </div>
                      <p v-if="!(product.nutritionFacts || []).length" class="text-stone-500 italic">Nutritional details for this product are provided upon request or visible on the label.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div class="lg:hidden" v-if="bundleVariants.length">
              <div class="py-12 border-t border-stone-100 dark:border-stone-800">
                <div class="flex flex-col gap-6">
                  <div>
                    <h3 class="text-xl font-bold text-stone-900 dark:text-stone-100">Frequently Bought Together</h3>
                    <p class="text-sm text-stone-500">Add these complementary items for a healthy breakfast combo.</p>
                  </div>
                  <div class="flex flex-col md:flex-row items-center gap-6 p-6 bg-amber-50/30 dark:bg-stone-900/40 rounded-3xl border border-amber-100/50 dark:border-stone-800">
                    <div class="flex items-center gap-4">
                      <div class="relative w-24 h-24 rounded-2xl overflow-hidden border border-white dark:border-stone-800 shadow-sm">
                        <img :src="getImageUrl(bundleVariants[0]?.product?.feature_image || '/ui/images/mango.png')" alt="" class="w-full h-full object-cover" />
                      </div>
                      <Plus class="w-5 h-5 text-stone-400" />
                      <div class="relative w-24 h-24 rounded-2xl overflow-hidden border border-white dark:border-stone-800 shadow-sm">
                        <img :src="getImageUrl(bundleVariants[1]?.product?.feature_image || '/ui/images/honey.png')" alt="" class="w-full h-full object-cover" />
                        <div class="absolute top-1 right-1 bg-primary-green text-white p-0.5 rounded-full">
                          <Check class="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                    <div class="flex flex-col gap-1 flex-grow">
                      <h4 class="font-bold text-stone-800 dark:text-stone-200">Bundle: {{ product?.title_en?.split(' ')?.[0] || 'Item' }} + {{ bundleVariants[1]?.product?.title_en?.split(' ')?.[0] || 'Item' }}</h4>
                      <div class="flex items-baseline gap-2">
                        <span class="text-lg font-bold text-primary-green">{{ formattedPrice(bundleTotal) }}</span>
                        <span class="text-sm text-stone-400 line-through">{{ formattedPrice(bundleSubtotal) }}</span>
                        <span class="text-xs font-bold text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-md">Save {{ fbtDiscountPercent }}%</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      class="w-full md:w-auto px-8 py-3 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform active:scale-95 shadow-lg shadow-black/5"
                      @click="addBundleToCart"
                    >
                      <ShoppingBag class="w-5 h-5" />
                      Add Bundle to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <section id="reviews" class="bg-white dark:bg-stone-900/50 p-8 rounded-3xl border border-stone-100 dark:border-stone-800">
              <div class="flex items-center justify-between mb-8">
                <h3 class="text-2xl font-bold text-stone-900 dark:text-stone-100">Verified Customer Reviews</h3>
                <button class="text-primary-green font-bold text-sm border-b-2 border-primary-green">Write a Review</button>
              </div>

              <div v-if="reviewCount" class="space-y-4">
                <div
                  v-for="review in reviews"
                  :key="review.id"
                  class="rounded-2xl border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50 p-5"
                >
                  <div class="flex items-center justify-between gap-3">
                    <p class="font-bold text-stone-800 dark:text-stone-200">{{ review.user?.name || 'User' }}</p>
                    <div class="flex items-center gap-0.5">
                      <Star
                        v-for="i in 5"
                        :key="i"
                        class="w-4 h-4"
                        :class="i <= Number(review.rating || 0) ? 'fill-honey-gold text-honey-gold' : 'text-stone-300'"
                      />
                    </div>
                  </div>
                  <p class="mt-3 text-sm text-stone-600 dark:text-stone-400 whitespace-pre-line">{{ localizedReviewComment(review) }}</p>
                </div>
              </div>

              <div v-else class="flex flex-col items-center justify-center py-12 text-center bg-stone-50 dark:bg-stone-800/50 rounded-2xl border-2 border-dashed border-stone-200 dark:border-stone-700">
                <p class="text-stone-500 mb-2">Build trust with photo reviews.</p>
                <div class="text-lg font-bold text-stone-800 dark:text-stone-300">Showing 0 authentic reviews</div>
              </div>
            </section>
          </div>

          <div class="lg:col-span-4 space-y-8">
            <div class="bg-primary-green/5 p-6 rounded-3xl border border-primary-green/20">
              <h4 class="font-bold text-primary-green mb-3">Key Features</h4>
              <ul v-if="(product?.product_features || []).length" class="space-y-2 text-sm text-stone-600 dark:text-stone-400">
                <li v-for="f in product.product_features" :key="f.id" class="flex gap-2"><span>✔</span> {{ f[getLocalizedField('feature')] || f.feature_en }}</li>
              </ul>
              <p v-else class="text-sm text-stone-600 dark:text-stone-400">No features added yet.</p>
            </div>

            <div class="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm">
              <h4 class="font-bold text-stone-800 dark:text-stone-200 mb-3">Delivery Information</h4>
              <p class="text-sm text-stone-600 dark:text-stone-400 mb-4">
                Dhaka: 24-48 Hours <br />
                Outside Dhaka: 3-5 Days
              </p>
              <div class="flex items-center gap-2 text-primary-green font-bold text-xs uppercase">
                <span>{{ isFreeShipping ? 'Free Delivery for this product' : 'Free Delivery on orders above ৳2500' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-24 border-t border-stone-100 dark:border-stone-800 pt-20">
          <div class="flex items-center justify-between mb-10">
            <h2 class="text-3xl font-bold text-stone-900 dark:text-stone-100">You May Also Like</h2>
          </div>
          <FeaturedProducts :featureProducts="relatedVariants" :title="t('relatedproducts')" />
        </div>
      </div>

      <transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-y-full"
        enter-to-class="translate-y-0"
        leave-active-class="transition duration-300 ease-in"
        leave-from-class="translate-y-0"
        leave-to-class="translate-y-full"
      >
        <div
          v-if="isMobileBarVisible"
          class="fixed bottom-0 left-0 right-0 z-[100] md:hidden bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.1)]"
        >
          <div class="flex items-center justify-between gap-4 max-w-lg mx-auto">
            <div class="flex flex-col">
              <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Price</span>
              <span class="text-xl font-bold text-primary-green">{{ selectedVariant ? formattedPrice(selectedVariant.discount_price || selectedVariant.price) : formattedPrice(0) }}</span>
            </div>

            <button
              type="button"
              class="flex-grow h-12 bg-primary-green hover:bg-primary-green-hover text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary-green/20"
              :disabled="!!processing || !selectedVariant || stockAvailability === 0"
              @click="addToCart(true)"
            >
              <ShoppingCart class="w-5 h-5" />
              Buy Now
            </button>
          </div>
        </div>
      </transition>
    </div>
  </HomeLayout>
</template>

<style scoped>
button:disabled {
  cursor: not-allowed;
}

.product-fly {
  animation: productFly 0.8s cubic-bezier(0.55, 0, 0.1, 1) forwards;
}

@keyframes productFly {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(400px, -500px) scale(0.2);
    opacity: 0;
  }
}
</style>
