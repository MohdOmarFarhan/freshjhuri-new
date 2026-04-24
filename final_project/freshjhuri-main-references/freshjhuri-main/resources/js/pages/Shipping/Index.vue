<script setup>
import { Link, router, Head } from "@inertiajs/vue3";
import debounce from 'lodash/debounce';
import { SquarePen } from "lucide-vue-next";
import { computed, ref, watch } from "vue";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from "@/layouts/AppLayout.vue";

const props = defineProps({
    thanas: {
        type: Object,
        required: true
    },
    filters: {
        type: Object,
        default: () => ({})
    }
});

const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Shipping Management", href: route('admin.shipping.index') },
];

const headers = [
    { text: "Division", value: "division" },
    { text: "District", value: "district" },
    { text: "Thana", value: "name" },
    { text: "Shipping Cost", value: "shipping_cost" },
    { text: "Action", value: "action" },
];

const searchValue = ref(props.filters.search || "");

watch(searchValue, debounce((value) => {
    router.get(
        route('admin.shipping.index'),
        { search: value },
        { preserveState: true, replace: true }
    );
}, 300));

const formattedThanas = computed(() => {
    const items = props.thanas?.data ?? [];
    return items.map((thana) => ({
        id: thana.id,
        division: thana.district?.division?.name || "—",
        district: thana.district?.name || "—",
        name: thana.name || "—",
        shipping_cost: thana.shipping_cost,
    }));
});
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Shipping Management" />

        <div class="lg:w-full mx-auto p-4 sm:p-2 lg:p-8">
            <Card>
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle class="text-xl font-bold">Shipping Management</CardTitle>
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
                            placeholder="Search locations..."
                            class="max-w-sm"
                        />
                    </div>

                    <div class="crud-table-wrap">
                        <table class="crud-table">
                            <thead class="crud-table-head">
                                <tr>
                                    <th v-for="header in headers" :key="header.value"
                                        class="crud-th"
                                    >
                                        {{ header.text }}
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="crud-table-body">
                                <tr v-for="thana in formattedThanas" :key="thana.id" class="crud-row">
                                    <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{{ thana.division }}</td>
                                    <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{{ thana.district }}</td>
                                    <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{{ thana.name }}</td>
                                    <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {{ Number(thana.shipping_cost).toFixed(2) }} BDT
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                as-child
                                                class="text-green-600 hover:text-green-700 hover:bg-green-100 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/30"
                                            >
                                                <Link :href="route('admin.shipping.edit', thana.id)">
                                                    <SquarePen class="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination -->
                    <div v-if="thanas?.links?.length > 3" class="mt-4 flex flex-wrap justify-center gap-2">
                         <template v-for="(link, key) in thanas.links" :key="key">
                            <div
                                v-if="link.url === null"
                                class="mr-1 mb-1 px-4 py-3 text-sm leading-4 text-gray-400 border rounded"
                                v-html="link.label"
                            />
                            <Link
                                v-else
                                class="mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded hover:bg-white focus:border-indigo-500 focus:text-indigo-500"
                                :class="{ 'bg-blue-700 text-white': link.active }"
                                :href="link.url"
                                v-html="link.label"
                            />
                        </template>
                    </div>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
