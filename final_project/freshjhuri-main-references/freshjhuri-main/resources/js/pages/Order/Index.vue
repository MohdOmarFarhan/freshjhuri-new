<script setup>
import { router, Link } from '@inertiajs/vue3';
import { useDebounceFn } from '@vueuse/core';
import { Search, Eye, Trash2 } from 'lucide-vue-next';
import { ref, watch, computed } from 'vue';
import Vue3EasyDataTable from "vue3-easy-data-table";
import { confirmDeletion } from '@/helper/sweetAlertHelpers';
import AppLayout from '@/layouts/AppLayout.vue';
import { can } from '@/lib/can';
import "vue3-easy-data-table/dist/style.css";

const props = defineProps({
    orders: Object,
    filters: Object,
});

const search = ref(props.filters.search || '');
const status = ref(props.filters.status || 'All');
const selectedOrders = ref([]);

const statusOptions = [
    'All', 'Pending', 'Confirmed', 'Hold', 'Processing', 'Shipping', 'Delivered', 'Cancelled'
];

const deleteSelected = () => {
    if (selectedOrders.value.length === 0) return;
    
    confirmDeletion(() => {
        router.post(route('orders.bulk-destroy'), {
            ids: selectedOrders.value.map(item => item.id)
        }, {
            preserveScroll: true,
            onSuccess: () => {
                selectedOrders.value = [];
            }
        });
    });
};

watch(
    [search, status],
    useDebounceFn(([searchValue, statusValue]) => {
        router.get(route('orders.index'), { search: searchValue, status: statusValue }, { preserveState: true, replace: true });
    }, 300)
);

