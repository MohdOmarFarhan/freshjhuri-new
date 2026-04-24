<script setup>
import { Link, router, usePage } from '@inertiajs/vue3';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-vue-next';
import { computed, onMounted } from 'vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { confirmDeletion } from "@/helper/sweetAlertHelpers";
import HomeLayout from '@/layouts/Home/HomeLayout.vue';
import { useLocalization } from '@/helper/localization';
const props = defineProps({
  cartItems: {
    type: Array,
    default: () => []
  },
  paymentMedia: {
    type: Array,
    default: () => []
  },
  shippingRulesMissing: {
    type: Boolean,
    default: false
  }
});

const page = usePage();
const { locale, t, toBanglaNumber, toEnglishNumber } = useLocalization();
const getLocalizedField = (field) => `${field}_${locale.value}`;
const common_settings = computed(() => page.props.common_settings);

const getImageUrl = (path) => {
    if (!path) return '/images/placeholder.png';
    if (path.startsWith('http')) return path;
    if (path.startsWith('storage/')) return `/${path}`;
    return `/storage/${path}`;
};

const getTotalPrice = computed(() => {
  return props.cartItems.reduce((total, item) => total + (item.unit_price * item.qty), 0);
});

const getTotalItems = computed(() => {
  return props.cartItems.reduce((total, item) => total + item.qty, 0);
});

const hasShippingRulesIssue = computed(() => Boolean(props.shippingRulesMissing));

const updateQuantity = (id, qty) => {
  let quantity = parseInt(qty);
  if (isNaN(quantity) || quantity < 1) {
    quantity = 1;
  }

  router.post(route("cart.update"), { id, qty: quantity }, {
    preserveScroll: true,
    onSuccess: () => {
      // Optimistic update could happen here, but inertia handles reload
    }
  });
};

const onQuantityInput = (event, id) => {
  let val = event.target.value;
  // Convert to English digits (handles Bangla input)
  val = toEnglishNumber(val);
  // Remove non-numeric chars
  val = val.replace(/[^0-9]/g, '');

  updateQuantity(id, val);
};

const removeItem = (id) => {
  confirmDeletion(() => {
    router.delete(route("cart.remove", id), {
      preserveScroll: true,
      onSuccess: () => {
        if (props.cartItems.length === 0) {
            // Optional: Redirect if empty, or just show empty state
        }
      }
    });
  });
};

const proceedToCheckout = () => {
    if (hasShippingRulesIssue.value) {
        return;
    }
    router.visit(route('checkout.index'));
};

onMounted(() => {
  if (typeof fbq !== 'undefined' && cartItems.length) {
    const contentIds = cartItems.map(item => item.variant?.id).filter(Boolean);
    const value = getTotalPrice.value;

    fbq('track', 'InitiateCheckout', {
      content_ids: contentIds,
      content_type: 'product',
      value: value,
      currency: 'BDT',
    });
  }
});
</script>

