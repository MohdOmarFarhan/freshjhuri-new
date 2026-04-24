<script setup>
import { Link } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Eye, MessageSquare } from 'lucide-vue-next';
import Vue3EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";
import { useWindowSize } from '@vueuse/core';
import { computed } from 'vue';

const props = defineProps({
    orders: Array,
});

const { width } = useWindowSize();

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

const headers = computed(() => {
    const isMobile = width.value < 640;
    const allHeaders = [
        { text: "Order ID", value: "id", sortable: true },
        { text: "Date", value: "created_at", sortable: true },
        { text: "Total", value: "pay_amount", sortable: true },
        { text: "Status", value: "status", sortable: true },
        { text: "Payment", value: "payment_status" },
        { text: "Action", value: "action", sortable: false },
    ];
    
    if (isMobile) {
        return allHeaders.filter(h => h.value !== 'created_at' && h.value !== 'payment_status');
    }
    return allHeaders;
});

const items = props.orders.map(order => ({
    ...order,
    formatted_date: new Date(order.created_at).toLocaleDateString()
}));
</script>

<template>
    <AppLayout>
        <div class="max-w-full md:w-3/4 mx-auto py-6 sm:px-6 lg:px-8">
            <div class="px-4 py-6 sm:px-0">
                <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">My Orders</h1>

                <div class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                    <div class="overflow-x-auto">
                        <Vue3EasyDataTable
                            :headers="headers"
                            :items="items"
                            :rows-per-page="10"
                            table-class-name="customize-table"
                            alternating
                            border-cell
                            buttons-pagination
                        >
                            <template #item-id="{ id }">
                                <span class="font-medium">#{{ id }}</span>
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
                                    {{ due_amount > 0 ? 'Unpaid' : 'Paid' }}
                                </span>
                            </template>

                            <template #item-created_at="{ formatted_date }">
                                <span class="text-gray-500">{{ formatted_date }}</span>
                            </template>

                            <template #item-action="{ id, status }">
                                <div class="inline-flex items-center gap-1">
                                    <Link
                                        :href="route('user.orders.show', id)"
                                        class="inline-flex items-center justify-center p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                                        title="View Details"
                                    >
                                        <Eye class="w-5 h-5" />
                                    </Link>
                                    <Link
                                        v-if="status === 'Delivered'"
                                        :href="route('user.orders.show', id)"
                                        class="inline-flex items-center justify-center p-2 text-accent hover:bg-accent/10 rounded-full transition-colors"
                                        title="Write Review"
                                    >
                                        <MessageSquare class="w-5 h-5" />
                                    </Link>
                                </div>
                            </template>
                        </Vue3EasyDataTable>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
