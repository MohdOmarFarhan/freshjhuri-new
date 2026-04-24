<script setup>
import { Link, router, Head } from "@inertiajs/vue3";
import { SquarePen, Trash, Plus } from "lucide-vue-next";
import { computed, ref } from "vue";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { confirmDeletion } from "@/helper/sweetAlertHelpers";
import AppLayout from "@/layouts/AppLayout.vue";
import { can } from "@/lib/can";

const props = defineProps({
    footers: {
        type: Object,
        required: true
    }
});

const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Footer", href: "/footer" },
];

const headers = [
    { text: "Serial", value: "serial" },
    { text: "Logo", value: "logo" },
    { text: "Mobile (EN)", value: "mobile_en" },
    { text: "Hotline (EN)", value: "hotline_en" },
    { text: "Copyright", value: "copyright" },
    { text: "Action", value: "action" },
];

const searchValue = ref("");

const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
};

const formattedFooters = computed(() => {
    const items = props.footers?.data ?? props.footers ?? [];
    return items.filter(item => {
        if (!searchValue.value) return true;
        const search = searchValue.value.toLowerCase();
        return item.mobile_en?.toLowerCase().includes(search) || 
               item.copyright?.toLowerCase().includes(search);
    }).map((footer, index) => ({
        serial: index + 1,
        id: footer.id,
        logo: getImageUrl(footer.logo),
        mobile_en: footer.mobile_en || "—",
        hotline_en: footer.hotline_en || "—",
        copyright: footer.copyright || "—",
    }));
});

const deleteFooter = (id) => {
    confirmDeletion(() => {
        router.delete(route("footer.delete", id));
    });
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Footer List" />

        <div class="lg:w-full mx-auto p-4 sm:p-2 lg:p-8">
            <Card>
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle class="text-xl font-bold">Footer Items</CardTitle>
                    <Button v-if="can('FOOTER_CREATE')" as-child>
                        <Link :href="route('footer.create')">
                            <Plus class="mr-2 h-4 w-4" /> Add Footer Item
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
                            placeholder="Search footer items..."
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
                                <tr v-for="item in formattedFooters" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {{ item.serial }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        <img v-if="item.logo" :src="item.logo" alt="Logo" class="h-10 w-auto object-contain" />
                                        <span v-else>—</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {{ item.mobile_en }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {{ item.hotline_en }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {{ item.copyright }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <Button v-if="can('FOOTER_EDIT')" variant="outline" size="icon" as-child>
                                            <Link :href="route('footer.edit', item.id)">
                                                <SquarePen class="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button v-if="can('FOOTER_DELETE')" variant="destructive" size="icon" @click="deleteFooter(item.id)">
                                            <Trash class="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                                <tr v-if="formattedFooters.length === 0">
                                    <td :colspan="headers.length" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                        No footer items found.
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
