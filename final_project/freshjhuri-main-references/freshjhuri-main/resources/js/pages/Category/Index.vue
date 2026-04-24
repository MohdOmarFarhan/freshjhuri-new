<script setup>
import { Link, router, Head } from "@inertiajs/vue3";
import { SquarePen, Trash, Plus } from "lucide-vue-next";
import { computed, ref } from "vue";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { confirmDeletion } from "@/helper/sweetAlertHelpers";
import AppLayout from "@/layouts/AppLayout.vue";
import { can } from "@/lib/can";

const props = defineProps({
    categories: {
        type: Object,
        required: true
    }
});

const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Categories", href: "/categories" },
];

const headers = [
    { text: "Serial", value: "serial", sortable: true },
    { text: "Sort Order", value: "sort_order", sortable: true },
    { text: "Image", value: "image", sortable: false },
    { text: "Name (EN)", value: "name_en", sortable: true },
    { text: "Name (BN)", value: "name_bn", sortable: true },
    { text: "Featured", value: "is_featured", sortable: true },
    { text: "Status", value: "status", sortable: true },
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

const formattedCategories = computed(() => {
    const items = props.categories?.data ?? props.categories ?? [];
    const startFrom = (props.categories?.from ?? 1) - 1;
    return items.map((category, index) => ({
        serial: startFrom + index + 1,
        id: category.id,
        sort_order: category.sort_order ?? 0,
        name_en: category.name_en || "—",
        name_bn: category.name_bn || "—",
        image: category.image,
        image_url: getImageUrl(category.image),
        is_featured: Boolean(category.is_featured),
        status: category.status,
        created_at: new Date(category.created_at).toLocaleDateString(),
    }));
});

const deleteCategory = (id) => {
    confirmDeletion(() => {
        router.delete(route("categories.delete", id));
    });
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Category List" />

        <div class="lg:w-full mx-auto p-4 sm:p-2 lg:p-8">
            <Card>
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle class="text-xl font-bold">Categories</CardTitle>
                    <Button v-if="can('CATEGORY_CREATE')" as-child>
                        <Link :href="route('categories.create')">
                            <Plus class="mr-2 h-4 w-4" /> Add Category
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
                            placeholder="Search categories..."
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
                                <tr v-for="category in formattedCategories" :key="category.id" class="crud-row">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{{ category.serial }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{{ category.sort_order }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <img v-if="category.image_url" :src="category.image_url" alt="Category" class="h-10 w-10 rounded object-cover border border-gray-200 dark:border-gray-700">
                                        <Badge v-else variant="secondary" class="text-xs">No Image</Badge>
                                    </td>
                                    <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{{ category.name_en }}</td>
                                    <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{{ category.name_bn }}</td>

                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <Badge
                                            :class="[
                                                'text-xs px-2 py-1 rounded-full font-medium',
                                                category.is_featured
                                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                                                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                                            ]"
                                            variant="outline"
                                        >
                                            {{ category.is_featured ? 'Yes' : 'No' }}
                                        </Badge>
                                    </td>

                                    <!-- Status Column with Green for Active, Red for Inactive -->
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <Badge
                                            :class="[
                                                'text-xs px-2 py-1 rounded-full font-medium',
                                                category.status
                                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                                                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800'
                                            ]"
                                            variant="outline"
                                        >
                                            <span class="flex items-center gap-1">
                                                <span :class="['w-1.5 h-1.5 rounded-full', category.status ? 'bg-emerald-500' : 'bg-red-500']"></span>
                                                {{ category.status ? 'Active' : 'Inactive' }}
                                            </span>
                                        </Badge>
                                    </td>

                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ category.created_at }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex space-x-2">
                                            <Button
                                                v-if="can('CATEGORY_EDIT')"
                                                variant="ghost"
                                                size="icon"
                                                as-child
                                                class="text-green-600 hover:text-green-700 hover:bg-green-100 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/30"
                                            >
                                                <Link :href="route('categories.edit', category.id)">
                                                    <SquarePen class="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                v-if="can('CATEGORY_DELETE')"
                                                variant="ghost"
                                                size="icon"
                                                @click="deleteCategory(category.id)"
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
                    <div v-if="categories?.links" class="mt-4 flex justify-between items-center">
                        <div class="text-sm text-gray-700 dark:text-gray-300">
                            Showing {{ categories.from }} to {{ categories.to }} of {{ categories.total }} entries
                        </div>
                        <div class="flex gap-2">
                            <Button
                                v-for="(link, index) in categories.links"
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
