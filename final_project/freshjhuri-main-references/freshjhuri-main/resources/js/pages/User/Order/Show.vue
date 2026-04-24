<script setup>
import { Link, useForm } from '@inertiajs/vue3';
import { ArrowLeft, Package, Truck, CreditCard, Printer, MapPin, Phone, User } from 'lucide-vue-next';
import { ref } from 'vue';
import AppLayout from '@/layouts/AppLayout.vue';

const props = defineProps({
    order: Object,
});

const getStatusColor = (status) => {
    switch (status) {
        case 'Pending': return 'bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20';
        case 'Confirmed': return 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20';
        case 'Processing': return 'bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/20';
        case 'Shipping': return 'bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/20';
        case 'Delivered': return 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20';
        case 'Cancelled': return 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20';
        case 'Hold': return 'bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-600/20';
        default: return 'bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-600/20';
    }
};

const getStatusStep = (status) => {
    const steps = ['Pending', 'Confirmed', 'Processing', 'Shipping', 'Delivered'];
    if (status === 'Cancelled' || status === 'Hold') return -1;
    return steps.indexOf(status);
};

const currentStep = getStatusStep(props.order.status);
const canReview = ['Delivered', 'Completed'].includes(props.order.status);
const activeReviewItemId = ref(null);

const reviewForm = useForm({
    rating: 5,
    comment_en: '',
    comment_bn: '',
});

const toggleReviewForm = (itemId) => {
    activeReviewItemId.value = activeReviewItemId.value === itemId ? null : itemId;
    reviewForm.reset();
    reviewForm.clearErrors();
    reviewForm.rating = 5;
};

const submitReview = (item) => {
    reviewForm.post(route('user.orders.review.store', { order: props.order.id, orderItem: item.id }), {
        preserveScroll: true,
        onSuccess: () => {
            activeReviewItemId.value = null;
            reviewForm.reset();
            reviewForm.rating = 5;
        },
    });
};
</script>

