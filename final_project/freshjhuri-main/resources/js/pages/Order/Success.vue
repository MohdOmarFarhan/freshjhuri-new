<script setup>
import { Head, Link } from '@inertiajs/vue3';
import { CheckCircle, Home, ShoppingBag } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { computed, onMounted } from 'vue';
import { useLocalization } from '@/helper/localization';

const { locale, t, toBanglaNumber } = useLocalization();

const { order } = defineProps({
    order: {
        type: Object,
        required: true
    }
});

const formattedDate = computed(() => {
  const date = new Date(order.created_at);
  if (Number.isNaN(date.getTime())) return '—';
  const formatted = date.toLocaleDateString(locale.value === 'bn' ? 'bn-BD' : 'en-GB');
  return locale.value === 'bn' ? toBanglaNumber(formatted) : formatted;
});

const formattedTotal = computed(() => {
  const amount = Number(order.pay_amount) || 0;
  const formatted = new Intl.NumberFormat(locale.value === 'bn' ? 'bn-BD' : 'en-US').format(amount);
  return locale.value === 'bn' ? `${formatted} ৳` : `${formatted} BDT`;
});

const displayOrderId = computed(() => {
  const id = order?.id ?? '';
  return locale.value === 'bn' ? toBanglaNumber(id) : id;
});

onMounted(() => {
  if (typeof fbq !== 'undefined') {
    const contentIds = order.items?.map(item => item.variant_id) || [];
    fbq('track', 'Purchase', {
      content_ids: contentIds,
      content_type: 'product',
      value: order.pay_amount,
      currency: 'BDT'
    });
  }
});
</script>

<template>
    <Head :title="t('order_success_page_title')" />
    <div class="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <Card class="w-full max-w-md text-center">
            <CardHeader class="flex flex-col items-center space-y-4">
                <div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle class="w-10 h-10 text-green-600" />
                </div>
                <CardTitle class="text-2xl font-bold text-green-700">{{ t('order_success_title') }}</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
                <p class="text-gray-600">
                    {{ t('order_success_message') }}
                </p>
                <div class="bg-gray-50 p-4 rounded-lg text-left space-y-2">
                    <p class="text-sm text-gray-500">
                      {{ t('order_id') }}: <span class="font-medium text-gray-900">#{{ displayOrderId }}</span>
                    </p>
                    <p class="text-sm text-gray-500">
                      {{ t('date') }}: <span class="font-medium text-gray-900">{{ formattedDate }}</span>
                    </p>
                    <p class="text-sm text-gray-500">
                      {{ t('total') }}: <span class="font-medium text-primary">{{ formattedTotal }}</span>
                    </p>
                    <p class="text-sm text-gray-500">
                      {{ t('payment') }}: <span class="font-medium uppercase">{{ order.payment_type }}</span>
                    </p>
                </div>
                <p class="text-sm text-gray-500">
                    {{ t('order_success_email', { email: order.email || t('your_email') }) }}
                </p>
            </CardContent>
            <CardFooter class="flex flex-col gap-3">
                <Link href="/" class="w-full">
                    <Button class="w-full" variant="default">
                        <Home class="w-4 h-4 mr-2" /> {{ t('return_home') }}
                    </Button>
                </Link>
                <!-- Optional: Link to Order History if logged in -->
                <Link v-if="order.user_id" :href="route('dashboard')" class="w-full">
                    <Button class="w-full" variant="outline">
                        <ShoppingBag class="w-4 h-4 mr-2" /> {{ t('view_my_orders') }}
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    </div>
</template>
