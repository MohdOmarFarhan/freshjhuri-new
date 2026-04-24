<script setup>
import { router, Link } from '@inertiajs/vue3';
import { ArrowLeft, Printer, Truck, User, MapPin, CreditCard, Package, Edit2, Save, X, DollarSign, Calendar, Clock, Tag, ChevronDown, Phone, Mail, Home } from 'lucide-vue-next';
import { ref, watch, computed } from 'vue';
import AppLayout from '@/layouts/AppLayout.vue';

const props = defineProps({
    order: Object,
});

const status = ref(props.order.status);
const isUpdating = ref(false);
const adminNote = ref(props.order.admin_note || '');
const isSavingNote = ref(false);
const specialDiscount = ref(props.order.special_discount || 0);
const showNoteEditor = ref(false);
const isPaid = ref(props.order.due_amount <= 0);

const statusOptions = [
    'Pending', 'Confirmed', 'Hold', 'Processing', 'Shipping', 'Delivered', 'Cancelled'
];

const updateOrder = () => {
    isUpdating.value = true;
    router.put(route('orders.update', props.order.id), {
        status: status.value,
        special_discount: specialDiscount.value,
        admin_note: adminNote.value,
        payment_status: isPaid.value ? 'paid' : 'unpaid'
    }, {
        onSuccess: () => {
            router.get(route('orders.index'));
        },
        onFinish: () => isUpdating.value = false,
    });
};

watch(() => props.order.special_discount, (newVal) => {
    specialDiscount.value = newVal || 0;
});

const getStatusBadge = (status) => {
    const colors = {
        'Pending': 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
        'Confirmed': 'bg-blue-50 text-blue-700 ring-blue-600/20',
        'Hold': 'bg-gray-50 text-gray-700 ring-gray-600/20',
        'Processing': 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
        'Shipping': 'bg-purple-50 text-purple-700 ring-purple-600/20',
        'Delivered': 'bg-green-50 text-green-700 ring-green-600/20',
        'Cancelled': 'bg-red-50 text-red-700 ring-red-600/20'
    };
    return colors[status] || colors['Pending'];
};