<template>
  <HomeLayout :navbarFloating="true">
    <div class="container mx-auto px-4 py-8 max-w-7xl">
        <div class="flex items-center gap-2 mb-8">
            <ShoppingBag class="w-8 h-8 text-primary" />
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ $t('cart_title') }}</h1>
        </div>

      <!-- EMPTY STATE -->
      <div v-if="cartItems.length == 0" class="text-center py-16 crud-table-head/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
        <ShoppingBag class="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ $t('cart_empty_title') }}</h2>
        <p class="text-gray-500 dark:text-gray-400 mb-6">{{ $t('cart_empty_desc') }}</p>
        <Button as-child>
            <Link href="/">{{ $t('start_shopping') }}</Link>
        </Button>
      </div>

      <!-- CART CONTENT -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- LEFT: ITEMS LIST -->
        <div class="lg:col-span-2 space-y-4">
          <Card v-for="item in cartItems" :key="item.id" class="overflow-hidden">
            <CardContent class="p-4 sm:p-6">
                <div class="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <!-- Image -->
                    <div class="shrink-0">
                        <img
                            :src="getImageUrl(item.variant?.product?.feature_image)"
                            :alt="item.variant?.product?.title_en"
                            class="w-full sm:w-32 h-32 object-cover rounded-md border bg-gray-50"
                        />
                    </div>

                    <!-- Details -->
                    <div class="flex-1 flex flex-col justify-between">
                        <div>
                            <div class="flex justify-between items-start">
                                <h3 class="font-semibold text-lg text-gray-900 dark:text-white line-clamp-2">
                                    <Link :href="`/products/${item.variant?.product?.slug}`" class="hover:underline">
                                        {{ item.variant?.product?.[getLocalizedField('title')] || "Product Title" }}
                                    </Link>
                                </h3>
                                <button @click="removeItem(item.id)" class="text-red-500 hover:text-red-700 transition-colors p-1">
                                    <Trash2 class="w-5 h-5" />
                                </button>
                            </div>

                            <div class="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                <p v-if="item.variant?.size">{{ $t('size') }}: <span class="font-medium text-gray-900 dark:text-gray-200">{{ item.variant.size[getLocalizedField('amount')] }} {{ item.variant.size[getLocalizedField('unit')] }}</span></p>
                                <p v-if="item.variant?.sku">{{ $t('sku') }}: {{ item.variant.sku }}</p>
                                <p>{{ $t('price') }}: <span class="font-bold text-primary">{{ locale === 'bn' ? toBanglaNumber(Number(item.unit_price).toFixed(2)) : Number(item.unit_price).toFixed(2) }} {{ locale === 'bn' ? '৳' : 'BDT' }}</span></p>
                            </div>
                        </div>

                        <!-- Quantity & Subtotal -->
                        <div class="flex flex-wrap items-center justify-between gap-4 mt-4">
                            <div class="flex items-center border rounded-md">
                                <button
                                    @click="updateQuantity(item.id, item.qty - 1)"
                                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                                    :disabled="item.qty <= 1"
                                >
                                    <Minus class="w-4 h-4" />
                                </button>
                                <input
                                    type="text"
                                    :value="locale === 'bn' ? toBanglaNumber(item.qty) : item.qty"
                                    @change="onQuantityInput($event, item.id)"
                                    class="w-16 text-center border-x-0 border-y-0 focus:ring-0 p-1 bg-transparent"
                                />
                                <button
                                    @click="updateQuantity(item.id, item.qty + 1)"
                                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <Plus class="w-4 h-4" />
                                </button>
                            </div>

                            <div class="text-right">
                                <p class="text-sm text-gray-500">{{ $t('subtotal') }}</p>
                                <p class="font-bold text-lg text-primary">{{ locale === 'bn' ? toBanglaNumber((item.unit_price * item.qty).toFixed(2)) : (item.unit_price * item.qty).toFixed(2) }} {{ locale === 'bn' ? '৳' : 'BDT' }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
          </Card>
        </div>

        <!-- RIGHT: SUMMARY -->
        <div class="lg:col-span-1">
            <Card class="sticky top-4">
                <CardHeader>
                    <CardTitle>{{ $t('order_summary') }}</CardTitle>
                </CardHeader>
                <CardContent class="space-y-4">
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600 dark:text-gray-400">{{ $t('items') }} ({{ locale === 'bn' ? toBanglaNumber(getTotalItems) : getTotalItems }})</span>
                        <span class="font-medium">{{ locale === 'bn' ? toBanglaNumber(getTotalPrice.toFixed(2)) : getTotalPrice.toFixed(2) }} {{ locale === 'bn' ? '৳' : 'BDT' }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600 dark:text-gray-400">{{ $t('shipping') }}</span>
                        <span class="font-medium text-gray-500">
                            <span v-if="hasShippingRulesIssue" class="text-red-600">
                                {{ locale === 'bn' ? 'শিপিং রুল সেট করা নেই' : 'Shipping rules missing' }}
                            </span>
                            <span v-else>
                                {{ $t('shipping_calculated') }}
                            </span>
                        </span>
                    </div>

                    <div
                        v-if="hasShippingRulesIssue"
                        class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300"
                    >
                        <span>
                            {{ locale === 'bn'
                                ? 'এই আইটেমের শিপিং রুল সেট করা নেই । কমপক্ষে 2 টন অর্ডারের জন্য অনুগ্রহ করে সাপোর্টে যোগাযোগ করুন।'
                                : 'This item is missing shipping rules. Please contact support for orders over 2 tons.' }}
                        </span>
                        <a v-if="common_settings?.phone" :href="`tel:${common_settings.phone}`" class="ml-1">
                            {{ locale === 'bn' ? toBanglaNumber(common_settings.phone) : common_settings.phone }}
                        </a>
                    </div>

                    <Separator />

                    <div class="flex justify-between items-center text-lg font-bold">
                        <span>{{ $t('total') }}</span>
                        <span class="text-primary">{{ locale === 'bn' ? toBanglaNumber(getTotalPrice.toFixed(2)) : getTotalPrice.toFixed(2) }} {{ locale === 'bn' ? '৳' : 'BDT' }}</span>
                    </div>
                </CardContent>
                <CardFooter class="flex flex-col gap-3">
                    <Button class="w-full bg-accent text-white" size="lg" :disabled="hasShippingRulesIssue" @click="proceedToCheckout">
                        {{ $t('proceed_checkout') }} <ArrowRight class="ml-2 w-4 h-4" />
                    </Button>
                    <Button variant="outline" class="w-full" as-child>
                        <Link href="/">{{ $t('buy_more') }}</Link>
                    </Button>
                </CardFooter>
            </Card>

            <!-- Payment Methods Preview -->
            <div class="mt-6">
                <p class="text-sm text-center text-gray-500 mb-3">{{ $t('we_accept') }}</p>
                <div class="flex flex-wrap justify-center gap-2">
                    <TooltipProvider>
                        <Tooltip v-for="media in paymentMedia" :key="media.id">
                            <TooltipTrigger as-child>
                                <div class="w-10 h-10 rounded bg-white shadow-sm border p-1 flex items-center justify-center cursor-help">
                                    <img v-if="media.icon" :src="getImageUrl(media.icon)" :alt="media.name" class="w-full h-full object-contain" />
                                    <span v-else class="text-[10px]">{{ media.name }}</span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p class="font-semibold">{{ media.name }}</p>
                                <p v-if="media.pay_number" class="text-xs">{{ media.pay_number }}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        </div>

      </div>
    </div>
  </HomeLayout>
</template>