<template>
    <AppLayout>
        <div class="max-w-full md:w-3/4 mx-auto py-8 sm:px-6 lg:px-8">
            <div class="px-4 sm:px-0 space-y-6">
                <!-- Header Section -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div class="flex items-center gap-4">
                        <Link :href="route('user.orders.index')" 
                              class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <ArrowLeft class="w-5 h-5 text-gray-500" />
                        </Link>
                        <div>
                            <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Order #{{ order.id }}</h1>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                Placed on {{ new Date(order.created_at).toLocaleDateString() }}
                            </p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <span 
                            class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                            :class="getStatusColor(order.status)"
                        >
                            {{ order.status }}
                        </span>
                        <a 
                            :href="route('user.orders.print', order.id)" 
                            target="_blank"
                            class="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <Printer class="w-4 h-4" />
                            Invoice
                        </a>
                    </div>
                </div>

                <!-- Order Status Tracker -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8" 
                     v-if="order.status !== 'Cancelled' && order.status !== 'Hold'">
                    <div class="relative">
                        <div class="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 rounded-full hidden sm:block"></div>
                        <div class="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 transition-all duration-500 rounded-full hidden sm:block" 
                             :style="{ width: `${currentStep * 25}%` }"></div>
                        
                        <!-- Mobile Vertical Line -->
                        <div class="absolute left-4 top-0 h-full w-1 bg-gray-200 dark:bg-gray-700 sm:hidden"></div>
                        <div class="absolute left-4 top-0 w-1 bg-primary transition-all duration-500 sm:hidden" 
                             :style="{ height: `${currentStep * 25}%` }"></div>

                        <div class="relative flex flex-col sm:flex-row justify-between gap-6 sm:gap-0">
                            <div v-for="(step, index) in ['Pending', 'Confirmed', 'Processing', 'Shipping', 'Delivered']" 
                                 :key="step" 
                                 class="flex sm:flex-col items-center sm:items-center gap-4 sm:gap-0 group relative z-10">
                                <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-colors border-4 border-white dark:border-gray-800 flex-shrink-0" 
                                     :class="index <= currentStep ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'">
                                    {{ index + 1 }}
                                </div>
                                <span class="text-sm sm:text-xs sm:mt-3 font-medium transition-colors" 
                                      :class="index <= currentStep ? 'text-primary' : 'text-gray-400 dark:text-gray-500'">
                                    {{ step }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Order Details Left Column -->
                    <div class="lg:col-span-2 space-y-6">
                        <!-- Items -->
                        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 crud-table-head/50 flex items-center gap-2">
                                <Package class="w-5 h-5 text-gray-500" />
                                <h3 class="font-semibold text-gray-900 dark:text-gray-100">Order Items</h3>
                            </div>
                            <div class="divide-y divide-gray-200 dark:divide-gray-700">
                                <div v-for="item in order.items" :key="item.id" class="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                    <div class="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-600">
                                         <img 
                                            v-if="item.variant?.product?.feature_image"
                                            :src="`/${item.variant.product.feature_image}`" 
                                            class="w-full h-full object-cover"
                                            alt="Product Image"
                                        >
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <h4 class="font-medium text-gray-900 dark:text-gray-100 truncate">
                                            {{ item.variant?.product?.title_en || item.product_name }}
                                        </h4>
                                        <div class="mt-1 flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span class="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                                Size: {{ item.variant?.size?.amount }} {{ item.variant?.size?.unit_en }}
                                            </span>
                                            <span class="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                                Qty: {{ item.qty }}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <p class="font-bold text-gray-900 dark:text-gray-100">৳{{ item.subtotal }}</p>
                                        <p class="text-xs text-gray-500 dark:text-gray-400">৳{{ item.unit_price }} / unit</p>
                                    </div>

                                    <div v-if="canReview" class="w-full sm:w-auto sm:ml-4">
                                        <button
                                            v-if="!item.review"
                                            type="button"
                                            class="inline-flex items-center rounded-md border border-primary px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition"
                                            @click="toggleReviewForm(item.id)"
                                        >
                                            Write Review
                                        </button>
                                        <span v-else class="inline-flex items-center rounded-md bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                                            Review Submitted
                                        </span>
                                    </div>
                                    </div>

                                    <div v-if="activeReviewItemId === item.id && !item.review" class="mt-4">
                                        <form class="rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3" @submit.prevent="submitReview(item)">
                                            <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">Write Product Review</p>
                                            <div>
                                                <label class="text-xs text-gray-600 dark:text-gray-400">Rating (1-5)</label>
                                                <select v-model.number="reviewForm.rating" class="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm">
                                                    <option :value="5">5</option>
                                                    <option :value="4">4</option>
                                                    <option :value="3">3</option>
                                                    <option :value="2">2</option>
                                                    <option :value="1">1</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label class="text-xs text-gray-600 dark:text-gray-400">Review (English)</label>
                                                <textarea
                                                    v-model="reviewForm.comment_en"
                                                    rows="3"
                                                    class="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                                                    placeholder="Write in English"
                                                />
                                            </div>
                                            <div>
                                                <label class="text-xs text-gray-600 dark:text-gray-400">রিভিউ (বাংলা)</label>
                                                <textarea
                                                    v-model="reviewForm.comment_bn"
                                                    rows="3"
                                                    class="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                                                    placeholder="বাংলায় লিখুন"
                                                />
                                            </div>
                                            <p v-if="reviewForm.errors.review || reviewForm.errors.comment_en || reviewForm.errors.comment_bn" class="text-xs text-red-600">
                                                {{ reviewForm.errors.review || reviewForm.errors.comment_en || reviewForm.errors.comment_bn }}
                                            </p>
                                            <div class="flex items-center gap-2">
                                                <button type="submit" :disabled="reviewForm.processing" class="rounded-md bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary/90 transition">
                                                    Submit Review
                                                </button>
                                                <button type="button" class="rounded-md border border-gray-300 px-4 py-2 text-xs font-semibold" @click="toggleReviewForm(item.id)">
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Delivery Information -->
                        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 crud-table-head/50 flex items-center gap-2">
                                <Truck class="w-5 h-5 text-gray-500" />
                                <h3 class="font-semibold text-gray-900 dark:text-gray-100">Delivery Information</h3>
                            </div>
                            <div class="p-6">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div class="flex gap-3">
                                        <div class="mt-1">
                                            <User class="w-5 h-5 text-gray-400" />
                                        </div>
                                        <div>
                                            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Recipient</p>
                                            <p class="font-medium text-gray-900 dark:text-gray-100 mt-1">{{ order.shipping_address?.name }}</p>
                                        </div>
                                    </div>
                                    <div class="flex gap-3">
                                        <div class="mt-1">
                                            <Phone class="w-5 h-5 text-gray-400" />
                                        </div>
                                        <div>
                                            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Contact</p>
                                            <p class="font-medium text-gray-900 dark:text-gray-100 mt-1">{{ order.shipping_address?.phone }}</p>
                                        </div>
                                    </div>
                                    <div class="flex gap-3 md:col-span-2">
                                        <div class="mt-1">
                                            <MapPin class="w-5 h-5 text-gray-400" />
                                        </div>
                                        <div>
                                            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Delivery Address</p>
                                            <p class="font-medium text-gray-900 dark:text-gray-100 mt-1">
                                                {{ order.shipping_address?.address }}
                                            </p>
                                            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                {{ order.shipping_address?.thana?.name }}, 
                                                {{ order.shipping_address?.district?.name }}, 
                                                {{ order.shipping_address?.division?.name }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Order Summary Right Column -->
                    <div class="space-y-6">
                        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden sticky top-6">
                            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 crud-table-head/50 flex items-center gap-2">
                                <CreditCard class="w-5 h-5 text-gray-500" />
                                <h3 class="font-semibold text-gray-900 dark:text-gray-100">Payment Summary</h3>
                            </div>
                            <div class="p-6 space-y-4">
                                <div class="space-y-3">
                                    <div class="flex justify-between text-sm">
                                        <span class="text-gray-600 dark:text-gray-400">Subtotal</span>
                                        <span class="font-medium text-gray-900 dark:text-gray-100">৳{{ order.subtotal }}</span>
                                    </div>
                                    <div class="flex justify-between text-sm">
                                        <span class="text-gray-600 dark:text-gray-400">Shipping Cost</span>
                                        <span class="font-medium text-gray-900 dark:text-gray-100">৳{{ order.shipping_cost }}</span>
                                    </div>
                                    <div v-if="order.special_discount > 0" class="flex justify-between text-sm text-red-600">
                                        <span>Discount</span>
                                        <span>-৳{{ order.special_discount }}</span>
                                    </div>
                                </div>
                                
                                <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div class="flex justify-between items-center mb-4">
                                        <span class="font-bold text-gray-900 dark:text-gray-100">Total Payable</span>
                                        <span class="font-bold text-xl text-primary">৳{{ order.pay_amount }}</span>
                                    </div>
                                    
                                    <div class="rounded-lg p-3 text-center border"
                                         :class="order.due_amount > 0 ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800' : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'">
                                        <p class="text-sm font-semibold">
                                            {{ order.due_amount > 0 ? 'Payment Pending' : 'Payment Complete' }}
                                        </p>
                                        <p v-if="order.due_amount > 0" class="text-xs mt-1">
                                            Due Amount: ৳{{ order.due_amount }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