const formattedDate = computed(() => {
    return new Date(props.order.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
});
</script>

<template>
    <AppLayout>
        <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
            <!-- Header Section -->
            <div class="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-4">
                            <Link
                                :href="route('orders.index')"
                                class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <ArrowLeft class="w-5 h-5 text-gray-500" />
                            </Link>
                            <div>
                                <div class="flex items-center gap-3">
                                    <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                        Order #{{ order.id }}
                                    </h1>
                                    <span 
                                        class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset"
                                        :class="getStatusBadge(order.status)"
                                    >
                                        {{ order.status }}
                                    </span>
                                </div>
                                <div class="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                    <span class="flex items-center gap-1">
                                        <Calendar class="w-4 h-4" />
                                        {{ formattedDate }}
                                    </span>
                                    <span class="flex text-accent items-center gap-1">
                                        <Tag class="w-4 h-4 text-accent" />
                                        {{ order.payment_type }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="flex items-center gap-3">
                            <!-- <div class="relative">
                                <span class="appearance-none pl-4 pr-10 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-accent focus:border-accent">
                                    {{ order.status }}
                                </span>
                            </div> -->
                            
                            <Link
                                :href="route('orders.print', order.id)"
                                class="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors text-sm font-medium shadow-sm"
                            >
                                <Printer class="w-4 h-4" />
                                Print Invoice
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main Content -->
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Left Column - Order Items, Customer & Delivery (2/3 width) -->
                    <div class="lg:col-span-2 space-y-6">
                        <!-- Order Items Card -->
                        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 crud-table-head/50">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-2">
                                        <Package class="w-5 h-5 text-accent" />
                                        <h3 class="font-semibold text-gray-900 dark:text-gray-100">Order Items</h3>
                                    </div>
                                    <span class="text-sm text-gray-500">{{ order.items.length }} items</span>
                                </div>
                            </div>
                            
                            <div class="divide-y divide-gray-200 dark:divide-gray-700">
                                <div v-for="item in order.items" :key="item.id" class="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <div class="flex gap-4">
                                        <!-- Product Image -->
                                        <div class="w-20 h-20 rounded-lg bg-gray-100 dark:bg-gray-700 flex-shrink-0 overflow-hidden border border-gray-200 dark:border-gray-700">
                                            <img 
                                                v-if="item.variant?.product?.feature_image"
                                                :src="`/${item.variant.product.feature_image}`" 
                                                class="w-full h-full object-cover"
                                                alt="Product"
                                            >
                                            <div v-else class="w-full h-full flex items-center justify-center">
                                                <Package class="w-8 h-8 text-gray-400" />
                                            </div>
                                        </div>
                                        
                                        <!-- Product Details -->
                                        <div class="flex-1 min-w-0">
                                            <div class="flex items-start justify-between">
                                                <div>
                                                    <h4 class="font-medium text-gray-900 dark:text-gray-100 mb-1">
                                                        {{ item.variant?.product?.title_en || 'Unknown Product' }}
                                                    </h4>
                                                    <div class="flex items-center gap-3 text-sm text-gray-500">
                                                        <span class="flex items-center gap-1">
                                                            <span class="font-medium">Size:</span> 
                                                            {{ item.variant?.size?.amount }} {{ item.variant?.size?.unit_en }}
                                                        </span>
                                                        <span class="w-1 h-1 rounded-full bg-gray-300"></span>
                                                        <span class="flex items-center gap-1">
                                                            <span class="font-medium">Qty:</span> 
                                                            {{ item.qty }}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div class="text-right">
                                                    <div class="font-medium text-gray-900 dark:text-gray-100">
                                                        ৳{{ item.subtotal }}
                                                    </div>
                                                    <div class="text-sm text-gray-500">
                                                        ৳{{ item.unit_price }} each
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Customer & Delivery Information Grid -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Customer Info Card -->
                            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 crud-table-head/50">
                                    <div class="flex items-center gap-2">
                                        <User class="w-5 h-5 text-accent" />
                                        <h3 class="font-semibold text-gray-900 dark:text-gray-100">Customer Details</h3>
                                    </div>
                                </div>
                                <div class="p-6">
                                    <div class="space-y-4">
                                        <div class="flex items-center gap-3">
                                            <div class="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                                                <span class="text-accent font-semibold text-lg">
                                                    {{ order.shipping_address?.name?.charAt(0) || 'G' }}
                                                </span>
                                            </div>
                                            <div class="min-w-0 flex-1">
                                                <p class="font-medium text-gray-900 dark:text-gray-100 truncate">
                                                    {{ order.shipping_address?.name || 'Guest User' }}
                                                </p>
                                                <p class="text-sm text-gray-500 truncate">
                                                    {{ order.user?.email || 'No email provided' }}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div class="pt-3 border-t border-gray-200 dark:border-gray-700">
                                            <div class="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                                <div class="w-5 flex-shrink-0">
                                                    <Phone class="w-4 h-4 text-accent" />
                                                </div>
                                                <span class="text-sm">{{ order.shipping_address?.phone || 'No phone provided' }}</span>
                                            </div>
                                            <div class="flex items-center gap-3 mt-3 text-gray-600 dark:text-gray-400">
                                                <div class="w-5 flex-shrink-0">
                                                    <Mail class="w-4 h-4 text-accent" />
                                                </div>
                                                <span class="text-sm truncate">{{ order.user?.email || 'Guest User' }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Delivery Information Card -->
                            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 crud-table-head/50">
                                    <div class="flex items-center gap-2">
                                        <Truck class="w-5 h-5 text-accent" />
                                        <h3 class="font-semibold text-gray-900 dark:text-gray-100">Delivery Information</h3>
                                    </div>
                                </div>
                                <div class="p-6">
                                    <div class="space-y-4">
                                        <div class="flex items-start gap-3">
                                            <MapPin class="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                                            <div class="min-w-0 flex-1">
                                                <p class="text-gray-900 dark:text-gray-100 font-medium mb-2 break-words">
                                                    {{ order.shipping_address?.address }}
                                                </p>
                                                <div class="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                                    <p>{{ order.shipping_address?.thana?.name }}, {{ order.shipping_address?.district?.name }}</p>
                                                    <p>{{ order.shipping_address?.division?.name }}</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div class="pt-3 border-t border-gray-200 dark:border-gray-700">
                                            <div class="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                                <Home class="w-4 h-4 text-accent" />
                                                <span>Delivery Address</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Customer Notes -->
                        <div v-if="order.notes" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h3 class="font-medium text-gray-900 dark:text-gray-100 mb-3">Customer Notes</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                {{ order.notes }}
                            </p>
                        </div>
                    </div>

                    <!-- Right Column - Admin & Payment Info (1/3 width) -->
                    <div class="space-y-6">
                        <!-- Order Actions Card -->
                        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 crud-table-head/50">
                                <div class="flex items-center justify-between">
                                    <h3 class="font-semibold text-gray-900 dark:text-gray-100">Order Actions</h3>
                                </div>
                            </div>
                            <div class="p-6 space-y-4">
                                <!-- Status Selector -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Order Status</label>
                                    <div class="relative">
                                        <select
                                            v-model="status"
                                            class="w-full appearance-none pl-4 pr-10 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-accent focus:border-accent"
                                        >
                                            <option v-for="option in statusOptions" :key="option" :value="option">
                                                {{ option }}
                                            </option>
                                        </select>
                                        <ChevronDown class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                <!-- Admin Note -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Admin Note</label>
                                    <textarea 
                                        v-model="adminNote" 
                                        rows="3"
                                        class="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-accent focus:border-accent"
                                        placeholder="Add a note about this order..."
                                    ></textarea>
                                </div>

                                <!-- Payment Status Toggle -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Status</label>
                                    <div class="flex items-center gap-3">
                                        <label class="inline-flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                v-model="isPaid" 
                                                class="sr-only peer"
                                            >
                                            <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/30 dark:peer-focus:ring-accent/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-accent"></div>
                                            <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">{{ isPaid ? 'Paid' : 'Unpaid' }}</span>
                                        </label>
                                    </div>
                                </div>

                                <!-- Update Button -->
                                <button 
                                    @click="updateOrder" 
                                    :disabled="isUpdating" 
                                    class="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors text-sm font-medium disabled:opacity-50"
                                >
                                    <Save class="w-4 h-4" />
                                    {{ isUpdating ? 'Updating...' : 'Update Order' }}
                                </button>
                            </div>
                        </div>

                        <!-- Payment Summary Card -->
                        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 crud-table-head/50">
                                <div class="flex items-center gap-2">
                                    <CreditCard class="w-5 h-5 text-accent" />
                                    <h3 class="font-semibold text-gray-900 dark:text-gray-100">Payment Summary</h3>
                                </div>
                            </div>
                            <div class="p-6">
                                <div class="space-y-3">
                                    <div class="flex justify-between text-sm">
                                        <span class="text-gray-600 dark:text-gray-400">Subtotal</span>
                                        <span class="font-medium text-gray-900 dark:text-gray-100">৳{{ order.subtotal }}</span>
                                    </div>
                                    <div class="flex justify-between text-sm">
                                        <span class="text-gray-600 dark:text-gray-400">Shipping</span>
                                        <span class="font-medium text-gray-900 dark:text-gray-100">৳{{ order.shipping_cost }}</span>
                                    </div>
                                    
                                    <!-- Special Discount Section -->
                                    <div class="flex items-center justify-between py-2 border-t border-gray-200 dark:border-gray-700">
                                        <span class="text-sm font-medium text-gray-900 dark:text-gray-100">Special Discount</span>
                                        <div class="flex items-center gap-2">
                                            <div class="relative">
                                                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">৳</span>
                                                <input 
                                                    type="number" 
                                                    v-model="specialDiscount"
                                                    min="0"
                                                    class="w-28 pl-7 pr-3 py-1.5 text-sm border rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-accent focus:border-accent text-right"
                                                >
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="pt-3 border-t-2 border-gray-200 dark:border-gray-700">
                                        <div class="flex justify-between items-center">
                                            <span class="font-bold text-gray-900 dark:text-gray-100">Total Payable</span>
                                            <span class="font-bold text-xl text-accent">৳{{ order.pay_amount }}</span>
                                        </div>
                                    </div>

                                    <!-- Payment Status -->
                                    <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <div class="flex items-center justify-between">
                                            <span class="text-sm text-gray-600 dark:text-gray-400">Payment Method</span>
                                            <span class="font-medium capitalize text-gray-900 dark:text-gray-100">{{ order.payment_type }}</span>
                                        </div>
                                        <div class="flex items-center justify-between mt-2">
                                            <span class="text-sm text-gray-600 dark:text-gray-400">Payment Status</span>
                                            <span 
                                                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                                :class="order.due_amount > 0 ? 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20' : 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20'"
                                            >
                                                {{ order.due_amount > 0 ? 'Unpaid' : 'Paid' }}
                                            </span>
                                        </div>
                                        <div v-if="order.due_amount > 0" class="mt-3 text-sm bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-3 rounded-lg">
                                            <span class="font-medium">Due Amount:</span> ৳{{ order.due_amount }}
                                        </div>
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