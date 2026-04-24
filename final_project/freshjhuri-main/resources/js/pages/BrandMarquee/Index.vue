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
import * as LucideIcons from 'lucide-vue-next';

const props = defineProps({
    marquees: {
        type: Object,
        required: true
    }
});

const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Brand Marquees", href: "/brand-marquees" },
];

const headers = [
    { text: "Serial", value: "serial", sortable: true },
    { text: "Icon", value: "icon", sortable: false },
    { text: "Text (EN)", value: "text_en", sortable: true },
    { text: "Text (BN)", value: "text_bn", sortable: true },
    { text: "Sort Order", value: "sort_order", sortable: true },
    { text: "Action", value: "action", sortable: false },
];

const searchValue = ref("");
const sortBy = ref("");
const sortType = ref("asc");

const formattedMarquees = computed(() => {
    const items = props.marquees?.data ?? props.marquees ?? [];
    const startFrom = (props.marquees?.from ?? 1) - 1;
    return items.map((marquee, index) => ({
        serial: startFrom + index + 1,
        ...marquee,
    }));
});

const deleteMarquee = (id) => {
    confirmDeletion(() => {
        router.delete(route("brand-marquees.destroy", id));
    });
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Brand Marquee List" />

        <div class="lg:w-full mx-auto p-4 sm:p-2 lg:p-8">
            <Card>
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle class="text-xl font-bold">Brand Marquees</CardTitle>
                    <Button as-child>
                        <Link :href="route('brand-marquees.create')">
                            <Plus class="mr-2 h-4 w-4" /> Add Marquee
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
                            placeholder="Search marquees..."
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
                                <tr v-for="marquee in formattedMarquees" :key="marquee.id" class="crud-row">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm">{{ marquee.serial }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div :class="['p-2 rounded-full inline-block', marquee.bg_color]">
                                            <component :is="LucideIcons[marquee.icon] || LucideIcons.Shield" :class="['w-5 h-5', marquee.color]" />
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 text-sm">{{ marquee.text_en }}</td>
                                    <td class="px-6 py-4 text-sm">{{ marquee.text_bn }}</td>
                                    <td class="px-6 py-4 text-sm">{{ marquee.sort_order }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex space-x-2">
                                            <Button variant="ghost" size="icon" as-child class="text-green-600">
                                                <Link :href="route('brand-marquees.edit', marquee.id)">
                                                    <SquarePen class="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" @click="deleteMarquee(marquee.id)" class="text-red-600">
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