const getStatusColor = (status) => {
    switch (status) {
        case 'Pending': return 'bg-yellow-100 text-yellow-800';
        case 'Confirmed': return 'bg-blue-100 text-blue-800';
        case 'Processing': return 'bg-indigo-100 text-indigo-800';
        case 'Shipping': return 'bg-purple-100 text-purple-800';
        case 'Delivered': return 'bg-green-100 text-green-800';
        case 'Cancelled': return 'bg-red-100 text-red-800';
        case 'Hold': return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const deleteOrder = (id) => {
    confirmDeletion(() => {
        router.delete(route('orders.destroy', id), {
            preserveScroll: true,
        });
    });
};

const headers = [
    { text: "Order ID", value: "id", sortable: true },
    { text: "Customer", value: "customer_name" },
    { text: "Phone", value: "customer_phone" },
    { text: "Subtotal", value: "subtotal", sortable: true },
    { text: "Shipping", value: "shipping_cost", sortable: true },
    { text: "Discount", value: "special_discount", sortable: true },
    { text: "Total", value: "pay_amount", sortable: true },
    { text: "Status", value: "status", sortable: true },
    { text: "Payment", value: "payment_status" },
    { text: "Date", value: "created_at", sortable: true },
    { text: "Print", value: "print", sortable: false },
    { text: "Details", value: "details", sortable: false },
    { text: "Delete", value: "delete", sortable: false },
];

const items = computed(() => {
    return props.orders.data.map(order => ({
        ...order,
        customer_name: order.shipping_address?.name || 'N/A',
        customer_phone: order.shipping_address?.phone || 'N/A',
        formatted_date: new Date(order.created_at).toLocaleDateString()
    }));
});
</script>

<template>
    <AppLayout>
        <div class="space-y-6 p-2">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                    <h2 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Orders</h2>
                    <button
                        v-if="selectedOrders.length > 0 && can('ORDER_DELETE')"
                        @click="deleteSelected"
                        class="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                        <Trash2 class="w-4 h-4" />
                        Delete ({{ selectedOrders.length }})
                    </button>
                </div>
                
                <div class="flex flex-col sm:flex-row gap-4">
                    <!-- Status Filter -->
                    <select
                        v-model="status"
                        class="rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-accent focus:border-accent"
                    >
                        <option v-for="option in statusOptions" :key="option" :value="option">
                            {{ option }}
                        </option>
                    </select>

                    <!-- Search -->
                    <div class="relative max-w-sm w-full">
                        <input
                            v-model="search"
                            type="text"
                            placeholder="Search orders..."
                            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden shadow-sm p-4">
                <Vue3EasyDataTable
                    v-model:items-selected="selectedOrders"
                    :headers="headers"
                    :items="items"
                    :rows-per-page="25"
                    table-class-name="customize-table"
                    alternating
                    buttons-pagination
                    border-cell
                >
                    <template #item-id="{ id }">
                        <span class="font-medium">#{{ id }}</span>
                    </template>
                    
                    <template #item-subtotal="{ subtotal }">
                        <span class="font-medium">৳{{ subtotal }}</span>
                    </template>

                    <template #item-shipping_cost="{ shipping_cost }">
                        <span class="font-medium">৳{{ shipping_cost }}</span>
                    </template>

                    <template #item-special_discount="{ special_discount }">
                        <span class="font-medium text-red-600" v-if="special_discount > 0">-৳{{ special_discount }}</span>
                        <span class="text-gray-400" v-else>-</span>
                    </template>

                    <template #item-pay_amount="{ pay_amount }">
                        <span class="font-bold text-primary">৳{{ pay_amount }}</span>
                    </template>

                    <template #item-status="{ status }">
                        <span
                            class="px-2.5 py-0.5 rounded-full text-xs font-medium"
                            :class="getStatusColor(status)"
                        >
                            {{ status }}
                        </span>
                    </template>

                    <template #item-payment_status="{ due_amount }">
                        <span
                            class="px-2.5 py-0.5 rounded-full text-xs font-medium"
                            :class="due_amount > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'"
                        >
                            {{ due_amount > 0 ? `Due: ৳${due_amount}` : 'Paid' }}
                        </span>
                    </template>

                    <template #item-created_at="{ formatted_date }">
                        <span class="text-gray-500">{{ formatted_date }}</span>
                    </template>

                    <template #item-print="{ id }">
                        <Link
                            v-if="can('ORDER_SHOW')"
                            :href="route('orders.print', id)"
                            class="font-medium text-primary hover:underline"
                        >
                            Print
                        </Link>
                    </template>

                    <template #item-details="{ id }">
                        <Link
                            v-if="can('ORDER_SHOW')"
                            :href="route('orders.show', id)"
                            class="inline-flex items-center justify-center p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                            title="Order Details"
                        >
                            <Eye class="w-5 h-5" />
                        </Link>
                    </template>

                    <template #item-delete="{ id }">
                        <button
                            v-if="can('ORDER_DELETE')"
                            type="button"
                            @click="deleteOrder(id)"
                            class="inline-flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete Order"
                        >
                            <Trash2 class="w-5 h-5" />
                        </button>
                    </template>
                </Vue3EasyDataTable>
                
                <!-- Custom Pagination for Server Side -->
                 <div class="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-4">
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                        Showing <span class="font-medium">{{ orders.from || 0 }}</span> to <span class="font-medium">{{ orders.to || 0 }}</span> of <span class="font-medium">{{ orders.total || 0 }}</span> results
                    </div>
                    <nav
                        v-if="orders?.links?.length > 3"
                        class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                        aria-label="Pagination"
                    >
                        <Link
                            v-for="(link, index) in orders.links"
                            :key="index"
                            :href="link.url || '#'"
                            class="relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors focus:z-20 focus:outline-offset-0 focus:ring-1 focus:ring-primary"
                            :class="{
                                'z-10 bg-primary text-white border-primary': link.active,
                                'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700': !link.active,
                                'opacity-50 cursor-not-allowed pointer-events-none': !link.url,
                                'rounded-l-md': index === 0,
                                'rounded-r-md': index === orders.links.length - 1,
                            }"
                        >
                            <span v-html="link.label"></span>
                        </Link>
                    </nav>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
