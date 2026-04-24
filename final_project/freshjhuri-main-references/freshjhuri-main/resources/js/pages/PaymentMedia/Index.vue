<script setup>
import { Link, router, Head } from "@inertiajs/vue3";
import { debounce } from "lodash";
import { SquarePen, Trash, Plus } from "lucide-vue-next";
import { computed, ref, watch } from "vue";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { confirmDeletion } from "@/helper/sweetAlertHelpers";
import AppLayout from "@/layouts/AppLayout.vue";
import { can } from "@/lib/can";

const props = defineProps({
    paymentmedia: {
        type: Object,
        required: true
    },
    filters: {
        type: Object,
        default: () => ({ search: "" })
    }
});

const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Payment Media", href: "/payment-medias" },
];

const headers = [
    { text: "Serial", value: "serial" },
    { text: "Icon", value: "icon" },
    { text: "Name", value: "name" },
    { text: "Pay Number", value: "pay_number" },
    { text: "Action", value: "action" },
];

const searchValue = ref(props.filters.search || "");

const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
};

const formattedPaymentMedia = computed(() => {
    const items = props.paymentmedia?.data ?? props.paymentmedia ?? [];
    return items.map((media, index) => ({
        serial: index + 1,
        id: media.id,
        icon: getImageUrl(media.icon),
        name: media.name || "—",
        pay_number: media.pay_number || "—",
    }));
});

const deletePaymentMedia = (id) => {
    confirmDeletion(() => {
        router.delete(route("payment.media.destroy", id));
    });
};

watch(searchValue, debounce((value) => {
    router.get(
        route("payment.medias"),
        { search: value },
        { preserveState: true, replace: true }
    );
}, 300));
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Payment Media List" />

        <div class="lg:w-full mx-auto p-4 sm:p-2 lg:p-8">
            <Card>
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle class="text-xl font-bold">Payment Media Items</CardTitle>
                    <Button v-if="can('PAYMENT_MEDIA_CREATE')" as-child>
                        <Link :href="route('payment.media.create')">
                            <Plus class="mr-2 h-4 w-4" /> Add Payment Media
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <!-- Success Message -->
                    <div v-if="$page.props.flash?.success" class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded dark:bg-green-900/30 dark:border-green-800 dark:text-green-400">
                        {{ $page.props.flash.success }}
                    </div>

                    <div class="mb-4 flex justify-end">
                        <Input
                            v-model="searchValue"
                            type="text"
                            placeholder="Search payment media..."
                            class="max-w-sm"
                        />
                    </div>

                    <div class="crud-table-wrap">
                        <table class="crud-table">
                            <thead class="crud-table-head">
                                <tr>
                                    <th v-for="header in headers" :key="header.value" 
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                        {{ header.text }}
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                                <tr v-if="formattedPaymentMedia.length === 0">
                                    <td :colspan="headers.length" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                        No records found.
                                    </td>
                                </tr>
                                <tr v-for="item in formattedPaymentMedia" :key="item.id">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {{ item.serial }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <img v-if="item.icon" :src="item.icon" :alt="item.name" class="h-10 w-10 rounded-full object-cover" />
                                        <span v-else class="text-gray-400 text-sm">No Icon</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                        {{ item.name }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {{ item.pay_number }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div class="flex items-center gap-2">
                                            <Link 
                                                v-if="can('PAYMENT_MEDIA_EDIT')" 
                                                :href="route('payment.media.edit', item.id)"
                                                class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                <SquarePen class="h-4 w-4" />
                                            </Link>
                                            <button 
                                                v-if="can('PAYMENT_MEDIA_DELETE')" 
                                                @click="deletePaymentMedia(item.id)"
                                                class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                            >
                                                <Trash class="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
