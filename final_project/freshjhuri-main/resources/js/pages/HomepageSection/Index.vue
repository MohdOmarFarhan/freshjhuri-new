<script setup>
import { Link, router, Head } from "@inertiajs/vue3";
import { confirmDeletion } from "@/helper/sweetAlertHelpers";
import { SquarePen, Trash, Plus } from "lucide-vue-next";
import { computed, ref } from "vue";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from "@/layouts/AppLayout.vue";

const props = defineProps({
    sections: {
        type: Object,
        required: true
    }
});

const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Homepage Sections", href: "/homepage-sections" },
];

const headers = [
    { text: "Serial", value: "serial", sortable: true },
    { text: "Title (EN)", value: "title_en", sortable: true },
    { text: "Type", value: "type", sortable: true },
    { text: "Category", value: "category_id", sortable: true },
    { text: "Sort Order", value: "sort_order", sortable: true },
    { text: "Status", value: "status", sortable: true },
    { text: "Action", value: "action", sortable: false },
];

const searchValue = ref("");
const sortBy = ref("");
const sortType = ref("asc");

const formattedSections = computed(() => {
    const items = props.sections?.data ?? props.sections ?? [];
    const startFrom = (props.sections?.from ?? 1) - 1;
    return items.map((section, index) => ({
        serial: startFrom + index + 1,
        ...section,
    }));
});

const deleteSection = (id) => {
    confirmDeletion(() => {
        router.delete(route("homepage-sections.destroy", id));
    });
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Homepage Sections" />

        <div class="lg:w-full mx-auto p-4 sm:p-2 lg:p-8">
            <Card>
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle class="text-xl font-bold">Homepage Sections</CardTitle>
                    <Button as-child>
                        <Link :href="route('homepage-sections.create')">
                            <Plus class="mr-2 h-4 w-4" /> Add Section
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <div v-if="$page.props.flash?.message" class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded dark:bg-green-900/30 dark:border-green-800 dark:text-green-400">
                        {{ $page.props.flash.message }}
                    </div>

                    <div class="mb-4 flex justify-end">
                        <Input
                            v-model="searchValue"
                            type="text"
                            placeholder="Search sections..."
                            class="max-w-sm"
                        />
                    </div>

                    <div class="crud-table-wrap">
                        <table class="crud-table">
                            <thead class="crud-table-head">
                                <tr>
                                    <th v-for="header in headers" :key="header.value" class="crud-th">
                                        {{ header.text }}
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="crud-table-body">
                                <tr v-for="section in formattedSections" :key="section.id" class="crud-row">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm">{{ section.serial }}</td>
                                    <td class="px-6 py-4 text-sm font-semibold" :style="{ color: section.theme_color }">{{ section.title_en }}</td>
                                    <td class="px-6 py-4 text-sm capitalize">
                                        <Badge variant="outline">{{ section.type }}</Badge>
                                    </td>
                                    <td class="px-6 py-4 text-sm">{{ section.category ? section.category.name_en : '—' }}</td>
                                    <td class="px-6 py-4 text-sm">{{ section.sort_order }}</td>
                                    <td class="px-6 py-4 text-sm">
                                        <Badge :variant="section.status ? 'default' : 'secondary'">{{ section.status ? 'Active' : 'Inactive' }}</Badge>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex space-x-2">
                                            <Button variant="ghost" size="icon" as-child class="text-green-600">
                                                <Link :href="route('homepage-sections.edit', section.id)">
                                                    <SquarePen class="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" @click="deleteSection(section.id)" class="text-red-600">
                                                <Trash class="h-4 w-4" />
                                            </Button>
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
