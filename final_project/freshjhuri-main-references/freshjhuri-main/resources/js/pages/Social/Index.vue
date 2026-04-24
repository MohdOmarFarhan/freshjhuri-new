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
    socials: {
        type: Object,
        required: true
    }
});

const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Social", href: "/socials" },
];

const headers = [
    { text: "Serial", value: "serial" },
    { text: "Icon", value: "image" },
    { text: "Name", value: "name" },
    { text: "Link", value: "link" },
    { text: "Action", value: "action" },
];

const searchValue = ref("");

const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
};

const formattedSocials = computed(() => {
    const items = props.socials?.data ?? props.socials ?? [];
    return items.filter(item => {
        if (!searchValue.value) return true;
        const search = searchValue.value.toLowerCase();
        return item.name?.toLowerCase().includes(search) || 
               item.link?.toLowerCase().includes(search);
    }).map((social, index) => ({
        serial: index + 1,
        id: social.id,
        image: getImageUrl(social.image),
        name: social.name || "—",
        link: social.link || "—",
    }));
});

const deleteSocial = (id) => {
    confirmDeletion(() => {
        router.delete(route("social.destroy", id));
    });
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Social Media List" />

        <div class="lg:w-full mx-auto p-4 sm:p-2 lg:p-8">
            <Card>
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle class="text-xl font-bold">Social Media Items</CardTitle>
                    <Button v-if="can('SOCIAL_CREATE')" as-child>
                        <Link :href="route('social.create')">
                            <Plus class="mr-2 h-4 w-4" /> Add Social Media
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
                            placeholder="Search social media..."
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
                                <tr v-for="item in formattedSocials" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {{ item.serial }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        <img v-if="item.image" :src="item.image" alt="Icon" class="h-10 w-auto object-contain" />
                                        <span v-else>—</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {{ item.name }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        <a :href="item.link" target="_blank" class="text-blue-600 hover:underline">{{ item.link }}</a>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <Button v-if="can('SOCIAL_EDIT')" variant="outline" size="icon" as-child>
                                            <Link :href="route('social.edit', item.id)">
                                                <SquarePen class="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button v-if="can('SOCIAL_DELETE')" variant="destructive" size="icon" @click="deleteSocial(item.id)">
                                            <Trash class="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                                <tr v-if="formattedSocials.length === 0">
                                    <td :colspan="headers.length" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                        No social media items found.
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
