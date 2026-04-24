<script setup>
import { Link, router, Head } from "@inertiajs/vue3";
import { confirmDeletion } from "@/helper/sweetAlertHelpers";
import { SquarePen, Trash, Plus } from "lucide-vue-next";
import { computed, ref } from "vue";
import Vue3EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from "@/layouts/AppLayout.vue";
import { can } from "@/lib/can";

const props = defineProps({
    bannars: {
        type: Object,
        required: true
    }
});

const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Bannars", href: "/bannars" },
];

const headers = [
    { text: "Serial", value: "serial", sortable: true },
    { text: "Image", value: "image", sortable: false },
    { text: "Title (EN)", value: "title_en", sortable: true },
    { text: "Title (BN)", value: "title_bn", sortable: true },
    { text: "Sort Order", value: "sort_order", sortable: true },
    { text: "Created At", value: "created_at", sortable: true },
    { text: "Action", value: "action", sortable: false },
];

const searchValue = ref("");
const sortBy = ref("");
const sortType = ref("asc");

const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
};

const formattedBannars = computed(() => {
    const items = props.bannars?.data ?? props.bannars ?? [];
    const startFrom = (props.bannars?.from ?? 1) - 1;
    return items.map((bannar, index) => ({
        serial: startFrom + index + 1,
        id: bannar.id,
        title_en: bannar.title_en || "—",
        title_bn: bannar.title_bn || "—",
        sort_order: bannar.sort_order || 0,
        image: bannar.image,
        image_url: getImageUrl(bannar.image),
        created_at: new Date(bannar.created_at).toLocaleDateString(),
    }));
});

const deleteBannar = (id) => {
    confirmDeletion(() => {
        router.delete(route("bannars.delete", id));
    });
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Bannar List" />

        <div class="lg:w-full mx-auto p-4 sm:p-2 lg:p-8">
            <Card>
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle class="text-xl font-bold">Bannars</CardTitle>
                    <Button v-if="can('BANNAR_CREATE')" as-child>
                        <Link :href="route('bannars.create')">
                            <Plus class="mr-2 h-4 w-4" /> Add Bannar
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <!-- Success Message -->
                    <div v-if="$page.props.flash?.message" class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded dark:bg-green-900/30 dark:border-green-800 dark:text-green-400">
                        {{ $page.props.flash.message }}
                    </div>

                    <div class="mb-4 flex justify-end">
                        <Input
                            v-model="searchValue"
                            type="text"
                            placeholder="Search bannars..."
                            class="max-w-sm"
                        />
                    </div>

                    <!-- Using plain table with Tailwind classes -->
                    <div class="crud-table-wrap">
                        <table class="crud-table">
                            <thead class="crud-table-head">
                                <tr>
                                    <th v-for="header in headers" :key="header.value" 
                                        class="crud-th"
                                        :class="{ 'cursor-pointer hover:text-gray-700 dark:hover:text-gray-300': header.sortable }"
                                        @click="header.sortable && (sortBy = header.value, sortType = sortType === 'asc' ? 'desc' : 'asc')"
                                    >
                                        <div class="flex items-center gap-1">
                                            {{ header.text }}
                                            <span v-if="sortBy === header.value" class="text-emerald-600 dark:text-emerald-400">
                                                {{ sortType === 'asc' ? '↑' : '↓' }}
                                            </span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="crud-table-body">
                                <tr v-for="bannar in formattedBannars" :key="bannar.id" class="crud-row">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{{ bannar.serial }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <img v-if="bannar.image_url" :src="bannar.image_url" alt="Bannar" class="h-10 w-10 rounded object-cover border border-gray-200 dark:border-gray-700">
                                        <Badge v-else variant="secondary" class="text-xs">No Image</Badge>
                                    </td>
                                    <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{{ bannar.title_en }}</td>
                                    <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{{ bannar.title_bn }}</td>
                                    <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{{ bannar.sort_order }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ bannar.created_at }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex space-x-2">
                                            <Button
                                                v-if="can('BANNAR_EDIT')"
                                                variant="ghost"
                                                size="icon"
                                                as-child
                                                class="text-green-600 hover:text-green-700 hover:bg-green-100 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/30"
                                            >
                                                <Link :href="route('bannars.edit', bannar.id)">
                                                    <SquarePen class="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                v-if="can('BANNAR_DELETE')"
                                                variant="ghost"
                                                size="icon"
                                                @click="deleteBannar(bannar.id)"
                                                class="text-red-600 hover:text-red-700 hover:bg-red-100 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/30"
                                            >
                                                <Trash class="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Simple Pagination with Tailwind -->
                    <div v-if="bannars?.links" class="mt-4 flex justify-between items-center">
                        <div class="text-sm text-gray-700 dark:text-gray-300">
                            Showing {{ bannars.from }} to {{ bannars.to }} of {{ bannars.total }} entries
                        </div>
                        <div class="flex gap-2">
                            <Button
                                v-for="(link, index) in bannars.links"
                                :key="index"
                                variant="outline"
                                size="sm"
                                :class="{
                                    'bg-emerald-500 text-white hover:bg-emerald-600 border-emerald-500': link.active,
                                    'opacity-50 cursor-not-allowed': !link.url
                                }"
                                :disabled="!link.url"
                                @click="link.url && router.get(link.url)"
                                v-html="link.label"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>